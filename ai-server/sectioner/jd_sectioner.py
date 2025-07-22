import spacy

JD_SECTIONS = {
    "company_name": ["company", "organization", "employer"],
    "role": ["role", "position", "designation"],
    "responsibilities": ["responsibilities", "job description", "tasks"],
    "skills_needed": ["skills", "requirements", "technical skills"],
    "experience_needed": ["experience", "years of experience"],
    "achievements_focus": ["achievements", "recognition", "awards"],
    "eligibility": ["eligibility", "qualifications", "criteria"]
}

nlp = spacy.load("en_core_web_sm")

def split_jd_sections(text):
    lines = text.split("\n")
    sections = {k: "" for k in JD_SECTIONS}
    current_section = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        for key, phrases in JD_SECTIONS.items():
            for phrase in phrases:
                if phrase.lower() in line.lower():
                    current_section = key
                    break

        if current_section:
            sections[current_section] += line + "\n"

    return sections
