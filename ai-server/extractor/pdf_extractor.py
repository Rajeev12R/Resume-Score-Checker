
import fitz

def extract_text_from_pdf(path: str) -> str:
    try:
        doc = fitz.open(path)
        text = ""
        for page in doc:
            text += page.get_text("text")
        return text.strip()
    except Exception as e:
        print(f"[ERROR] Failed to extract PDF: {e}")
        return ""
