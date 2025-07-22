import spacy

SECTION_TITLES = {
    "education": ["education", "academic background"],
    "experience": ["experience", "work experience", "employment history"],
    "achievements": ["achievements", "awards"],
    "projects": ["projects", "personal projects"],
    "technical_skills": ["technical skills", "skills", "technologies"],
    "certifications": ["certifications", "courses"]
}

nlp = spacy.load("en_core_web_sm")

def is_heading(line):
    return line.strip().isupper() or line.strip().endswith(":")

def match_section(line):
    line = line.lower().strip().replace(":", "")
    for key, variants in SECTION_TITLES.items():
        for variant in variants:
            if variant in line:
                return key
    return None

def split_resume_sections(text):
    lines = text.split("\n")
    sections = {k: "" for k in SECTION_TITLES}
    current_section = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        match = match_section(line)
        if match:
            current_section = match
            continue

        if current_section:
            sections[current_section] += line + "\n"

    return sections
