from extractor.pdf_extractor import extract_text_from_pdf
from sectioner.resume_sectioner import split_resume_sections


resume_path = "./extractor/samples/testing_resume.pdf"


resume_text = extract_text_from_pdf(resume_path)


resume_sections = split_resume_sections(resume_text)


print("=== RESUME SECTIONS ===")
for k, v in resume_sections.items():
    print(f"\n-- {k.upper()} --\n{v[:300]}")

