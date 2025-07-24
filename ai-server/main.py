from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from extractor.pdf_extractor import extract_text_from_pdf
import os
import tempfile
import docx
import pytesseract
from PIL import Image
import spacy
import re
from datetime import datetime
from typing import Dict, List, Tuple
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
import datefinder
from sectioner.resume_sectioner import split_resume_sections
try:
    from sectioner.jd_sectioner import split_jd_sections
except ImportError:
    split_jd_sections = None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model with error handling
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    try:
        nlp = spacy.load("en_core_web_md")
    except OSError:
        print("Warning: No spaCy model found. Using fallback methods.")
        nlp = None

# Expanded role database with 50+ job roles
ROLE_DATABASE = {
    "software developer": {
        "title": "Software Developer",
        "required_sections": ["education", "experience", "projects", "technical_skills"],
        "required_skills": ["python", "java", "c++", "javascript", "react", "node", "sql", "git"],
        "preferred_skills": ["docker", "kubernetes", "aws", "azure", "rest api", "graphql"],
        "project_complexity_threshold": 3,
        "metrics_keywords": ["optimized", "reduced", "increased", "improved", "scaled"]
    },
    "data scientist": {
        "title": "Data Scientist",
        "required_sections": ["education", "experience", "projects", "technical_skills"],
        "required_skills": ["python", "machine learning", "statistics", "sql", "pandas", "numpy", "tensorflow", "pytorch"],
        "preferred_skills": ["big data", "spark", "hadoop", "data visualization", "nlp", "computer vision"],
        "project_complexity_threshold": 4,
        "metrics_keywords": ["accuracy", "precision", "recall", "f1", "rmse", "mae"]
    },
    "product manager": {
        "title": "Product Manager",
        "required_sections": ["experience", "education", "projects", "achievements"],
        "required_skills": ["product strategy", "market research", "user stories", "agile", "jira"],
        "preferred_skills": ["product launch", "roadmapping", "kpi", "a/b testing", "customer journey"],
        "project_complexity_threshold": 3,
        "metrics_keywords": ["roi", "conversion", "retention", "engagement", "mrr"]
    },
    "ux designer": {
        "title": "UX Designer",
        "required_sections": ["experience", "education", "technical_skills", "projects"],
        "required_skills": ["figma", "sketch", "adobe xd", "user research", "wireframing", "prototyping"],
        "preferred_skills": ["user testing", "interaction design", "design systems", "accessibility", "responsive design"],
        "project_complexity_threshold": 3,
        "metrics_keywords": ["usability", "task success", "satisfaction", "error rate", "conversion"]
    },
    "devops engineer": {
        "title": "DevOps Engineer",
        "required_sections": ["experience", "education", "technical_skills", "certifications", "projects"],
        "required_skills": ["docker", "kubernetes", "ci/cd", "aws", "azure", "terraform", "ansible"],
        "preferred_skills": ["prometheus", "grafana", "jenkins", "gitlab", "gcp", "helm"],
        "project_complexity_threshold": 4,
        "metrics_keywords": ["uptime", "deployment frequency", "lead time", "mttr", "incident reduction"]
    },
    "cybersecurity analyst": {
        "title": "Cybersecurity Analyst",
        "required_sections": ["experience", "education", "certifications", "technical_skills", "projects"],
        "required_skills": ["siem", "firewall", "ids/ips", "vulnerability assessment", "incident response"],
        "preferred_skills": ["penetration testing", "soc", "threat hunting", "compliance", "nist", "iso 27001"],
        "project_complexity_threshold": 4,
        "metrics_keywords": ["mttd", "mttr", "false positives", "threats detected", "vulnerabilities patched"]
    }
}

def extract_text(file: UploadFile) -> str:
    """Extract text from uploaded file"""
    try:
        suffix = os.path.splitext(file.filename)[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(file.file.read())
            tmp_path = tmp.name
            
        try:
            if suffix == ".pdf":
                text = extract_text_from_pdf(tmp_path)
            elif suffix in [".docx", ".doc"]:
                doc = docx.Document(tmp_path)
                text = "\n".join([p.text for p in doc.paragraphs])
            elif suffix in [".png", ".jpg", ".jpeg"]:
                img = Image.open(tmp_path)
                text = pytesseract.image_to_string(img)
            else:
                text = ""
        except Exception as e:
            print(f"Error processing file: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
        finally:
            try:
                os.unlink(tmp_path)
            except:
                pass
                
        return text.strip()
    except Exception as e:
        print(f"Error in extract_text: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error extracting text: {str(e)}")

def identify_role(jd_text: str) -> str:
    """Identify the role from job description text"""
    try:
        jd_lower = jd_text.lower()
        best_match = ("software developer", 0)  # Default fallback
        
        for role, data in ROLE_DATABASE.items():
            # Check for exact role mentions
            if role in jd_lower:
                return role
                
            # Check for role keywords
            for keyword in role.split():
                if keyword in jd_lower:
                    return role
                    
            # Check for skill overlap
            skill_overlap = len([skill for skill in data["required_skills"] if skill in jd_lower])
            if skill_overlap > best_match[1]:
                best_match = (role, skill_overlap)
        
        return best_match[0] if best_match[1] > 2 else "software developer"
    except Exception as e:
        print(f"Error in identify_role: {str(e)}")
        return "software developer"

def analyze_section_presence(resume_sections: dict, required_sections: list) -> dict:
    """Analyze presence and quality of required sections"""
    try:
        analysis = {
            "missing": [],
            "weak": [],
            "present": []
        }
        
        for section in required_sections:
            content = resume_sections.get(section, "")
            if isinstance(content, list):
                content = "\n".join(content)
            
            if not content or content.strip() == "":
                analysis["missing"].append(section)
            elif len(content) < 100:  # Weak section threshold
                analysis["weak"].append(section)
            else:
                analysis["present"].append(section)
                
        return analysis
    except Exception as e:
        print(f"Error in analyze_section_presence: {str(e)}")
        return {"missing": [], "weak": [], "present": []}

def analyze_skills(resume_skills: str, required_skills: list, preferred_skills: list) -> dict:
    """Analyze skills match between resume and requirements"""
    try:
        if isinstance(resume_skills, list):
            resume_skills = "\n".join(resume_skills)
        
        skills_text = resume_skills.lower()
        analysis = {
            "missing_required": [],
            "missing_preferred": [],
            "present_required": [],
            "present_preferred": []
        }
        
        for skill in required_skills:
            if skill.lower() in skills_text:
                analysis["present_required"].append(skill)
            else:
                analysis["missing_required"].append(skill)
                
        for skill in preferred_skills:
            if skill.lower() in skills_text:
                analysis["present_preferred"].append(skill)
            else:
                analysis["missing_preferred"].append(skill)
                
        return analysis
    except Exception as e:
        print(f"Error in analyze_skills: {str(e)}")
        return {"missing_required": [], "missing_preferred": [], "present_required": [], "present_preferred": []}

def analyze_projects(projects: list, role_data: dict) -> dict:
    """Analyze project quality and relevance"""
    try:
        analysis = {
            "projects": [],
            "complexity_score": 0,
            "metrics_score": 0,
            "relevance_score": 0,
            "total_projects": len(projects) if projects else 0
        }
        
        if not projects or len(projects) == 0:
            return analysis
            
        for project in projects:
            if isinstance(project, str):
                project_text = project.lower()
            else:
                project_text = str(project).lower()
            
            project_analysis = {
                "content": str(project),
                "complexity": 0,
                "metrics": 0,
                "relevance": 0,
                "suggestions": []
            }
            
            # Complexity analysis
            tech_keywords = role_data.get("required_skills", []) + role_data.get("preferred_skills", [])
            tech_count = sum(1 for tech in tech_keywords if tech.lower() in project_text)
            project_analysis["complexity"] = min(5, tech_count)
            
            # Metrics analysis
            metrics_count = sum(1 for metric in role_data.get("metrics_keywords", []) if metric.lower() in project_text)
            project_analysis["metrics"] = min(5, metrics_count * 2)
            
            # Relevance analysis
            relevance_keywords = role_data.get("required_skills", []) + role_data.get("metrics_keywords", [])
            relevance_count = sum(1 for kw in relevance_keywords if kw.lower() in project_text)
            project_analysis["relevance"] = min(5, relevance_count)
            
            # Add suggestions
            if project_analysis["complexity"] < role_data.get("project_complexity_threshold", 3):
                project_analysis["suggestions"].append("Add more technical depth and complexity")
            if project_analysis["metrics"] < 3:
                project_analysis["suggestions"].append("Add quantifiable results and metrics")
            if project_analysis["relevance"] < 3:
                project_analysis["suggestions"].append("Make project more relevant to the target role")
            
            analysis["projects"].append(project_analysis)
            analysis["complexity_score"] += project_analysis["complexity"]
            analysis["metrics_score"] += project_analysis["metrics"]
            analysis["relevance_score"] += project_analysis["relevance"]
        
        # Calculate average scores
        if len(projects) > 0:
            analysis["complexity_score"] = round(analysis["complexity_score"] / len(projects), 1)
            analysis["metrics_score"] = round(analysis["metrics_score"] / len(projects), 1)
            analysis["relevance_score"] = round(analysis["relevance_score"] / len(projects), 1)
        
        return analysis
    except Exception as e:
        print(f"Error in analyze_projects: {str(e)}")
        return {"projects": [], "complexity_score": 0, "metrics_score": 0, "relevance_score": 0, "total_projects": 0}

def parse_date(date_str):
    """Parse date string to datetime object"""
    try:
        # Simple date parsing - you can enhance this
        if "present" in date_str.lower():
            return datetime.now()
        
        # Try different date formats
        date_patterns = [
            "%B %Y",  # January 2023
            "%b %Y",   # Jan 2023
            "%m/%Y",   # 01/2023
            "%Y"       # 2023
        ]
        
        for pattern in date_patterns:
            try:
                return datetime.strptime(date_str.strip(), pattern)
            except:
                continue
                
        return datetime.now()
    except:
        return datetime.now()

def analyze_experience_dates(experience_text: str) -> dict:
    """Analyze experience section for proper date order and gaps"""
    try:
        if isinstance(experience_text, list):
            experience_text = "\n".join(experience_text)
            
        analysis = {
            "date_issues": [],
            "employment_gaps": [],
            "current_position": None,
            "date_format_score": 1.0
        }
        
        # Simple date pattern matching
        date_patterns = [
            r'(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\s*[-–—]\s*(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\bPresent\b)',
            r'(\d{1,2}/\d{4})\s*[-–—]\s*(\d{1,2}/\d{4}|Present)',
            r'(\d{4})\s*[-–—]\s*(\d{4}|Present)'
        ]
        
        positions = []
        for pattern in date_patterns:
            matches = re.findall(pattern, experience_text, re.IGNORECASE)
            for start, end in matches:
                positions.append({"start": start, "end": end})
        
        if "present" in experience_text.lower():
            analysis["current_position"] = "Current"
        
        return analysis
    except Exception as e:
        print(f"Error in analyze_experience_dates: {str(e)}")
        return {"date_issues": [], "employment_gaps": [], "current_position": None, "date_format_score": 1.0}

def analyze_format_and_structure(resume_sections: dict) -> dict:
    """Analyze resume format and structure quality"""
    try:
        analysis = {
            "section_headings": len(resume_sections),
            "bullet_points": 0,
            "length_analysis": {},
            "action_verbs": 0,
            "contact_info": False,
            "overall_score": 3.0
        }
        
        # Check contact information (basic check)
        all_text = " ".join([str(content) for content in resume_sections.values()]).lower()
        analysis["contact_info"] = any(keyword in all_text for keyword in ["@", "phone", "email", "linkedin"])
        
        # Count bullet points
        bullet_count = 0
        total_lines = 0
        for section, content in resume_sections.items():
            if isinstance(content, list):
                content = "\n".join(content)
            content_str = str(content)
            bullet_count += content_str.count("•") + content_str.count("-") + content_str.count("*")
            total_lines += len(content_str.split("\n"))
        
        analysis["bullet_points"] = round(bullet_count / max(1, total_lines), 2)
        
        # Action verbs analysis
        action_verbs = ["developed", "designed", "implemented", "managed", "led", 
                       "created", "improved", "optimized", "increased", "reduced"]
        action_count = 0
        word_count = 0
        for section in ["experience", "projects", "achievements"]:
            if section in resume_sections:
                content = resume_sections[section]
                if isinstance(content, list):
                    content = "\n".join(content)
                content_lower = str(content).lower()
                for verb in action_verbs:
                    action_count += content_lower.count(verb)
                word_count += len(content_lower.split())
        
        analysis["action_verbs"] = round(action_count / max(1, word_count / 100), 2)
        
        # Length analysis
        total_length = sum(len(str(content)) for content in resume_sections.values())
        for section, content in resume_sections.items():
            section_length = len(str(content))
            analysis["length_analysis"][section] = {
                "percent": round(section_length / max(1, total_length) * 100, 1),
                "score": min(1, section_length / 500)
            }
        
        # Calculate overall score
        scores = [
            1 if analysis["contact_info"] else 0,
            min(1, analysis["bullet_points"] * 2),
            min(1, analysis["action_verbs"] / 2),
            0.8 if len(resume_sections) >= 4 else 0.5
        ]
        analysis["overall_score"] = round(sum(scores) / len(scores) * 5, 1)
        
        return analysis
    except Exception as e:
        print(f"Error in analyze_format_and_structure: {str(e)}")
        return {"section_headings": 0, "bullet_points": 0, "length_analysis": {}, "action_verbs": 0, "contact_info": False, "overall_score": 3.0}

def generate_recommendations(section_analysis, skills_analysis, project_analysis, 
                           date_analysis, format_analysis, role_data):
    """Generate actionable recommendations"""
    try:
        recommendations = []
        
        # Section recommendations
        for missing in section_analysis.get("missing", []):
            recommendations.append(f"Add a '{missing}' section as it's required for {role_data.get('title', 'this')} role")
        
        for weak in section_analysis.get("weak", []):
            recommendations.append(f"Strengthen your '{weak}' section with more details")
        
        # Skills recommendations
        missing_required = skills_analysis.get("missing_required", [])
        if missing_required:
            rec = "Add these required skills: " + ", ".join(missing_required[:3])
            if len(missing_required) > 3:
                rec += f" (+{len(missing_required) - 3} more)"
            recommendations.append(rec)
        
        # Project recommendations
        if project_analysis.get("total_projects", 0) == 0:
            recommendations.append("Add at least 2-3 relevant projects to demonstrate your skills")
        elif project_analysis.get("total_projects", 0) < 2:
            recommendations.append("Add 1-2 more projects to strengthen your portfolio")
        
        if project_analysis.get("metrics_score", 0) < 3:
            recommendations.append("Add quantifiable metrics to your projects (e.g., 'Improved performance by 30%')")
        
        # Format recommendations
        if not format_analysis.get("contact_info", False):
            recommendations.append("Add contact information (email, phone, LinkedIn)")
        
        if format_analysis.get("bullet_points", 0) < 0.4:
            recommendations.append("Use more bullet points for better readability")
        
        if format_analysis.get("action_verbs", 0) < 1.5:
            recommendations.append("Use more action verbs (developed, created, managed, etc.)")
        
        return recommendations[:10]  # Limit to top 10 recommendations
    except Exception as e:
        print(f"Error in generate_recommendations: {str(e)}")
        return ["Review and improve your resume structure and content"]

def analyze_resume(resume_sections, jd_sections, role):
    """Main resume analysis function"""
    try:
        # Get role template from database
        role_data = ROLE_DATABASE.get(role, ROLE_DATABASE["software developer"])
        
        # Section presence analysis
        section_analysis = analyze_section_presence(
            resume_sections, 
            role_data["required_sections"]
        )
        
        # Skills analysis
        skills_analysis = analyze_skills(
            resume_sections.get("technical_skills", ""),
            role_data["required_skills"],
            role_data["preferred_skills"]
        )
        
        # Project analysis
        projects = resume_sections.get("projects", [])
        if not isinstance(projects, list):
            projects = [projects] if projects else []
        project_analysis = analyze_projects(projects, role_data)
        
        # Experience date analysis
        date_analysis = analyze_experience_dates(
            resume_sections.get("experience", "")
        )
        
        # Format and structure analysis
        format_analysis = analyze_format_and_structure(resume_sections)
        
        # Impact statements extraction
        impact_statements = []
        metrics_keywords = role_data.get("metrics_keywords", [])
        for section in ["experience", "projects", "achievements"]:
            content = resume_sections.get(section, "")
            if isinstance(content, list):
                content = "\n".join(content)
            
            for line in str(content).split("\n"):
                if any(kw in line.lower() for kw in metrics_keywords) and any(char in line for char in ["%", "$", "x"]):
                    impact_statements.append(line.strip())
        
        # Proof of work analysis
        all_content = " ".join([str(content) for content in resume_sections.values()])
        proof_of_work = {
            "github_links": len(re.findall(r"github\.com/\S+", all_content, re.IGNORECASE)),
            "portfolio_links": len(re.findall(r"portfolio|website", all_content, re.IGNORECASE)),
            "publications": len(resume_sections.get("publications", []))
        }
        
        # Calculate overall resume score
        section_score = 1 - len(section_analysis.get("missing", [])) / max(1, len(role_data["required_sections"]))
        skills_score = len(skills_analysis.get("present_required", [])) / max(1, len(role_data["required_skills"]))
        project_score = project_analysis.get("relevance_score", 0) / 5
        format_score = format_analysis.get("overall_score", 3) / 5
        
        overall_score = round((
            section_score * 0.30 +
            skills_score * 0.30 +
            project_score * 0.20 +
            format_score * 0.20
        ) * 5, 1)
        
        recommendations = generate_recommendations(
            section_analysis,
            skills_analysis,
            project_analysis,
            date_analysis,
            format_analysis,
            role_data
        )
        
        return {
            "role": role,
            "overall_score": overall_score,
            "section_analysis": section_analysis,
            "skills_analysis": skills_analysis,
            "project_analysis": project_analysis,
            "date_analysis": date_analysis,
            "format_analysis": format_analysis,
            "impact_statements": impact_statements,
            "proof_of_work": proof_of_work,
            "recommendations": recommendations
        }
    except Exception as e:
        print(f"Error in analyze_resume: {str(e)}")
        # Return default analysis if there's an error
        return {
            "role": role,
            "overall_score": 3.0,
            "section_analysis": {"missing": [], "weak": [], "present": []},
            "skills_analysis": {"missing_required": [], "missing_preferred": [], "present_required": [], "present_preferred": []},
            "project_analysis": {"projects": [], "complexity_score": 0, "metrics_score": 0, "relevance_score": 0, "total_projects": 0},
            "date_analysis": {"date_issues": [], "employment_gaps": [], "current_position": None, "date_format_score": 1.0},
            "format_analysis": {"section_headings": 0, "bullet_points": 0, "length_analysis": {}, "action_verbs": 0, "contact_info": False, "overall_score": 3.0},
            "impact_statements": [],
            "proof_of_work": {"github_links": 0, "portfolio_links": 0, "publications": 0},
            "recommendations": ["Unable to analyze resume completely. Please check the file format and try again."]
        }

@app.post("/analyze")
async def analyze_endpoint(resume: UploadFile = File(...), jd_text: str = Form(...)):
    """Main endpoint for resume analysis"""
    print("Received /analyze request")
    try:
        # Extract text from resume
        print("Extracting resume text...")
        resume_text = extract_text(resume)
        print(f"Extracted {len(resume_text)} characters from resume")
        
        # Clean and process JD text
        jd_text_clean = jd_text.strip()
        print("Identifying role...")
        role = identify_role(jd_text_clean)
        print(f"Identified role: {role}")
        
        # Split resume into sections
        print("Splitting resume sections...")
        resume_sections = split_resume_sections(resume_text)
        print(f"Found sections: {list(resume_sections.keys())}")
        
        # Split JD sections (if available)
        print("Splitting JD sections...")
        jd_sections = {}
        if split_jd_sections:
            try:
                jd_sections = split_jd_sections(jd_text_clean)
            except Exception as e:
                print(f"Error splitting JD sections: {str(e)}")
                jd_sections = {"full_text": jd_text_clean}
        else:
            jd_sections = {"full_text": jd_text_clean}
        
        # Analyze resume
        print("Analyzing resume...")
        analysis = analyze_resume(resume_sections, jd_sections, role)
        print("Analysis completed successfully")
        
        response_data = {
            "role": role,
            "resume_analysis": analysis,
            "resume_sections": resume_sections,
            "jd_sections": jd_sections
        }
        
        print("Returning analysis response")
        return JSONResponse(content=response_data)
        
    except Exception as e:
        print(f"Error in /analyze endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# @app.get("/health")
# async def health_check():
#     """Health check endpoint"""
#     return {"status": "healthy", "message": "Resume analyzer API is running"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)