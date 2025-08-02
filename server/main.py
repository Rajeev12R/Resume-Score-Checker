# server/main.py

from fastapi import FastAPI, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re
import pdfplumber
import docx2txt
from io import BytesIO
from typing import Optional, List, Dict
import asyncio
from datetime import datetime
import requests
from collections import Counter
import random
import time
from datetime import datetime, timedelta
import logging

# Load environment variables
load_dotenv()

class SmartAPIKeyManager:
    def __init__(self, api_keys: List[str]):
        self.api_keys = api_keys
        self.key_status = {}  # Track key health and usage
        self.current_key_index = 0
        self.last_rotation = time.time()
        self.rotation_interval = 300  # 5 minutes between rotations
        
        # Initialize key status
        for key in api_keys:
            self.key_status[key] = {
                'healthy': True,
                'last_used': 0,
                'error_count': 0,
                'cooldown_until': 0,
                'daily_reset': datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
            }
        
        print(f"🔑 Initialized with {len(api_keys)} API keys")
    
    def get_active_key(self) -> str:
        """Get the best available API key with smart rotation"""
        current_time = time.time()
        
        # Reset daily counters if needed
        self._reset_daily_status()
        
        # Remove keys from cooldown
        self._update_cooldowns()
        
        # Strategy 1: Try round-robin rotation with time-based switching
        if current_time - self.last_rotation > self.rotation_interval:
            self._rotate_to_next_healthy_key()
            self.last_rotation = current_time
        
        # Strategy 2: If current key is unhealthy, find a healthy one
        current_key = self.api_keys[self.current_key_index]
        if not self._is_key_healthy(current_key):
            healthy_key = self._find_healthy_key()
            if healthy_key:
                self.current_key_index = self.api_keys.index(healthy_key)
                current_key = healthy_key
                print(f"🔄 Switched to healthy key: ...{current_key[-8:]}")
        
        # Update usage tracking
        self.key_status[current_key]['last_used'] = current_time
        return current_key
    
    def mark_key_error(self, api_key: str, error_message: str = ""):
        """Mark a key as having errors for smart fallback"""
        if api_key in self.key_status:
            self.key_status[api_key]['error_count'] += 1
            
            # If quota exceeded, put in longer cooldown
            if 'quota' in error_message.lower() or 'limit' in error_message.lower():
                self.key_status[api_key]['cooldown_until'] = time.time() + 3600  # 1 hour cooldown
                self.key_status[api_key]['healthy'] = False
                print(f"⚠️  Key quota exceeded, cooling down: ...{api_key[-8:]}")
            
            # If too many errors, mark unhealthy temporarily
            elif self.key_status[api_key]['error_count'] >= 3:
                self.key_status[api_key]['cooldown_until'] = time.time() + 600  # 10 min cooldown
                self.key_status[api_key]['healthy'] = False
                print(f"⚠️  Key marked unhealthy due to errors: ...{api_key[-8:]}")
    
    def mark_key_success(self, api_key: str):
        """Mark a key as working successfully"""
        if api_key in self.key_status:
            self.key_status[api_key]['error_count'] = max(0, self.key_status[api_key]['error_count'] - 1)
            self.key_status[api_key]['healthy'] = True
    
    def _is_key_healthy(self, api_key: str) -> bool:
        """Check if a key is currently healthy"""
        status = self.key_status.get(api_key, {})
        return (status.get('healthy', True) and 
                time.time() > status.get('cooldown_until', 0))
    
    def _find_healthy_key(self) -> Optional[str]:
        """Find the best healthy key to use"""
        healthy_keys = [key for key in self.api_keys if self._is_key_healthy(key)]
        
        if not healthy_keys:
            # All keys are unhealthy, use the one with shortest cooldown
            return min(self.api_keys, 
                      key=lambda k: self.key_status[k].get('cooldown_until', 0))
        
        # Return random healthy key for load balancing
        return random.choice(healthy_keys)
    
    def _rotate_to_next_healthy_key(self):
        """Rotate to the next healthy key in sequence"""
        for _ in range(len(self.api_keys)):
            self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
            if self._is_key_healthy(self.api_keys[self.current_key_index]):
                break
    
    def _update_cooldowns(self):
        """Remove expired cooldowns"""
        current_time = time.time()
        for key in self.key_status:
            if current_time > self.key_status[key]['cooldown_until']:
                self.key_status[key]['healthy'] = True
    
    def _reset_daily_status(self):
        """Reset daily counters at midnight"""
        now = datetime.now()
        for key in self.key_status:
            if now > self.key_status[key]['daily_reset']:
                self.key_status[key]['error_count'] = 0
                self.key_status[key]['healthy'] = True
                self.key_status[key]['cooldown_until'] = 0
                self.key_status[key]['daily_reset'] = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    
    def get_status_report(self) -> Dict:
        """Get current status of all keys"""
        report = {}
        for i, key in enumerate(self.api_keys):
            status = self.key_status[key]
            report[f"Key_{i+1}"] = {
                'healthy': status['healthy'],
                'error_count': status['error_count'],
                'in_cooldown': time.time() < status['cooldown_until'],
                'is_current': i == self.current_key_index
            }
        return report

app = FastAPI()

# Allow CORS from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Gemini API
api_keys_str = os.getenv("GEMINI_API_KEYS")
if not api_keys_str:
    raise ValueError("No GEMINI_API_KEYS found in environment variables")

api_keys_list = [key.strip() for key in api_keys_str.split(",") if key.strip()]
if not api_keys_list:
    raise ValueError("No valid API keys found in GEMINI_API_KEYS")

# Initialize the smart key manager
key_manager = SmartAPIKeyManager(api_keys_list)

# Configure with initial key
genai.configure(api_key=key_manager.get_active_key())

async def smart_gemini_call(prompt: str, generation_config: dict = None, max_retries: int = 3):
    """
    Smart Gemini API call with automatic key rotation and error handling
    """
    for attempt in range(max_retries):
        try:
            # Get the best available key
            current_key = key_manager.get_active_key()
            
            # Configure API with current key
            genai.configure(api_key=current_key)
            
            # Make the API call
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            if generation_config:
                response = await model.generate_content_async(prompt, generation_config=generation_config)
            else:
                response = await model.generate_content_async(prompt)
            
            # Mark success
            key_manager.mark_key_success(current_key)
            
            return response
            
        except Exception as e:
            error_msg = str(e).lower()
            
            # Mark key error for smart fallback
            key_manager.mark_key_error(current_key, error_msg)
            
            # If it's a quota/limit error and we have more attempts, try another key
            if ('quota' in error_msg or 'limit' in error_msg or 'rate' in error_msg) and attempt < max_retries - 1:
                print(f"🔄 API limit hit, rotating to next key (attempt {attempt + 1}/{max_retries})")
                continue
            
            # If final attempt or non-quota error, raise the exception
            if attempt == max_retries - 1:
                print(f"❌ All API attempts failed. Error: {str(e)}")
                raise e
            
    raise Exception("All API key attempts exhausted")

def extract_text_from_pdf(file_content):
    """Extract text from PDF using pdfplumber"""
    try:
        with pdfplumber.open(BytesIO(file_content)) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text.strip()
    except Exception as e:
        print(f"Error extracting PDF with pdfplumber: {e}")
        return None

def extract_text_from_docx(file_content):
    """Extract text from DOCX file"""
    try:
        return docx2txt.process(BytesIO(file_content))
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return None

def extract_text_from_doc(file_content):
    """Extract text from DOC file (basic fallback)"""
    try:
        text = file_content.decode('utf-8', errors='ignore')
        return text
    except Exception as e:
        print(f"Error extracting DOC: {e}")
        return None

def get_salary_insights(job_title, location="United States"):
    """Get salary insights for the job role"""
    salary_data = {
        "average_salary": "Not available",
        "salary_range": "Please check job market websites",
        "location": location,
        "note": "Integrate with salary APIs for real data"
    }
    return salary_data

async def analyze_job_market_trends(job_title, skills_list):
    """Analyze current job market trends"""
    return {
        "trending_skills": ["AI/ML", "Cloud Computing", "Python", "React", "Docker"],
        "job_growth": "High demand",
        "remote_opportunities": "Widely available",
        "certifications_recommended": ["AWS", "Google Cloud", "Microsoft Azure"],
        "note": "Based on general market trends - integrate with job board APIs for real-time data"
    }

def build_analysis_prompt(jd_text: str, resume_text: str) -> str:
    """Construct the structured prompt for resume analysis"""
    return f"""
# Role: Expert ATS Analyst and Career Counselor
## Task: Analyze resume against job description with high precision
## Inputs:
<JOB_DESCRIPTION>
{jd_text}
</JOB_DESCRIPTION>

<RESUME_CONTENT>
{resume_text}
</RESUME_CONTENT>

## Instructions:
Produce JSON output with structured analysis in these sections:
1. ATS Score (based on keyword match, formatting, and readability)
2. Missing Skills (semantic and keyword matching)
3. Grammar and Spelling Feedback
4. Projects Analysis
5. Interview Preparation
6. Overall Recommendations

Format sections as follows:

### SECTION 1: ATS Score Analysis
- Calculate score (0-100) using:
  40% keyword matching (explicit and semantic)
  30% resume structure (clear sections, reverse-chronological)
  30% readability (concise phrasing, action verbs)
- Provide breakdown with specific metrics
- List top 5 matched keywords from JD
- List top 5 missing keywords from JD

### SECTION 2: Missing Skills Analysis
- Identify hard and soft skills gap using:
  - Explicit keyword matching
  - Semantic similarity for equivalent terms
- For each missing skill:
  - Classify importance (Critical/Important/Nice-to-have)
  - Provide specific learning resources (free & paid)
  - Suggest demonstration methods (projects/certifications)

### SECTION 3: Grammar and Spelling Feedback
- Only analyze grammar and spelling mistakes
- For each issue:
  - Identify section or line number
  - Classify as:
    - Spelling mistake
    - Grammar issue (subject-verb agreement, article/preposition use)
  - Provide corrected version with a professional alternative
- Score overall writing quality (1-10) and explain in 1–2 lines

### SECTION 4: Projects Analysis
- Evaluate each project for:
  - Relevance to JD requirements
  - Technical depth demonstrated
  - Quantifiable results (metrics/impact)
  - Business value created
- Flag projects needing stronger impact statements
- Suggest improvements to increase clarity and value

### SECTION 5: Interview Preparation
- Generate 8-10 technical questions based on:
  - Resume projects/experience
  - JD technical requirements
- Generate 5 behavioral questions based on:
  - Resume leadership/team experiences
  - JD soft skills requirements
- Suggest portfolio enhancements specific to role

### SECTION 6: Overall Recommendations
- Prioritize 5 key improvements with:
  - Expected impact (High/Medium/Low)
  - Implementation difficulty (Easy/Medium/Hard)
  - Time required (Immediate/1 Week/1 Month)
- Provide specific before/after examples for:
  - Skill quantification
  - Project impact statements
  - Professional summary

## Output Format:
{{
  "ats_score": {{
    "overall": 0-100,
    "breakdown": {{
      "keyword_match": 0-100,
      "structure": 0-100,
      "readability": 0-100
    }},
    "matched_keywords": ["list", "of", "matched", "terms"],
    "missing_keywords": ["list", "of", "missing", "terms"],
    "explanation": "Detailed analysis in points format"
  }},
  "missing_skills": [
    {{
      "skill": "Python",
      "type": "Hard Skill",
      "importance": "Critical",
      "learning_resources": [
        "Resource 1",
        "Resource 2"
      ],
      "demonstration_strategy": "Build project using X"
    }}
  ],
  "grammar_feedback": {{
    "score": 1-10,
    "error_count": 0,
    "issues": [
      {{
        "type": "Spelling mistake",
        "original": "maneged",
        "suggestion": "managed",
        "context": "Experience section"
      }},
      {{
        "type": "Grammar issue",
        "original": "She work on project",
        "suggestion": "She works on the project",
        "context": "Projects section"
      }}
    ],
    "overall_quality": "Professional/Good/Needs Improvement"
  }},
  "projects_analysis": [
    {{
      "project_name": "Project X",
      "relevance": "High/Medium/Low",
      "strengths": ["Used relevant tech Y"],
      "weaknesses": ["Lacks metrics"],
      "improvements": [
        "Add: 'Improved response time by 30%'",
        "Clarify tech stack and outcome"
      ]
    }}
  ],
  "interview_preparation": {{
    "technical_questions": [
      "How did you implement [specific resume tech] in Project X?"
    ],
    "behavioral_questions": [
      "Describe a time when you resolved a team conflict."
    ],
    "portfolio_suggestions": [
      "Add demo link for [JD requirement]"
    ]
  }},
  "recommendations": [
    {{
      "priority": "High",
      "action": "Quantify project impacts",
      "example_before": "Developed CRM system",
      "example_after": "Developed CRM that reduced support tickets by 25%",
      "impact": "High",
      "difficulty": "Easy",
      "timeline": "Immediate"
    }}
  ]
}}

## Critical Requirements:
- Use structured headings with Markdown formatting in explanations
- For skills: Distinguish between hard/soft skills
- For projects: Use JD-specific relevance assessment
- For interview questions: Reference specific resume content
- For grammar: Provide exact replacements with professional alternatives
- Quantify improvements whenever possible
"""

@app.post("/analyze/")
async def analyze_resume(
    resume: UploadFile, 
    jd_text: str = Form(...),
    include_market_analysis: bool = Form(False),
    include_salary_insights: bool = Form(False),
    target_role: Optional[str] = Form(None)
):
    try:
        content = await resume.read()
        file_extension = resume.filename.lower().split('.')[-1] if resume.filename else ""
        
        if file_extension == 'pdf':
            resume_text = extract_text_from_pdf(content)
        elif file_extension == 'docx':
            resume_text = extract_text_from_docx(content)
        elif file_extension == 'doc':
            resume_text = extract_text_from_doc(content)
        else:
            resume_text = content.decode("utf-8", errors="ignore")
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=422, 
                detail="Could not extract readable text from the resume. Please ensure the file is not corrupted and contains readable text."
            )

        # Build enhanced prompt
        prompt = build_analysis_prompt(jd_text, resume_text)
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = await smart_gemini_call(prompt)
        
        # Clean the response text to extract only the JSON
        response_text = response.text.strip()
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        
        if json_match:
            json_str = json_match.group()
            try:
                parsed_result = json.loads(json_str)
                
                # Add additional analyses if requested
                if include_market_analysis and target_role:
                    market_analysis = await analyze_job_market_trends(target_role, [])
                    parsed_result["market_analysis"] = market_analysis
                
                if include_salary_insights and target_role:
                    salary_insights = get_salary_insights(target_role)
                    parsed_result["salary_insights"] = salary_insights
                
                return JSONResponse(content={"result": parsed_result})
            except json.JSONDecodeError:
                return JSONResponse(content={"error": "JSON parsing failed", "raw_response": response_text})
        else:
            return JSONResponse(content={"error": "No JSON found in response", "raw_response": response_text})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =====================================================================================
# ENHANCED COVER LETTER GENERATION WITH HUMAN-CENTRIC OPTIMIZATION
# =====================================================================================

def get_industry_insights(industry: str) -> dict:
    """Get comprehensive industry-specific insights for cover letter optimization"""
    industry_data = {
        "technology": {
            "key_values": ["innovation", "scalability", "user experience", "technical excellence", "agility"],
            "preferred_tone": "technical yet accessible, confident",
            "focus_areas": ["problem-solving", "technical impact", "product outcomes", "team collaboration", "continuous learning"],
            "power_verbs": ["engineered", "architected", "optimized", "deployed", "scaled", "automated", "innovated"],
            "avoid_phrases": ["worked on", "helped with", "was responsible for", "team player"],
            "keywords_priority": ["full-stack", "APIs", "cloud", "microservices", "CI/CD", "performance", "scalability"],
            "story_angles": ["technical challenges overcome", "system improvements", "user impact", "efficiency gains"],
            "company_research_focus": ["recent product launches", "technical stack", "engineering culture", "growth metrics"]
        },
        "finance": {
            "key_values": ["accuracy", "compliance", "risk management", "data-driven decisions", "fiduciary responsibility"],
            "preferred_tone": "precise, analytical, trustworthy",
            "focus_areas": ["analytical rigor", "regulatory compliance", "risk assessment", "process improvement", "stakeholder management"],
            "power_verbs": ["analyzed", "forecasted", "mitigated", "optimized", "structured", "validated", "streamlined"],
            "avoid_phrases": ["approximately", "roughly", "I think", "might have"],
            "keywords_priority": ["financial modeling", "risk analysis", "compliance", "ROI", "budgeting", "forecasting"],
            "story_angles": ["cost savings achieved", "risk mitigation", "process improvements", "regulatory successes"],
            "company_research_focus": ["financial performance", "regulatory environment", "market position", "recent transactions"]
        },
        "healthcare": {
            "key_values": ["patient outcomes", "safety", "evidence-based practice", "compassion", "continuous improvement"],
            "preferred_tone": "caring yet professional, detail-oriented",
            "focus_areas": ["patient care quality", "safety protocols", "interdisciplinary collaboration", "compliance", "outcomes measurement"],
            "power_verbs": ["improved", "implemented", "coordinated", "assessed", "monitored", "educated", "advocated"],
            "avoid_phrases": ["just following protocols", "basic care", "routine procedures"],
            "keywords_priority": ["patient safety", "quality improvement", "evidence-based", "interdisciplinary", "outcomes"],
            "story_angles": ["patient outcome improvements", "safety initiatives", "process enhancements", "team leadership"],
            "company_research_focus": ["patient satisfaction scores", "quality ratings", "specializations", "community impact"]
        },
        "marketing": {
            "key_values": ["customer-centricity", "data-driven creativity", "brand building", "ROI focus", "innovation"],
            "preferred_tone": "creative yet strategic, results-focused",
            "focus_areas": ["campaign performance", "brand development", "customer insights", "digital proficiency", "growth marketing"],
            "power_verbs": ["launched", "grew", "converted", "engaged", "amplified", "positioned", "activated"],
            "avoid_phrases": ["created awareness", "did marketing", "posted content", "managed social media"],
            "keywords_priority": ["conversion rates", "customer acquisition", "brand awareness", "digital marketing", "analytics"],
            "story_angles": ["campaign successes", "growth achievements", "brand building", "customer engagement wins"],
            "company_research_focus": ["brand positioning", "target audience", "recent campaigns", "growth metrics"]
        },
        "consulting": {
            "key_values": ["strategic thinking", "client success", "analytical rigor", "adaptability", "thought leadership"],
            "preferred_tone": "strategic, confident, solution-oriented",
            "focus_areas": ["client outcomes", "strategic insights", "change management", "industry expertise", "relationship building"],
            "power_verbs": ["advised", "strategized", "transformed", "delivered", "facilitated", "guided", "influenced"],
            "avoid_phrases": ["provided support", "assisted with", "participated in", "contributed to"],
            "keywords_priority": ["strategic planning", "change management", "stakeholder engagement", "business transformation"],
            "story_angles": ["client transformation stories", "strategic wins", "change leadership", "industry insights"],
            "company_research_focus": ["client portfolio", "service offerings", "thought leadership", "market reputation"]
        }
    }
    
    return industry_data.get(industry.lower(), {
        "key_values": ["professionalism", "reliability", "results-driven", "adaptability"],
        "preferred_tone": "professional and confident",
        "focus_areas": ["relevant experience", "skill alignment", "cultural fit", "value creation"],
        "power_verbs": ["achieved", "delivered", "improved", "led", "developed", "managed"],
        "avoid_phrases": ["hard worker", "team player", "detail-oriented"],
        "keywords_priority": ["leadership", "collaboration", "problem-solving", "results"],
        "story_angles": ["achievements", "improvements", "leadership", "innovation"],
        "company_research_focus": ["mission", "values", "recent news", "growth"]
    })

def extract_quantifiable_achievements(resume_text: str) -> List[dict]:
    """Extract and structure quantifiable achievements from resume"""
    achievements = []
    
    # Pattern matching for metrics
    metric_patterns = [
        r'(\d+)%\s*(increase|decrease|improvement|reduction|growth)',
        r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(saved|generated|increased|reduced)',
        r'(\d+(?:,\d{3})*)\s*(users|customers|clients|projects|team members)',
        r'(\d+)\s*(months?|years?|weeks?)\s*(ahead of schedule|early|faster)',
        r'(improved|increased|reduced|decreased|optimized).*?by\s*(\d+)%',
        r'(\d+)x\s*(faster|improvement|increase|growth)',
        r'from\s*(\d+).*?to\s*(\d+)',
        r'(\d+)\+\s*(years?|projects?|clients?)'
    ]
    
    lines = resume_text.split('\n')
    for line in lines:
        for pattern in metric_patterns:
            matches = re.findall(pattern, line, re.IGNORECASE)
            if matches:
                achievements.append({
                    "original_text": line.strip(),
                    "metrics_found": matches,
                    "line": line.strip()
                })
    
    return achievements

def extract_technical_skills(resume_text: str) -> dict:
    """Extract and categorize technical skills from resume"""
    skills_categories = {
        "programming_languages": r'\b(Python|Java|JavaScript|TypeScript|C\+\+|C#|Go|Rust|Swift|Kotlin|PHP|Ruby|Scala|R|MATLAB)\b',
        "frameworks": r'\b(React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Rails|Laravel|FastAPI|Next\.js)\b',
        "databases": r'\b(MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch|Oracle|SQLite|DynamoDB|Cassandra)\b',
        "cloud_platforms": r'\b(AWS|Azure|Google Cloud|GCP|Heroku|DigitalOcean|Vercel|Netlify)\b',
        "tools": r'\b(Docker|Kubernetes|Git|Jenkins|Terraform|Ansible|Jira|Slack|Figma|Photoshop)\b',
        "methodologies": r'\b(Agile|Scrum|DevOps|CI/CD|TDD|Microservices|RESTful|GraphQL)\b'
    }
    
    extracted_skills = {}
    for category, pattern in skills_categories.items():
        matches = re.findall(pattern, resume_text, re.IGNORECASE)
        extracted_skills[category] = list(set([match.lower() for match in matches]))
    
    return extracted_skills

def create_human_centric_prompt(
    resume_text: str, jd_text: str, company_name: str, role_title: str,
    industry: str, company_values: str, personal_touch: str, tone: str,
    experience_level: str, cover_letter_type: str, key_achievements: str,
    preferred_length: str, industry_insights: dict
) -> str:
    """Create the most advanced, human-centric cover letter generation prompt"""
    
    # Extract structured data from resume
    achievements = extract_quantifiable_achievements(resume_text)
    technical_skills = extract_technical_skills(resume_text)
    
    # Extract key requirements from JD
    jd_keywords = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', jd_text)
    jd_skills = re.findall(r'\b(?:Python|Java|JavaScript|React|Angular|AWS|Docker|SQL|API|Machine Learning|Data Analysis)\b', jd_text, re.IGNORECASE)
    
    length_specs = {
        "short": {"paragraphs": "3 concise paragraphs", "words": "180-250 words", "style": "punchy and direct"},
        "medium": {"paragraphs": "4 well-structured paragraphs", "words": "280-380 words", "style": "balanced detail and conciseness"},
        "long": {"paragraphs": "4-5 comprehensive paragraphs", "words": "380-500 words", "style": "detailed and thorough"}
    }
    
    tone_profiles = {
        "professional": {
            "style": "formal, respectful, business-appropriate",
            "opening_style": "respectful and direct",
            "enthusiasm_level": "measured confidence",
            "language_complexity": "sophisticated but clear"
        },
        "enthusiastic": {
            "style": "energetic, passionate, genuinely excited",
            "opening_style": "compelling and dynamic",
            "enthusiasm_level": "high energy without being overwhelming",
            "language_complexity": "vivid and engaging"
        },
        "creative": {
            "style": "unique voice while maintaining professionalism",
            "opening_style": "innovative and memorable",
            "enthusiasm_level": "authentic passion",
            "language_complexity": "creative but professional"
        }
    }
    
    return f"""
# EXPERT HUMAN-CENTRIC COVER LETTER GENERATION ENGINE
## Mission: Create a cover letter that hiring managers will remember, that sounds completely human-written, and compels action

### CANDIDATE PROFILE ANALYSIS:
**Resume Content:** {resume_text[:1500]}...
**Extracted Achievements:** {achievements[:3] if achievements else 'None found - will need to infer from context'}
**Technical Skills Found:** {technical_skills}
**Experience Level:** {experience_level}

### TARGET OPPORTUNITY INTELLIGENCE:
**Company:** {company_name}
**Role:** {role_title}
**Industry:** {industry}
**Job Description:** {jd_text[:1000]}...
**Key JD Skills:** {jd_skills[:10]}
**Company Values:** {company_values or 'Research and extract from context'}
**Personal Connection:** {personal_touch or 'None provided - create authentic connection'}

### INDUSTRY-SPECIFIC OPTIMIZATION:
**Industry Focus:** {industry_insights.get('focus_areas', [])}
**Required Power Verbs:** {industry_insights.get('power_verbs', [])}
**Phrases to Avoid:** {industry_insights.get('avoid_phrases', [])}
**Priority Keywords:** {industry_insights.get('keywords_priority', [])}
**Story Angles:** {industry_insights.get('story_angles', [])}

### GENERATION SPECIFICATIONS:
**Length:** {length_specs.get(preferred_length, length_specs['medium'])}
**Tone Profile:** {tone_profiles.get(tone, tone_profiles['professional'])}
**Cover Letter Type:** {cover_letter_type}
**Key Achievements to Highlight:** {key_achievements or 'Extract best 2-3 from resume analysis'}

### HUMAN-CENTRIC GENERATION RULES:

#### AUTHENTICITY REQUIREMENTS:
1. **NO GENERIC AI PHRASES:** Absolutely avoid "I am excited to apply", "team player", "think outside the box", "hit the ground running"
2. **SPECIFIC COMPANY CONNECTIONS:** Must reference 2-3 specific things about {company_name} (products, mission, recent news, values)
3. **QUANTIFIED ACHIEVEMENTS:** Include at least 2 metrics/numbers that demonstrate concrete impact
4. **NATURAL LANGUAGE FLOW:** Vary sentence structure (30% complex, 50% medium, 20% short)
5. **AUTHENTIC VOICE:** Sound like a real person who researched the company and role deeply

#### STRUCTURAL EXCELLENCE:
**Opening Paragraph (Hook + Value Proposition):**
- Start with a specific connection to {company_name} or {role_title}
- Lead with strongest relevant achievement or unique angle
- Clearly state the position and demonstrate genuine research
- End with a compelling value proposition

**Body Paragraphs (Evidence + Alignment):**
- Paragraph 2: Highlight 2-3 most relevant achievements with metrics
- Paragraph 3: Demonstrate company/culture fit and industry understanding
- Each achievement must connect to a specific JD requirement
- Use industry-specific power verbs from: {industry_insights.get('power_verbs', [])}

**Closing Paragraph (Call to Action):**
- Synthesize value proposition
- Reference next steps confidently
- Professional yet memorable sign-off

#### QUALITY SAFEGUARDS:
- **Keyword Integration:** Naturally include 5-7 keywords from JD: {jd_skills[:7]}
- **Sentence Variation:** No two consecutive sentences with same structure
- **Power Verb Requirement:** Minimum 8 different action verbs
- **Metric Integration:** At least 2 quantifiable results
- **Company Research:** 2-3 specific {company_name} references
- **Industry Alignment:** Use {industry} terminology naturally

#### CONTENT DEVELOPMENT STRATEGY:
1. **Research Demonstration:** Show deep understanding of {company_name}'s mission/products
2. **Problem-Solution Framing:** Identify implicit challenges from JD and position candidate as solution
3. **Story Arc Creation:** Weave career progression into narrative that leads logically to this opportunity
4. **Future Value Projection:** Articulate specific contributions candidate will make

### CRITICAL EXECUTION STANDARDS:
- **Zero Clichés:** Every phrase must be fresh and specific
- **Perfect Grammar:** Flawless mechanics and professional language
- **ATS Optimization:** Natural keyword integration without stuffing
- **Memorable Elements:** Include 1-2 details that will stick in reader's mind
- **Cultural Resonance:** Match {industry} communication norms
- **Action Orientation:** Focus on what candidate will DO, not just what they've done

### OUTPUT REQUIREMENTS:
Generate a cover letter that:
1. Passes the "human written" test completely
2. Demonstrates genuine research and interest
3. Includes specific, quantifiable achievements
4. Uses varied, sophisticated sentence structures
5. Integrates keywords naturally
6. Tells a compelling professional story
7. Positions candidate as the ideal solution
8. Compels the hiring manager to take action

**Word Count Target:** {length_specs.get(preferred_length, length_specs['medium'])['words']}
**Tone Execution:** {tone_profiles.get(tone, tone_profiles['professional'])['style']}

### EXAMPLE OPENING STYLES (for reference):
- **Research-Based:** "Your recent launch of [specific product] perfectly aligns with my passion for [relevant area]..."
- **Achievement-Led:** "Having [specific achievement with metric], I was drawn to [company]'s commitment to [specific value]..."
- **Problem-Solution:** "The challenge of [inferred from JD] is exactly what energized me during my work at [previous role]..."

Generate the most compelling, human-sounding, and effective cover letter possible. This should be indistinguishable from what a top-tier career coach would write for their best client.
"""

def validate_human_quality(cover_letter: str, jd_text: str, company_name: str) -> dict:
    """Comprehensive validation of cover letter human quality and effectiveness"""
    
    issues = []
    scores = {}
    
    # 1. AI Detection Patterns
    ai_phrases = [
        "i am excited to apply", "team player", "think outside the box", 
        "hit the ground running", "wear many hats", "go above and beyond",
        "passionate about", "i believe i would be", "i am confident that"
    ]
    
    ai_phrase_count = sum(1 for phrase in ai_phrases if phrase in cover_letter.lower())
    if ai_phrase_count > 0:
        issues.append(f"Contains {ai_phrase_count} generic AI phrases")
    scores['ai_avoidance'] = max(0, 100 - (ai_phrase_count * 20))
    
    # 2. Sentence Structure Variation
    sentences = [s.strip() for s in re.split(r'[.!?]', cover_letter) if s.strip()]
    if len(sentences) < 3:
        issues.append("Too few sentences for proper analysis")
        scores['sentence_variation'] = 0
    else:
        word_counts = [len(s.split()) for s in sentences]
        avg_length = sum(word_counts) / len(word_counts)
        variation = max(word_counts) - min(word_counts)
        
        if variation < 8:
            issues.append("Poor sentence length variation")
        if avg_length < 12 or avg_length > 25:
            issues.append(f"Average sentence length suboptimal: {avg_length:.1f} words")
        
        scores['sentence_variation'] = min(100, (variation * 5) + 40)
    
    # 3. Company-Specific Content
    company_mentions = cover_letter.lower().count(company_name.lower())
    if company_mentions == 0:
        issues.append("Company name not mentioned")
        scores['personalization'] = 0
    elif company_mentions == 1:
        issues.append("Company mentioned only once - needs more personalization")
        scores['personalization'] = 40
    else:
        scores['personalization'] = min(100, company_mentions * 30)
    
    # 4. Quantifiable Achievements
    metrics = re.findall(r'\d+%|\d+\+|\d+x|\$\d+(?:,\d{3})*|\d+(?:,\d{3})*\s*(?:users|customers|projects)', cover_letter)
    if len(metrics) == 0:
        issues.append("No quantifiable achievements included")
        scores['achievement_metrics'] = 0
    elif len(metrics) == 1:
        scores['achievement_metrics'] = 60
    else:
        scores['achievement_metrics'] = 100
    
    # 5. Keyword Alignment
    jd_keywords = set(re.findall(r'\b[a-zA-Z]{4,}\b', jd_text.lower()))
    cover_keywords = set(re.findall(r'\b[a-zA-Z]{4,}\b', cover_letter.lower()))
    keyword_overlap = len(jd_keywords & cover_keywords)
    keyword_ratio = keyword_overlap / len(jd_keywords) if jd_keywords else 0
    
    if keyword_ratio < 0.15:
        issues.append(f"Low keyword alignment: {keyword_ratio*100:.1f}%")
    scores['keyword_alignment'] = min(100, keyword_ratio * 300)
    
    # 6. Power Verb Usage
    power_verbs = ['led', 'developed', 'implemented', 'achieved', 'optimized', 'delivered', 'created', 'managed', 'improved', 'increased']
    verb_count = sum(1 for verb in power_verbs if verb in cover_letter.lower())
    scores['power_verbs'] = min(100, verb_count * 15)
    
    # 7. Professional Language Quality
    weak_phrases = ['helped with', 'worked on', 'was responsible for', 'participated in', 'assisted with']
    weak_count = sum(1 for phrase in weak_phrases if phrase in cover_letter.lower())
    if weak_count > 0:
        issues.append(f"Contains {weak_count} weak phrases")
    scores['language_quality'] = max(0, 100 - (weak_count * 25))
    
    # 8. Overall Human Quality Score
    overall_score = sum(scores.values()) / len(scores)
    
    return {
        "overall_score": round(overall_score, 1),
        "component_scores": scores,
        "issues": issues,
        "recommendation": "Excellent" if overall_score >= 85 else "Good" if overall_score >= 70 else "Needs Improvement"
    }

def analyze_cover_letter_effectiveness(cover_letter: str, jd_text: str, resume_text: str) -> dict:
    """Analyze the effectiveness and provide actionable improvements"""
    
    word_count = len(cover_letter.split())
    paragraph_count = len([p for p in cover_letter.split('\n\n') if p.strip()])
    
    # Extract mentioned skills and compare with JD
    mentioned_skills = re.findall(r'\b(?:Python|Java|JavaScript|React|Angular|AWS|Docker|SQL|API|Machine Learning|Data Analysis|Leadership|Project Management)\b', 
                                cover_letter, re.IGNORECASE)
    jd_skills = re.findall(r'\b(?:Python|Java|JavaScript|React|Angular|AWS|Docker|SQL|API|Machine Learning|Data Analysis|Leadership|Project Management)\b', 
                         jd_text, re.IGNORECASE)
    
    skill_coverage = len(set(mentioned_skills)) / len(set(jd_skills)) if jd_skills else 0
    
    return {
        "readability_metrics": {
            "word_count": word_count,
            "paragraph_count": paragraph_count,
            "avg_words_per_paragraph": round(word_count / paragraph_count, 1) if paragraph_count > 0 else 0,
            "reading_level": "Professional" if 250 <= word_count <= 400 else "Check length"
        },
        "content_analysis": {
            "skill_coverage": round(skill_coverage * 100, 1),
            "mentioned_skills": list(set(mentioned_skills)),
            "missing_jd_skills": list(set(jd_skills) - set(mentioned_skills)),
            "quantified_achievements": len(re.findall(r'\d+%|\d+\+|\d+x|\$\d+', cover_letter))
        },
        "improvement_suggestions": generate_improvement_suggestions(cover_letter, jd_text, skill_coverage)
    }

def generate_improvement_suggestions(cover_letter: str, jd_text: str, skill_coverage: float) -> List[str]:
    """Generate specific improvement suggestions"""
    suggestions = []
    
    if skill_coverage < 0.5:
        suggestions.append("Include more skills from the job description to improve relevance")
    
    if not re.search(r'\d+%|\d+\+|\d+x|\$\d+', cover_letter):
        suggestions.append("Add quantifiable achievements with specific metrics")
    
    if 'company' not in cover_letter.lower():
        suggestions.append("Reference the company more specifically to show research")
    
    weak_openings = ['i am writing', 'i am applying', 'i would like']
    if any(opening in cover_letter.lower()[:50] for opening in weak_openings):
        suggestions.append("Strengthen the opening with a more compelling hook")
    
    if len(cover_letter.split()) < 200:
        suggestions.append("Expand content to provide more compelling evidence")
    elif len(cover_letter.split()) > 500:
        suggestions.append("Condense content to maintain reader engagement")
    
    return suggestions

@app.post("/generate-cover-letter/")
async def generate_cover_letter(
    resume: UploadFile,
    jd_text: str = Form(...),
    company_name: str = Form(...),
    role_title: str = Form(...),
    industry: str = Form(...),
    company_values: Optional[str] = Form(None),
    personal_touch: Optional[str] = Form(None),
    tone: str = Form(default="professional"),
    experience_level: str = Form(default="mid-level"),
    cover_letter_type: str = Form(default="application"),
    key_achievements: Optional[str] = Form(None),
    preferred_length: str = Form(default="medium")
):
    try:
        # File processing
        content = await resume.read()
        file_extension = resume.filename.lower().split('.')[-1] if resume.filename else ""
        
        if file_extension == 'pdf':
            resume_text = extract_text_from_pdf(content)
        elif file_extension == 'docx':
            resume_text = extract_text_from_docx(content)
        else:
            resume_text = content.decode("utf-8", errors="ignore")

        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=422, 
                detail="Could not extract readable text from the resume"
            )

        # Get industry insights
        industry_insights = get_industry_insights(industry)
        
        # Create the advanced prompt
        prompt = create_human_centric_prompt(
            resume_text=resume_text,
            jd_text=jd_text,
            company_name=company_name,
            role_title=role_title,
            industry=industry,
            company_values=company_values,
            personal_touch=personal_touch,
            tone=tone,
            experience_level=experience_level,
            cover_letter_type=cover_letter_type,
            key_achievements=key_achievements,
            preferred_length=preferred_length,
            industry_insights=industry_insights
        )

        # Generate with optimized settings for human-like output
        model = genai.GenerativeModel("gemini-1.5-flash")
        generation_config = {
            "temperature": 0.8,  # Higher creativity for more human-like variation
            "top_p": 0.9,
            "max_output_tokens": 2048,
            "candidate_count": 1
        }
        
        response = await smart_gemini_call(prompt, generation_config)

        if not response.text:
            raise HTTPException(status_code=500, detail="Empty response from AI model")

        cover_letter = response.text.strip()
        
        # Comprehensive quality validation
        quality_validation = validate_human_quality(cover_letter, jd_text, company_name)
        effectiveness_analysis = analyze_cover_letter_effectiveness(cover_letter, jd_text, resume_text)
        
        # If quality score is too low, regenerate with stricter prompt
        if quality_validation["overall_score"] < 75:
            enhanced_prompt = f"""
{prompt}

CRITICAL QUALITY ISSUES DETECTED - REGENERATE WITH THESE FIXES:
{quality_validation["issues"]}

MANDATORY REQUIREMENTS FOR REGENERATION:
1. Include company name {company_name} at least 2 times naturally
2. Add 2+ quantifiable achievements with specific metrics
3. Use varied sentence structures (8-25 words per sentence)
4. Avoid all generic AI phrases completely
5. Include 5+ keywords from job description naturally
6. Use minimum 6 different power verbs
7. Create authentic, memorable opening and closing

REGENERATE NOW with perfect human quality.
"""
            
            response = await smart_gemini_call(enhanced_prompt, generation_config)
            cover_letter = response.text.strip()
            quality_validation = validate_human_quality(cover_letter, jd_text, company_name)

        return JSONResponse(content={
            "cover_letter": cover_letter,
            "quality_metrics": quality_validation,
            "effectiveness_analysis": effectiveness_analysis,
            "industry_optimization": {
                "industry": industry,
                "tone_applied": tone,
                "length_category": preferred_length,
                "industry_keywords_used": industry_insights.get('keywords_priority', [])[:5]
            },
            "generation_metadata": {
                "model_version": "gemini-1.5-flash",
                "prompt_version": "human-centric-v2.0",
                "temperature": 0.8,
                "quality_score": quality_validation["overall_score"]
            }
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refine-cover-letter/")
async def refine_cover_letter(
    original_letter: str = Form(...),
    refinement_type: str = Form(...),
    specific_feedback: Optional[str] = Form(None),
    target_company: str = Form(...),
    target_role: str = Form(...),
    industry: str = Form(...)
):
    """Advanced cover letter refinement with human-quality optimization"""
    try:
        industry_insights = get_industry_insights(industry)
        
        refinement_strategies = {
            "tone": {
                "objective": "Adjust tone while maintaining core message and human quality",
                "focus": "Language style, enthusiasm level, formality"
            },
            "length": {
                "objective": "Optimize length for maximum impact and readability", 
                "focus": "Content density, paragraph structure, word economy"
            },
            "personalization": {
                "objective": "Increase company-specific personalization and research demonstration",
                "focus": "Company connections, role alignment, cultural fit"
            },
            "achievements": {
                "objective": "Strengthen achievement presentation with better metrics and impact",
                "focus": "Quantifiable results, value proposition, specificity"
            },
            "industry_alignment": {
                "objective": f"Optimize for {industry} industry standards and expectations",
                "focus": "Industry terminology, sector priorities, professional norms"
            }
        }
        
        strategy = refinement_strategies.get(refinement_type, refinement_strategies["tone"])
        
        prompt = f"""
# EXPERT COVER LETTER REFINEMENT ENGINE
## Mission: Refine cover letter to achieve perfect human quality and maximum effectiveness

### ORIGINAL COVER LETTER:
{original_letter}

### REFINEMENT SPECIFICATIONS:
**Type:** {refinement_type}
**Objective:** {strategy['objective']}
**Focus Areas:** {strategy['focus']}
**Target Company:** {target_company}
**Target Role:** {target_role}
**Industry:** {industry}
**Specific Feedback:** {specific_feedback or 'None provided'}

### INDUSTRY OPTIMIZATION GUIDELINES:
**Industry Standards:** {industry_insights.get('preferred_tone', 'professional')}
**Power Verbs to Use:** {industry_insights.get('power_verbs', [])}
**Key Focus Areas:** {industry_insights.get('focus_areas', [])}
**Avoid Phrases:** {industry_insights.get('avoid_phrases', [])}

### REFINEMENT EXECUTION RULES:

#### QUALITY PRESERVATION:
- Maintain all quantifiable achievements and specific details
- Preserve authentic voice and human-like language patterns
- Keep all company-specific research and connections
- Retain professional structure and flow

#### ENHANCEMENT STRATEGY:
{f'''
**TONE REFINEMENT:** Adjust language formality, enthusiasm level, and professional voice while keeping content integrity
''' if refinement_type == 'tone' else ''}

{f'''
**LENGTH OPTIMIZATION:** {'Condense to essential high-impact content' if 'shorter' in (specific_feedback or '') else 'Expand with relevant details and examples'}
''' if refinement_type == 'length' else ''}

{f'''
**PERSONALIZATION BOOST:** Add 2+ specific references to {target_company}, demonstrate deeper research, show cultural alignment
''' if refinement_type == 'personalization' else ''}

{f'''
**ACHIEVEMENT ENHANCEMENT:** Strengthen metrics, add business impact context, improve result quantification
''' if refinement_type == 'achievements' else ''}

{f'''
**INDUSTRY ALIGNMENT:** Integrate {industry}-specific terminology, priorities, and communication standards
''' if refinement_type == 'industry_alignment' else ''}

#### CRITICAL REQUIREMENTS:
1. **Zero Quality Degradation:** Refined version must score higher on human-quality metrics
2. **Authentic Enhancement:** All additions must sound natural and researched
3. **Impact Amplification:** Every change should increase hiring manager engagement
4. **ATS Optimization:** Maintain keyword density while improving readability
5. **Professional Excellence:** Perfect grammar, varied sentence structure, compelling flow

### OUTPUT REQUIREMENTS:
Provide the refined cover letter that:
- Addresses the specific refinement request perfectly
- Maintains all existing strengths
- Enhances overall effectiveness and human quality
- Remains authentic and compelling
- Passes all professional standards

Generate the enhanced version now.
"""

        model = genai.GenerativeModel("gemini-1.5-flash")
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "max_output_tokens": 2048
        }
        
        response = model.generate_content(prompt, generation_config=generation_config)
        refined_letter = response.text.strip()
        
        # Validate refinement quality
        original_quality = validate_human_quality(original_letter, "", target_company)
        refined_quality = validate_human_quality(refined_letter, "", target_company)
        
        improvement_score = refined_quality["overall_score"] - original_quality["overall_score"]
        
        return JSONResponse(content={
            "cover_letter": cover_letter,
            "quality_metrics": quality_validation,
            "effectiveness_analysis": effectiveness_analysis,
            "industry_optimization": {
                "industry": industry,
                "tone_applied": tone,
                "length_category": preferred_length,
                "industry_keywords_used": industry_insights.get('keywords_priority', [])[:5]
            },
            "generation_metadata": {
                "model_version": "gemini-1.5-flash",
                "prompt_version": "human-centric-v2.0",
                "temperature": 0.8,
                "quality_score": quality_validation["overall_score"]
        }
})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/company-research/")
async def research_company(
    company_name: str = Query(...),
    industry: Optional[str] = Query(None)
):
    """Enhanced company research for premium cover letter personalization"""
    try:
        industry_insights = get_industry_insights(industry or "technology")
        
        # This would integrate with real APIs in production
        research_data = {
            "company_profile": {
                "name": company_name,
                "industry": industry or "Technology",
                "size_estimate": "Scale-up (100-1000 employees)",
                "stage": "Growth stage",
                "headquarters": "Research location for local relevance"
            },
            "personalization_opportunities": {
                "mission_alignment": f"Research {company_name}'s mission statement and core values",
                "recent_developments": f"Find {company_name}'s latest product launches, funding, or news",
                "culture_insights": f"Review {company_name}'s employee testimonials and culture pages",
                "technology_stack": f"Identify {company_name}'s technical infrastructure and tools",
                "growth_trajectory": f"Understand {company_name}'s expansion plans and market position"
            },
            "cover_letter_hooks": [
                f"Reference {company_name}'s recent achievement or milestone",
                f"Connect personal values to {company_name}'s stated mission",
                f"Mention specific {company_name} products or services you've researched",
                f"Highlight alignment with {company_name}'s growth stage and culture",
                f"Reference {company_name}'s industry leadership or innovation"
            ],
            "industry_context": {
                "focus_areas": industry_insights.get('focus_areas', []),
                "research_priorities": industry_insights.get('company_research_focus', []),
                "communication_style": industry_insights.get('preferred_tone', 'professional')
            },
            "recommended_research_sources": [
                f"{company_name} official website and blog",
                f"{company_name} LinkedIn company page",
                f"Recent news about {company_name}",
                f"Employee reviews on Glassdoor",
                f"Industry reports mentioning {company_name}"
            ]
        }
        
        return JSONResponse(content=research_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-quality/")
async def validate_quality(
    cover_letter: str = Form(...),
    jd_text: str = Form(...),
    company_name: str = Form(...),
    industry: str = Form(...)
):
    """Standalone quality validation endpoint"""
    try:
        quality_metrics = validate_human_quality(cover_letter, jd_text, company_name)
        effectiveness_analysis = analyze_cover_letter_effectiveness(cover_letter, jd_text, "")
        industry_insights = get_industry_insights(industry)
        
        # Industry-specific validation
        industry_score = 100
        industry_feedback = []
        
        required_keywords = industry_insights.get('keywords_priority', [])[:5]
        found_keywords = [kw for kw in required_keywords if kw.lower() in cover_letter.lower()]
        keyword_coverage = len(found_keywords) / len(required_keywords) if required_keywords else 1
        
        if keyword_coverage < 0.6:
            industry_feedback.append(f"Low industry keyword coverage: {keyword_coverage*100:.0f}%")
            industry_score -= 20
            
        avoid_phrases = industry_insights.get('avoid_phrases', [])
        found_avoid = [phrase for phrase in avoid_phrases if phrase.lower() in cover_letter.lower()]
        if found_avoid:
            industry_feedback.append(f"Contains industry-inappropriate phrases: {found_avoid}")
            industry_score -= 15 * len(found_avoid)
        
        return JSONResponse(content={
            "overall_assessment": {
                "human_quality_score": quality_metrics["overall_score"],
                "industry_alignment_score": max(0, industry_score),
                "effectiveness_rating": effectiveness_analysis["content_analysis"],
                "recommendation": quality_metrics["recommendation"]
            },
            "detailed_analysis": {
                "human_quality_breakdown": quality_metrics["component_scores"],
                "identified_issues": quality_metrics["issues"],
                "industry_feedback": industry_feedback,
                "improvement_suggestions": effectiveness_analysis["improvement_suggestions"]
            },
            "benchmarking": {
                "industry_standards": industry,
                "quality_tier": "Excellent" if quality_metrics["overall_score"] >= 85 else 
                              "Good" if quality_metrics["overall_score"] >= 70 else "Needs Improvement",
                "competitive_readiness": "High" if quality_metrics["overall_score"] >= 80 and industry_score >= 80 else "Medium"
            }
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-text/")
async def extract_text_only(resume: UploadFile):
    """Enhanced text extraction with analysis"""
    try:
        content = await resume.read()
        file_extension = resume.filename.lower().split('.')[-1] if resume.filename else ""
        
        if file_extension == 'pdf':
            resume_text = extract_text_from_pdf(content)
        elif file_extension == 'docx':
            resume_text = extract_text_from_docx(content)
        elif file_extension == 'doc':
            resume_text = extract_text_from_doc(content)
        else:
            resume_text = content.decode("utf-8", errors="ignore")
        
        # Enhanced analysis
        achievements = extract_quantifiable_achievements(resume_text) if resume_text else []
        technical_skills = extract_technical_skills(resume_text) if resume_text else {}
        basic_analysis = extract_basic_keywords(resume_text) if resume_text else {}
        
        return JSONResponse(content={
            "extraction_results": {
                "filename": resume.filename,
                "file_type": file_extension,
                "text_length": len(resume_text) if resume_text else 0,
                "extraction_success": bool(resume_text and len(resume_text.strip()) > 50)
            },
            "content_preview": {
                "extracted_text": resume_text[:2000] + "..." if resume_text and len(resume_text) > 2000 else resume_text,
            },
            "content_analysis": {
                "quantifiable_achievements": achievements[:5],
                "technical_skills_found": technical_skills,
                "keyword_analysis": basic_analysis,
                "readiness_for_cover_letter": len(achievements) > 0 and len(technical_skills) > 0
            }
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def extract_basic_keywords(text: str) -> dict:
    """Enhanced keyword extraction with categorization"""
    if not text:
        return {}
    
    # Professional keywords
    professional_words = re.findall(r'\b(?:led|managed|developed|implemented|achieved|optimized|created|designed|analyzed|coordinated)\b', text.lower())
    
    # Technical keywords  
    technical_words = re.findall(r'\b(?:python|java|javascript|react|angular|aws|docker|sql|api|machine learning|data analysis)\b', text.lower(), re.IGNORECASE)
    
    # General keywords
    all_words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
    word_counts = Counter(all_words)
    top_keywords = [word for word, _ in word_counts.most_common(20)]
    
    return {
        "top_keywords": top_keywords,
        "professional_action_words": list(set(professional_words)),
        "technical_keywords": list(set(technical_words)),
        "keyword_density": len(set(all_words)) / len(all_words) if all_words else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)