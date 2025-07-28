"use client"

import { useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import { useDropzone } from "react-dropzone"
import {
  X,
  AlertCircle,
  Upload,
  FileText,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  Star,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Lightbulb,
  ClipboardCheck,
  BookOpen,
  Code,
  Users,
  Calendar,
  Globe,
  Briefcase,
  User,
  Sparkles,
  Layout,
  Type,
  Book,
  BarChart2,
  FileBadge,
  PenTool,
  ClipboardEdit,
} from "lucide-react"

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdText, setJdText] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [extractedText, setExtractedText] = useState<any>(null)
  const [showExtractedText, setShowExtractedText] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)


  interface WritingIssue {
    type: string
    context: string
    original: string
    suggestion: string
  }

  // Toggle section visibility
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    multiple: false,
  })

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
        error: `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`,
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
    setShowForm(true)
    setAnalysisResult(null)
    setExtractedText(null)
    setShowExtractedText(false)
    setResumeFile(null)
    setJdText("")
    setActiveSection(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200"
    if (score >= 60) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  const handleAnalyze = async () => {
    if (!resumeFile || !jdText) return
    setIsLoading(true)
    setShowForm(false)

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
        error: `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced UI components
  const renderScoreBadge = (score: number) => (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
        score >= 80
          ? "bg-green-100 text-green-800 border border-green-200"
          : score >= 60
          ? "bg-amber-100 text-amber-800 border border-amber-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"}
    </div>
  )

  const renderPriorityBadge = (priority: string) => (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
        priority === "high"
          ? "bg-red-100 text-red-700 border border-red-200"
          : priority === "medium"
          ? "bg-amber-100 text-amber-700 border border-amber-200"
          : "bg-blue-100 text-blue-700 border border-blue-200"
      }`}
    >
      {priority} priority
    </span>
  )

  // Enhanced Writing Quality section
  const renderWritingQuality = (writing: any) => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => toggleSection("writing")}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
            <PenTool className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Writing Quality
            </h3>
            <p className="text-sm text-gray-500">
              Professionalism, clarity, and impact assessment
            </p>
          </div>
        </div>
        {activeSection === "writing" ? (
          <ChevronUp className="text-gray-400 w-5 h-5" />
        ) : (
          <ChevronDown className="text-gray-400 w-5 h-5" />
        )}
      </div>

      {/* Content */}
      {activeSection === "writing" && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-100 pt-6">
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {writing.score}
                  <span className="text-lg text-blue-500 font-normal">/10</span>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  Professionalism Score
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                <div className="text-lg font-semibold text-gray-800 mb-1 leading-tight">
                  {writing.overall_quality_description?.split(".")[0] || "Good"}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Overall Quality
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-amber-700 mb-1">
                  {writing.error_count || 0}
                </div>
                <div className="text-sm font-medium text-amber-600">
                  Issues Found
                </div>
              </div>
            </div>

            {/* Issues Section */}
            {writing.issues && writing.issues.length > 0 ? (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Issues to Address
                  </h4>
                </div>

                <div className="space-y-4">
                  {(writing.issues as WritingIssue[]).map(
                    (issue: WritingIssue, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
                      >
                        <div className="p-4 bg-white border-b border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 capitalize">
                              {issue.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              {issue.context}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              ORIGINAL
                            </div>
                            <div className="bg-red-50 border-l-4 border-red-200 p-3 rounded-r-lg">
                              <span className="text-sm text-red-800 font-mono">
                                "{issue.original}"
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>

                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              SUGGESTED
                            </div>
                            <div className="bg-green-50 border-l-4 border-green-200 p-3 rounded-r-lg">
                              <span className="text-sm text-green-800 font-mono">
                                "{issue.suggestion}"
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-xl mb-8">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <p className="text-green-800 font-medium">
                  Excellent! Your writing meets professional standards.
                </p>
              </div>
            )}

            {/* Analysis Section */}
            {writing.analysis && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">
                  Professional Writing Tips
                </h4>
                <div className="prose prose-sm prose-blue max-w-none">
                  <div className="text-blue-800 leading-relaxed whitespace-pre-line">
                    {writing.analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  // Enhanced Recommendations section
  const renderRecommendations = (recommendations: any[]) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection("recommendations")}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Lightbulb className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Strategic Recommendations
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Prioritized actions for maximum impact
            </p>
          </div>
        </div>
        {activeSection === "recommendations" ? (
          <ChevronUp className="text-slate-500 w-5 h-5" />
        ) : (
          <ChevronDown className="text-slate-500 w-5 h-5" />
        )}
      </div>

      {activeSection === "recommendations" && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                <BarChart2 className="w-4 h-4" /> Priority Matrix
              </h4>
              <p className="text-sm text-slate-600 mt-2">
                Focus on high-impact items first to maximize your results
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <h4 className="font-bold text-emerald-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Implementation Plan
              </h4>
              <p className="text-sm text-slate-600 mt-2">
                Estimated timeline for completing all recommendations
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <h4 className="font-bold text-amber-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Expected Impact
              </h4>
              <p className="text-sm text-slate-600 mt-2">
                Prioritize actions that will yield the greatest improvement
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {recommendations.map((rec: any, index: number) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="font-bold text-indigo-700">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {rec.action}
                      </h4>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          rec.impact === "high"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : rec.impact === "medium"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        Impact: {rec.impact}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          rec.difficulty === "easy"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : rec.difficulty === "medium"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        Difficulty: {rec.difficulty}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          rec.timeline === "immediate"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : rec.timeline === "1 week"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        }`}
                      >
                        Timeline: {rec.timeline}
                      </span>
                    </div>
                  </div>
                </div>

                {rec.example_before && rec.example_after && (
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                        <X className="w-4 h-4" /> Current Version
                      </p>
                      <p className="text-slate-700">{rec.example_before}</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Enhanced Version
                      </p>
                      <p className="text-slate-700">{rec.example_after}</p>
                    </div>
                  </div>
                )}

                {rec.implementation_steps && (
                  <div className="mt-5 pt-5 border-t border-slate-200">
                    <h5 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-indigo-600" />{" "}
                      Implementation Steps
                    </h5>
                    <ol className="space-y-2 pl-5">
                      {rec.implementation_steps.map(
                        (step: string, i: number) => (
                          <li
                            key={i}
                            className="text-slate-700 list-decimal pl-2"
                          >
                            {step}
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Enhanced ATS Score component (always visible)
  const renderATSScore = (atsScore: any) => (
    <div
      className={`bg-white border rounded-xl p-6 shadow-sm ${getScoreBg(
        atsScore.overall
      )}`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <Target className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-slate-900">ATS Score</h3>
          {renderScoreBadge(atsScore.overall)}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div
            className={`text-5xl font-bold ${getScoreColor(atsScore.overall)}`}
          >
            {atsScore.overall}
            <span className="text-2xl text-slate-500">/100</span>
          </div>
          <div className="w-3/5">
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  atsScore.overall >= 80
                    ? "bg-green-500"
                    : atsScore.overall >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${atsScore.overall}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <p className="text-slate-600 text-sm font-medium">
                Keyword Match
              </p>
            </div>
            <p className="font-bold text-slate-900 text-lg">
              {atsScore.breakdown?.keyword_match || "N/A"} / 100
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Layout className="w-4 h-4 text-amber-500" />
              <p className="text-slate-600 text-sm font-medium">Structure</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">
              {atsScore.breakdown?.structure || "N/A"} / 100
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-green-500" />
              <p className="text-slate-600 text-sm font-medium">Readability</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">
              {atsScore.breakdown?.readability || "N/A"} / 100
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">
            Analysis
          </h4>
          <div className="prose prose-slate text-base leading-7 max-w-full space-y-4">
            <ReactMarkdown>{atsScore.explanation || ""}</ReactMarkdown>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atsScore.matched_keywords &&
            atsScore.matched_keywords.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atsScore.matched_keywords.map(
                    (keyword: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {atsScore.missing_keywords &&
            atsScore.missing_keywords.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atsScore.missing_keywords.map(
                    (keyword: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )

  const renderInterviewPrep = (prep: any) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection("interview")}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <ClipboardCheck className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Interview Preparation
          </h3>
        </div>
        {activeSection === "interview" ? (
          <ChevronUp className="text-slate-500 w-5 h-5" />
        ) : (
          <ChevronDown className="text-slate-500 w-5 h-5" />
        )}
      </div>
      {activeSection === "interview" && (
        <div className="mt-6 space-y-6">
          {prep.technical_questions && prep.technical_questions.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" /> Technical Questions
              </h4>
              <div className="space-y-4">
                {prep.technical_questions.map((question: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1.5 w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-700">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-slate-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prep.behavioral_questions &&
            prep.behavioral_questions.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" /> Behavioral
                  Questions
                </h4>
                <div className="space-y-4">
                  {prep.behavioral_questions.map(
                    (question: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1.5 w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">
                          <span className="text-xs font-bold text-green-700">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-slate-700">{question}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {prep.portfolio_suggestions &&
            prep.portfolio_suggestions.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-500" /> Portfolio
                  Suggestions
                </h4>
                <ul className="space-y-2">
                  {prep.portfolio_suggestions.map(
                    (suggestion: string, i: number) => (
                      <li
                        key={i}
                        className="text-slate-700 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mt-0.5 flex-shrink-0">
                          {i + 1}
                        </span>
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  )

  // Enhanced Missing Skills component
  const renderMissingSkills = (skills: any[]) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection("skills")}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Missing Skills{" "}
            {skills.length > 0 && (
              <span className="text-red-600">({skills.length})</span>
            )}
          </h3>
        </div>
        {activeSection === "skills" ? (
          <ChevronUp className="text-slate-500 w-5 h-5" />
        ) : (
          <ChevronDown className="text-slate-500 w-5 h-5" />
        )}
      </div>
      {activeSection === "skills" && (
        <div className="mt-6">
          {skills.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-800 font-semibold">
                Great! No critical skills are missing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill: any, index: number) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 text-lg">
                      {skill.skill}
                    </h4>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {skill.type}
                      </span>
                      {renderPriorityBadge(skill.importance)}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-3">{skill.suggestion}</p>

                  {skill.learning_resources &&
                    skill.learning_resources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />{" "}
                          Learning Resources
                        </h5>
                        <ul className="space-y-2 pl-5">
                          {skill.learning_resources.map(
                            (resource: string, i: number) => (
                              <li key={i} className="text-slate-700 list-disc">
                                {resource}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {skill.demonstration_strategy && (
                    <div className="mt-4">
                      <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <FileBadge className="w-4 h-4 text-green-500" /> How to
                        Demonstrate
                      </h5>
                      <p className="text-slate-700">
                        {skill.demonstration_strategy}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Enhanced Projects Analysis component
  const renderProjectsAnalysis = (projects: any[]) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection("projects")}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Code className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Projects Analysis{" "}
            {projects.length > 0 && (
              <span className="text-emerald-600">({projects.length})</span>
            )}
          </h3>
        </div>
        {activeSection === "projects" ? (
          <ChevronUp className="text-slate-500 w-5 h-5" />
        ) : (
          <ChevronDown className="text-slate-500 w-5 h-5" />
        )}
      </div>
      {activeSection === "projects" && (
        <div className="mt-6">
          {projects.length === 0 ? (
            <p className="text-slate-600">No projects found to analyze.</p>
          ) : (
            <div className="space-y-6">
              {projects.map((project: any, index: number) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-slate-900 text-xl">
                      {project.project_name}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.relevance === "High"
                          ? "bg-green-100 text-green-800"
                          : project.relevance === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {project.relevance} Relevance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.strengths && project.strengths.length > 0 && (
                      <div>
                        <h5 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" /> Strengths
                        </h5>
                        <ul className="space-y-2">
                          {project.strengths.map(
                            (strength: string, i: number) => (
                              <li
                                key={i}
                                className="text-slate-600 flex items-start gap-3"
                              >
                                <Star className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                {strength}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    {project.weaknesses && project.weaknesses.length > 0 && (
                      <div>
                        <h5 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" /> Areas for
                          Improvement
                        </h5>
                        <ul className="space-y-2">
                          {project.weaknesses.map(
                            (weakness: string, i: number) => (
                              <li
                                key={i}
                                className="text-slate-600 flex items-start gap-3"
                              >
                                <span className="w-4 h-4 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                {weakness}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {project.improvements && project.improvements.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h5 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Improvement Suggestions
                      </h5>
                      <ul className="space-y-2">
                        {project.improvements.map(
                          (suggestion: string, i: number) => (
                            <li
                              key={i}
                              className="text-slate-600 flex items-start gap-3"
                            >
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mt-0.5 flex-shrink-0">
                                {i + 1}
                              </span>
                              {suggestion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {project.star_example && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h5 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> STAR Method Example
                      </h5>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {project.star_example
                            .split("|")
                            .map((part: string, i: number) => (
                              <div key={i} className="text-center">
                                <div className="font-bold text-purple-700 mb-1">
                                  {["Situation", "Task", "Action", "Result"][i]}
                                </div>
                                <p className="text-slate-700 text-sm">
                                  {part.trim()}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white border border-indigo-200 px-5 py-2.5 rounded-full mb-6 shadow-sm">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700 font-semibold">
              AI-Powered Resume Optimization
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
            Elevate Your Career Prospects
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional-grade analysis to optimize your resume, improve ATS
            compatibility, and maximize interview opportunities
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Inputs */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <ClipboardEdit className="w-6 h-6 text-indigo-600" />
                <h2 className="font-bold text-2xl text-slate-900">
                  Resume Analysis
                </h2>
              </div>

              {/* Resume Upload */}
              <div className="mb-6">
                <label
                  htmlFor="resume-upload"
                  className="block text-sm font-semibold mb-3 text-slate-700"
                >
                  Resume (PDF/DOCX)
                </label>
                <div
                  {...getRootProps()}
                  id="resume-upload"
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ease-in-out ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                      : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  {resumeFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <p className="font-semibold text-slate-900 truncate max-w-[160px]">
                          {resumeFile.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile()
                        }}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Remove resume file"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="p-4 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
                        <Upload className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="font-semibold text-slate-900 mb-2">
                        Drop your resume here or click to upload
                      </p>
                      <p className="text-sm text-slate-500">
                        PDF, DOC, DOCX (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <label
                  htmlFor="jd-text"
                  className="block text-sm font-semibold mb-3 text-slate-700"
                >
                  Job Description
                </label>
                <textarea
                  id="jd-text"
                  className="w-full border border-slate-300 rounded-xl p-4 min-h-[180px] text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-slate-900 placeholder:text-slate-400 shadow-sm"
                  placeholder="Paste the job description you're applying for here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  aria-label="Job Description Textarea"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!resumeFile || !jdText || isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center gap-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Analyze Resume
                    </>
                  )}
                </button>
                {resumeFile && (
                  <button
                    onClick={handleExtractText}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Extracted Text
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Results */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-10 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Analyzing your resume...
                </h3>
                <p className="text-slate-600 text-center max-w-md">
                  This usually takes 10-30 seconds. We're checking ATS
                  compatibility, skills match, grammar, and more to provide
                  comprehensive insights.
                </p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                {analysisResult.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <h3 className="font-bold text-red-800 text-xl">
                        Analysis Error
                      </h3>
                    </div>
                    <p className="text-red-700 mt-3">{analysisResult.error}</p>
                  </div>
                ) : (
                  <>
                    {analysisResult.ats_score &&
                      renderATSScore(analysisResult.ats_score)}
                    {analysisResult.missing_skills &&
                      renderMissingSkills(analysisResult.missing_skills)}
                    {analysisResult.grammar_feedback &&
                      renderWritingQuality(analysisResult.grammar_feedback)}
                    {analysisResult.projects_analysis &&
                      renderProjectsAnalysis(analysisResult.projects_analysis)}
                    {analysisResult.interview_preparation &&
                      renderInterviewPrep(analysisResult.interview_preparation)}
                    {analysisResult.recommendations &&
                      renderRecommendations(analysisResult.recommendations)}
                  </>
                )}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleStartOver}
                    className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    Start New Analysis
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="bg-indigo-100 p-4 rounded-full mb-5">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Ready to Analyze Your Resume
                </h3>
                <p className="text-slate-600 text-base max-w-md">
                  Upload your resume and paste the job description to get a
                  comprehensive analysis with ATS scoring, skills matching, and
                  personalized improvement suggestions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Text Modal/Overlay */}
        {showExtractedText && extractedText && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowExtractedText(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                aria-label="Close extracted text view"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-3">
                Extracted Resume Text
              </h3>
              {extractedText.error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700">{extractedText.error}</p>
                </div>
              ) : (
                <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap font-mono">
                  {extractedText.extracted_text}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeAnalyzer
