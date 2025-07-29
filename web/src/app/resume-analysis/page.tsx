//web\src\app\resume-analysis\page.tsx

"use client"

import { useState, useCallback } from "react"
import { Zap } from "lucide-react"

// Updated imports to use default exports
import ResumeAnalysisForm from "@/components/resume-analysis/resume-analysis-form"
import AnalysisResultsDisplay from "@/components/resume-analysis/analysis-results-display"
import CoverLetterFormModal from "@/components/resume-analysis/cover-letter-form-modal"
import CoverLetterResultModal from "@/components/resume-analysis/cover-letter-result-modal"
import ExtractedTextModal from "@/components/resume-analysis/extracted-text-modal"


interface CoverLetterData {
  companyName: string
  roleTitle: string
  industry: string
  companyValues: string
  personalTouch: string
  tone: string
  experienceLevel: string
  coverLetterType: string
  keyAchievements: string
  preferredLength: string
}

interface CoverLetterResult {
  cover_letter: string
  quality_metrics?: {
    overall_score: number
    component_scores: {
      ai_avoidance: number
      sentence_variation: number
      personalization: number
      achievement_metrics: number
      keyword_alignment: number
      power_verbs: number
      language_quality: number
    }
    issues: string[]
    recommendation: string
  }
  effectiveness_analysis?: {
    readability_metrics: {
      word_count: number
      paragraph_count: number
      avg_words_per_paragraph: number
      reading_level: string
    }
    content_analysis: {
      skill_coverage: number
      mentioned_skills: string[]
      missing_jd_skills: string[]
      quantified_achievements: number
    }
    improvement_suggestions: string[]
  }
  industry_optimization?: {
    industry: string
    tone_applied: string
    length_category: string
    industry_keywords_used: string[]
  }
}

export default function ResumeAnalyzerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdText, setJdText] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [extractedText, setExtractedText] = useState<any>(null)
  const [showExtractedText, setShowExtractedText] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Cover Letter states
  const [showCoverLetterForm, setShowCoverLetterForm] = useState(false)
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    companyName: "",
    roleTitle: "",
    industry: "",
    companyValues: "",
    personalTouch: "",
    tone: "professional",
    experienceLevel: "mid-level",
    coverLetterType: "application",
    keyAchievements: "",
    preferredLength: "medium"
  });

  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResult | null>(null);
  const [coverLetter, setCoverLetter] = useState("")
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false)
  const [showCoverLetterResult, setShowCoverLetterResult] = useState(false)

  // Toggle section visibility for analysis results
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0])
    }
  }, [])

  const handleGenerateCoverLetter = async () => {
  if (!resumeFile || !jdText || !coverLetterData.companyName || !coverLetterData.roleTitle) {
    alert("Please ensure resume, job description, company name, and role title are provided.");
    return;
  }

  setIsGeneratingCoverLetter(true);
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd_text", jdText);
  formData.append("company_name", coverLetterData.companyName);
  formData.append("role_title", coverLetterData.roleTitle);
  formData.append("industry", coverLetterData.industry);
  formData.append("company_values", coverLetterData.companyValues);
  formData.append("personal_touch", coverLetterData.personalTouch);
  formData.append("tone", coverLetterData.tone);
  formData.append("experience_level", coverLetterData.experienceLevel);
  formData.append("cover_letter_type", coverLetterData.coverLetterType);
  formData.append("key_achievements", coverLetterData.keyAchievements);
  formData.append("preferred_length", coverLetterData.preferredLength);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const res = await fetch("http://localhost:8000/generate-cover-letter/", {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Server error");
    }

    const data = await res.json();
    setCoverLetterResult(data);
    setCoverLetter(data.cover_letter);
    setShowCoverLetterResult(true);
    setShowCoverLetterForm(false);
  } catch (error) {
    console.error("Error:", error);
    alert(`Error generating cover letter: ${error instanceof Error ? error.message : "Something went wrong"}`);
  } finally {
    setIsGeneratingCoverLetter(false);
  }
};

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter)
    alert("Cover letter copied to clipboard!")
  }

  const handleDownloadCoverLetter = () => {
    const element = document.createElement("a")
    const file = new Blob([coverLetter], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${coverLetterData.companyName}_${coverLetterData.roleTitle}_CoverLetter.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleExtractText = async () => {
    if (!resumeFile) return
    setIsLoading(true)
    const formData = new FormData()
    formData.append("resume", resumeFile)

    try {
      const res = await fetch("http://localhost:8000/extract-text/", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Server error")
      }
      const data = await res.json()
      setExtractedText(data)
      setShowExtractedText(true)
    } catch (error) {
      console.error("Error:", error)
      setExtractedText({
        error: `Error: ${error instanceof Error ? error.message : "Something went wrong"}`,
      })
      setShowExtractedText(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setResumeFile(null)
    setExtractedText(null)
    setShowExtractedText(false)
  }

  const handleStartOver = () => {
    setAnalysisResult(null);
    setExtractedText(null);
    setShowExtractedText(false);
    setResumeFile(null);
    setJdText("");
    setActiveSection(null);
    setCoverLetter("");
    setCoverLetterResult(null);
    setShowCoverLetterResult(false);
    setShowCoverLetterForm(false);
    setCoverLetterData({
      companyName: "",
      roleTitle: "",
      industry: "",
      companyValues: "",
      personalTouch: "",
      tone: "professional",
      experienceLevel: "mid-level",
      coverLetterType: "application",
      keyAchievements: "",
      preferredLength: "medium"
    });
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jdText) return
    setIsLoading(true)

    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("jd_text", jdText)

    try {
      const res = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Server error")
      }
      const data = await res.json()
      setAnalysisResult(data.result || "No result received.")
    } catch (error) {
      console.error("Error:", error)
      setAnalysisResult({
        error: `Error: ${error instanceof Error ? error.message : "Something went wrong"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white border border-indigo-200 px-5 py-2.5 rounded-full mb-6 shadow-sm">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700 font-semibold">AI-Powered Resume Optimization</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
            Elevate Your Career Prospects
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional-grade analysis to optimize your resume, improve ATS compatibility, and maximize interview
            opportunities
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Inputs */}
          <div className="lg:col-span-1">
            <ResumeAnalysisForm
              resumeFile={resumeFile}
              setResumeFile={setResumeFile}
              jdText={jdText}
              setJdText={setJdText}
              isLoading={isLoading}
              handleAnalyze={handleAnalyze}
              handleExtractText={handleExtractText}
              handleRemoveFile={handleRemoveFile}
              setShowCoverLetterForm={setShowCoverLetterForm}
              onDrop={onDrop}
            />
          </div>

          {/* Right column - Results */}
          <div className="lg:col-span-2">
            <AnalysisResultsDisplay
              isLoading={isLoading}
              analysisResult={analysisResult}
              handleStartOver={handleStartOver}
              activeSection={activeSection}
              toggleSection={toggleSection}
            />
          </div>
        </div>

        {/* Modals */}
        {showCoverLetterForm && (
          <CoverLetterFormModal
            showCoverLetterForm={showCoverLetterForm} 
            setShowCoverLetterForm={setShowCoverLetterForm}
            coverLetterData={coverLetterData}
            setCoverLetterData={setCoverLetterData}
            handleGenerateCoverLetter={handleGenerateCoverLetter}
            isGeneratingCoverLetter={isGeneratingCoverLetter}
          />
        )}

        {showCoverLetterResult && coverLetterResult && (
          <CoverLetterResultModal
            showCoverLetterResult={showCoverLetterResult}
            setShowCoverLetterResult={setShowCoverLetterResult}
            coverLetterResult={coverLetterResult}
            coverLetterData={coverLetterData}
            handleCopyCoverLetter={handleCopyCoverLetter}
            handleDownloadCoverLetter={handleDownloadCoverLetter}
            setShowCoverLetterForm={setShowCoverLetterForm}
          />
        )}

        {showExtractedText && extractedText && (
          <ExtractedTextModal
            showExtractedText={showExtractedText}
            setShowExtractedText={setShowExtractedText}
            extractedText={extractedText}
          />
        )}
      </div>
    </div>
  )
}
