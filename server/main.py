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
from typing import Optional, List
import asyncio
from datetime import datetime
import requests

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow CORS from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("No GEMINI_API_KEY found in environment variables")
genai.configure(api_key=api_key)

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
        response = model.generate_content(prompt)
        
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



@app.post("/generate-cover-letter/")
async def generate_cover_letter(
    resume: UploadFile,
    jd_text: str = Form(...),
    company_name: str = Form(...),
    role_title: str = Form(...),
    personal_touch: Optional[str] = Form(None)
):
    """Generate a personalized cover letter based on resume and job description"""
    try:
        content = await resume.read()
        
        # Extract resume text
        file_extension = resume.filename.lower().split('.')[-1] if resume.filename else ""
        if file_extension == 'pdf':
            resume_text = extract_text_from_pdf(content)
        elif file_extension == 'docx':
            resume_text = extract_text_from_docx(content)
        else:
            resume_text = content.decode("utf-8", errors="ignore")

        prompt = f"""
Generate a professional cover letter based on the following information:

Resume:
{resume_text}

Job Description:
{jd_text}

Company Name: {company_name}
Role Title: {role_title}
Personal Touch: {personal_touch if personal_touch else "None provided"}

Create a compelling cover letter that:
1. Highlights relevant experience from the resume
2. Addresses key requirements from the job description  
3. Shows genuine interest in the company and role
4. Is professional yet personable
5. Is approximately 3-4 paragraphs long

Return the cover letter as plain text.
"""

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        
        return JSONResponse(content={"cover_letter": response.text.strip()})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/skill-gap-analysis/")
async def skill_gap_analysis(
    current_skills: str = Query(..., description="Comma-separated list of current skills"),
    target_role: str = Query(..., description="Target job role")
):
    """Analyze skill gaps for career transition"""
    try:
        prompt = f"""
Analyze the skill gap for someone with these current skills: {current_skills}
Who wants to transition to: {target_role}

Provide a JSON response with:
{{
    "skill_gap_analysis": {{
        "matching_skills": ["<skill 1>", "<skill 2>"],
        "missing_critical_skills": [
            {{
                "skill": "<skill name>",
                "importance": "<high/medium/low>",
                "learning_path": "<suggested learning approach>",
                "time_estimate": "<time to acquire>",
                "resources": ["<resource 1>", "<resource 2>"]
            }}
        ],
        "transferable_skills": ["<skill 1>", "<skill 2>"],
        "career_transition_timeline": "<realistic timeline>",
        "intermediate_roles": ["<role 1>", "<role 2>"],
        "certification_recommendations": ["<cert 1>", "<cert 2>"]
    }}
}}
"""

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        
        json_match = re.search(r'\{.*\}', response.text.strip(), re.DOTALL)
        if json_match:
            parsed_result = json.loads(json_match.group())
            return JSONResponse(content={"result": parsed_result})
        else:
            return JSONResponse(content={"result": {"raw_response": response.text}})
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-text/")
async def extract_text_only(resume: UploadFile):
    """Debug endpoint to see extracted text"""
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
        
        # Add basic text analysis
        basic_analysis = extract_basic_keywords(resume_text) if resume_text else {}
        
        return JSONResponse(content={
            "filename": resume.filename,
            "file_type": file_extension,
            "text_length": len(resume_text) if resume_text else 0,
            "extracted_text": resume_text[:2000] + "..." if resume_text and len(resume_text) > 2000 else resume_text,
            "basic_analysis": basic_analysis
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)