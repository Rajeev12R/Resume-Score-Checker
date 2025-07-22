from pdf_extractor import extract_text_from_pdf


pdf_path = "./samples/testing_resume.pdf"

extracted_text = extract_text_from_pdf(pdf_path)

print("---------Extracted Text(Printing Everything)-----------")
print(extracted_text)
