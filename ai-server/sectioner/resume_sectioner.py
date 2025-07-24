import re
import spacy
from rapidfuzz import fuzz, process

# Expanded section titles with comprehensive variations
SECTION_TITLES = {
    "education": [
        "education", "academic background", "academics", "qualifications", 
        "educational qualifications", "academic training", "degrees",
        "academic achievements", "scholastics", "certifications"
    ],
    "experience": [
        "experience", "work experience", "employment history", "professional experience",
        "work history", "employment", "professional background", "career history",
        "professional summary", "work", "employment record"
    ],
    "achievements": [
        "achievements", "awards", "honors", "accomplishments", 
        "recognitions", "publications", "research", "grants",
        "scholarships", "leadership", "activities"
    ],
    "projects": [
        "projects", "personal projects", "major projects", "project experience",
        "notable projects", "project portfolio", "key projects", "project showcase",
        "project details", "technical projects", "project"
    ],
    "technical_skills": [
        "technical skills", "skills", "technologies", "technical proficiencies",
        "technical expertise", "skills summary", "technical competencies",
        "programming languages", "tools", "frameworks", "libraries",
        "technical knowledge", "it skills", "computer skills"
    ],
    "certifications": [
        "certifications", "courses", "certificates", "licenses", 
        "training", "professional development", "workshops", 
        "seminars", "learning", "professional certifications"
    ]
}

# Load spaCy model with error handling
try:
    nlp = spacy.load("en_core_web_md")
except OSError:
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        print("Warning: No spaCy model found. Install with: python -m spacy download en_core_web_sm")
        nlp = None

# Enhanced heading detection regex
HEADING_REGEX = re.compile(
    r"^([A-Z][A-Za-z0-9\s\-&\(\)\/]{2,20})(?::|\s*$)|"
    r"^(?:[A-Z]+\s*)+$", 
    re.IGNORECASE | re.MULTILINE
)

def resolve_heading(line):
    """Combined heading detection and section matching with optimized logic"""
    stripped = line.strip()
    if not stripped:
        return None
    
    # Check if it's a heading candidate using structural rules
    is_heading = False
    if HEADING_REGEX.match(stripped):
        is_heading = True
    elif nlp is not None:  # Only use spaCy if available
        doc = nlp(stripped)
        
        # Rule 1: Short noun phrases
        if len(doc) < 6 and all(token.pos_ in {"NOUN", "PROPN", "ADJ"} for token in doc):
            is_heading = True
            
        # Rule 2: Title case with specific POS patterns
        elif stripped.istitle() and any(token.pos_ in {"NOUN", "PROPN"} for token in doc):
            is_heading = True
            
        # Rule 3: Absence of verbs in short phrases
        elif 3 < len(doc) < 10 and not any(token.pos_ == "VERB" for token in doc):
            is_heading = True
    else:
        # Fallback heuristics when spaCy is not available
        words = stripped.split()
        if len(words) <= 5 and stripped.isupper():
            is_heading = True
        elif len(words) <= 3 and stripped.istitle():
            is_heading = True
    
    if not is_heading:
        return None
    
    # Normalize text for matching
    normalized = re.sub(r'[^\w\s]', '', stripped.lower()).strip()
    
    # First try exact match
    for key, variants in SECTION_TITLES.items():
        if normalized in variants:
            return key
    
    # Then try fuzzy match
    all_titles = [t for sublist in SECTION_TITLES.values() for t in sublist]
    result = process.extractOne(
        normalized, 
        all_titles, 
        scorer=fuzz.token_sort_ratio
    )
    
    if result and result[1] > 85:  # Only accept high confidence matches
        best_match = result[0]
        for key, variants in SECTION_TITLES.items():
            if best_match in variants:
                return key
    
    return None

def split_projects_section(projects_text):
    """Advanced project parsing with multiple pattern recognition"""
    projects = []
    current = []
    lines = [l.strip() for l in projects_text.split("\n") if l.strip()]
    
    for i, line in enumerate(lines):
        # Detect project starters
        is_starter = (
            re.match(r"^(\d+[.\)]|[\u2022\u25CF*>-])\s+", line) or
            (line[0].isupper() and len(line) < 100) or
            (i > 0 and not lines[i-1].endswith(('.', ':', ';')) and
             len(line) < 80 and line[0].isupper())
        )
        
        if is_starter and current:
            projects.append(" ".join(current))
            current = [line]
        else:
            current.append(line)
    
    if current:
        projects.append(" ".join(current))
        
    return projects

def classify_ambiguous_content(text):
    """Heuristic-based classification for ambiguous sections"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ["react", "node", "built", "developed", "github", "project"]):
        return "projects"
    elif any(word in text_lower for word in ["bachelor", "master", "phd", "university", "gpa", "degree"]):
        return "education"
    elif any(word in text_lower for word in ["managed", "led", "responsible", "achieved", "experience"]):
        return "experience"
    elif any(word in text_lower for word in ["python", "java", "sql", "aws", "docker", "skill"]):
        return "technical_skills"
    elif any(word in text_lower for word in ["certified", "certificate", "license", "course", "training"]):
        return "certifications"
    elif any(word in text_lower for word in ["award", "honor", "publication", "research", "grant"]):
        return "achievements"
        
    return "other"

def split_resume_sections(text):
    """Optimized resume section parser with combined heading resolver"""
    lines = text.split("\n")
    sections = {k: [] for k in SECTION_TITLES}
    sections["other"] = []
    current_section = None
    buffer = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        # Combined heading detection and section matching
        section_key = resolve_heading(stripped)
        if section_key is not None:
            # Flush buffer to current section
            if buffer and current_section:
                sections[current_section].extend(buffer)
                buffer = []
                
            # Start new section
            current_section = section_key
            continue
            
        # Content processing
        if current_section:
            buffer.append(stripped)
        else:
            sections["other"].append(stripped)
    
    # Process remaining buffer
    if buffer and current_section:
        sections[current_section].extend(buffer)
    
    # Post-processing
    final_sections = {}
    for section, content_list in sections.items():
        if not content_list:
            continue
            
        content = "\n".join(content_list)
        
        # Special handling for projects section
        if section == "projects":
            final_sections[section] = split_projects_section(content)
        # Convert lists to strings for other sections
        else:
            final_sections[section] = content
    
    # Process ambiguous content in 'other' section
    if "other" in final_sections:
        classified = classify_ambiguous_content(final_sections["other"])
        if classified != "other":
            if classified in final_sections:
                if isinstance(final_sections[classified], list):
                    final_sections[classified].append(final_sections["other"])
                else:
                    final_sections[classified] += "\n" + final_sections["other"]
            else:
                final_sections[classified] = final_sections["other"]
            del final_sections["other"]
    
    return final_sections
