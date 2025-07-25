from fastapi import FastAPI, UploadFile, Form, HTTPException
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
        # For .doc files, we'll use a basic text extraction
        # In production, you might want to use python-docx2txt or similar
        text = file_content.decode('utf-8', errors='ignore')
        return text
    except Exception as e:
        print(f"Error extracting DOC: {e}")
        return None

@app.post("/analyze/")
async def analyze_resume(resume: UploadFile, jd_text: str = Form(...)):
    try:
        content = await resume.read()
        
        # Extract text based on file type
        file_extension = resume.filename.lower().split('.')[-1] if resume.filename else ""
        
        if file_extension == 'pdf':
            resume_text = extract_text_from_pdf(content)
        elif file_extension == 'docx':
            resume_text = extract_text_from_docx(content)
        elif file_extension == 'doc':
            resume_text = extract_text_from_doc(content)
        else:
            # Fallback to basic decoding
            resume_text = content.decode("utf-8", errors="ignore")
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=422, 
                detail="Could not extract readable text from the resume. Please ensure the file is not corrupted and contains readable text."
            )

        # Debug: Print first 500 characters of extracted text
        print(f"Extracted text preview: {resume_text[:500]}...")
        print(f"Total text length: {len(resume_text)}")

        prompt = f"""
You are an expert ATS (Applicant Tracking System) and resume analysis AI. Analyze the following resume against the given job description and provide a comprehensive analysis in JSON format.

Job Description:
{jd_text}

Resume:
{resume_text}

Please analyze and return a JSON response with the following structure:
{{
    "ats_score": {{
        "score": <number out of 100>,
        "explanation": "<detailed explanation of the score>"
    }},
    "missing_skills": [
        {{
            "skill": "<skill name>",
            "importance": "<high/medium/low>",
            "suggestion": "<how to acquire or demonstrate this skill>"
        }}
    ],
    "missing_sections": [
        {{
            "section": "<section name>",
            "importance": "<high/medium/low>",
            "description": "<why this section is important>"
        }}
    ],
    "grammar_and_spelling": {{
        "errors_found": <number>,
        "issues": [
            {{
                "type": "<grammar/spelling>",
                "text": "<problematic text>",
                "suggestion": "<corrected version>"
            }}
        ],
        "overall_quality": "<excellent/good/fair/poor>"
    }},
    "projects_analysis": [
        {{
            "project_name": "<project name>",
            "current_description": "<current description>",
            "strengths": ["<strength 1>", "<strength 2>"],
            "weaknesses": ["<weakness 1>", "<weakness 2>"],
            "improvement_suggestions": ["<suggestion 1>", "<suggestion 2>"],
            "quantifiable_achievements": {{
                "current": ["<current metrics if any>"],
                "suggested": ["<suggested metrics to add>"]
            }}
        }}
    ],
    "resume_format": {{
        "overall_rating": "<excellent/good/fair/poor>",
        "strengths": ["<format strength 1>", "<format strength 2>"],
        "improvements": ["<improvement 1>", "<improvement 2>"],
        "ats_compatibility": "<high/medium/low>"
    }},
    "proof_of_work_metrics": {{
        "current_metrics": ["<existing quantified achievements>"],
        "missing_opportunities": ["<areas where metrics could be added>"],
        "suggested_metrics": [
            {{
                "area": "<area of work>",
                "suggested_metric": "<specific metric to track>",
                "example": "<example of how to present it>"
            }}
        ]
    }},
    "overall_recommendations": [
        {{
            "priority": "<high/medium/low>",
            "recommendation": "<specific actionable advice>",
            "impact": "<expected impact on ATS score/hiring chances>"
        }}
    ]
}}

Important guidelines:
1. Be specific and actionable in all suggestions
2. Focus on quantifiable improvements
3. Consider ATS parsing capabilities
4. Provide realistic timelines for improvements
5. Prioritize changes that will have the biggest impact
6. Check for grammar and spelling errors carefully
7. Analyze each project for impact and measurable outcomes
8. Ensure the JSON is properly formatted and valid
"""

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        
        # Clean the response text to extract only the JSON
        response_text = response.text.strip()
        
        # Try to extract JSON from the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            try:
                parsed_result = json.loads(json_str)
                return JSONResponse(content={"result": parsed_result})
            except json.JSONDecodeError:
                # If JSON parsing fails, return the raw text
                return JSONResponse(content={"result": {"raw_response": response_text}})
        else:
            return JSONResponse(content={"result": {"raw_response": response_text}})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-text/")
async def extract_text_only(resume: UploadFile):
    """Debug endpoint to see extracted text"""
    try:
        content = await resume.read()
        
        # Extract text based on file type
        file_extension = resume.filename.lower().split('.')[-1] if resume.filename else ""
        
        if file_extension == 'pdf':
            resume_text = extract_text_from_pdf(content)
        elif file_extension == 'docx':
            resume_text = extract_text_from_docx(content)
        elif file_extension == 'doc':
            resume_text = extract_text_from_doc(content)
        else:
            resume_text = content.decode("utf-8", errors="ignore")
        
        return JSONResponse(content={
            "filename": resume.filename,
            "file_type": file_extension,
            "text_length": len(resume_text) if resume_text else 0,
            "extracted_text": resume_text[:2000] + "..." if resume_text and len(resume_text) > 2000 else resume_text,
            "full_text": resume_text  # Be careful with this in production
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))