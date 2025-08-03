# Resume Score Checker

![Project Banner](https://via.placeholder.com/1200x400?text=Resume+Score+Checker+Banner)

## 🚀 Overview

The **Resume Score Checker** is an intelligent web application designed to streamline the job application process by providing a compatibility score between a candidate's resume and a specific job description. Leveraging advanced natural language processing (NLP) techniques, this tool helps job seekers tailor their resumes more effectively and assists recruiters in quickly identifying suitable candidates.

It analyzes key skills, keywords, and phrases from both documents to generate a precise score, along with actionable insights to improve resume relevance.

## ✨ Features

*   **Intelligent Scoring:** Calculates a comprehensive compatibility score based on the relevance of your resume to a given job description.
*   **Keyword Matching:** Identifies and highlights matching keywords and skills between the resume and job description.
*   **Document Upload:** Supports easy upload of resumes (e.g., PDF, DOCX) and direct input of job descriptions.
*   **User-Friendly Interface:** An intuitive and responsive web interface for a seamless user experience.
*   **Actionable Insights:** Provides suggestions for improving resume alignment with job requirements.

## 🛠️ Technologies Used

This project is built with a modern full-stack architecture, combining robust server processing with a dynamic web.

**server (Python):**
*   **Python 3.x:** The core language for data processing and NLP.
*   **Flask / FastAPI:** (Choose one based on your actual implementation) A lightweight web framework for building the API.
*   **NLTK / spaCy / scikit-learn:** (Choose based on your actual implementation) Libraries for natural language processing, text extraction, and similarity calculations.
*   **python-docx / PyPDF2:** For parsing and extracting text from document formats.

**web (Next.js / React):**
*   **Next.js:** A React framework for building performant and scalable web applications.
*   **React:** For building interactive user interfaces.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and responsive styling.
*   **shadcn/ui:** Beautifully designed components built with Radix UI and Tailwind CSS.

## 📂 Project Structure

The repository is organized into a clear and modular structure to separate concerns between the web and server, facilitating development and maintenance.
```
Resume-Score-Checker/
├── web/          # Front-end (Next.js)
├── server/       # Back-end (Python + AI resume logic)
├── README.md
```

## ⚙️ Installation

Follow these steps to set up and run the Resume Score Checker locally.

### Prerequisites

*   **Python 3.8\+**
*   **Node.js 18\+**
*   **npm** or **Yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Rajeev12R/Resume-Score-Checker.git
cd Resume-Score-Checker
```

### 2. server Setup

Navigate to the `server` directory, create a virtual environment, and install dependencies.

```bash
cd server
python3 -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
```

### 3. web Setup

Navigate to the `web` directory and install Node.js dependencies.

```bash
cd ../web
npm install
```

## 🚀 Running the Application

### 1. Start the server Server

From the `server` directory:

```bash
source venv/bin/activate # On Windows: .\venv\Scripts\activate
flask run # or uvicorn app:app --reload for FastAPI
```
The server server will typically run on `http://127.0.0.1:5000` (Flask) or `http://127.0.0.1:8000` (FastAPI).

### 2. Start the web Development Server

From the `web` directory:

```bash
npm run dev 
```
The web application will be accessible at `http://localhost:3000`.

## 💡 Usage

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  Upload your resume file (PDF or DOCX).
3.  Paste the job description into the provided text area.
4.  Click the "Get Score" button to analyze and view the compatibility score and insights.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## 📧 Connect with us

*   **Rajeev Ranjan** - rjranjan2112@gmail.com
*   **GitHub:** [Rajeev12R](https://github.com/Rajeev12R)

*   **Sai Prashanth** - saiprashanth751@gmail.com
*   **GitHub:** [saiprashanth751](https://github.com/saiprashanth751)



