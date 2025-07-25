"use client"
import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, FileText, Zap, Target, Award, CheckCircle, AlertTriangle, Info, Star, ChevronDown, ChevronUp, TrendingUp } from "lucide-react"

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdText, setJdText] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [extractedText, setExtractedText] = useState<any>(null)
  const [showExtractedText, setShowExtractedText] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Toggle section visibility
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
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
        error: `Error: ${error instanceof Error ? error.message : "Something went wrong"}`
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
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-700"
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
        error: `Error: ${error instanceof Error ? error.message : "Something went wrong"}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced UI components
  const renderScoreBadge = (score: number) => (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
      score >= 80 ? 'bg-green-100 text-green-800 border border-green-200' :
      score >= 60 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
      'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
    </div>
  );

  const renderPriorityBadge = (priority: string) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
      priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
      priority === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
      'bg-blue-100 text-blue-700 border border-blue-200'
    }`}>
      {priority} priority
    </span>
  );

  const renderRecommendations = (recommendations: any[]) => (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <Zap className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Overall Recommendations</h3>
      </div>
      <div className="space-y-5">
        {recommendations.map((rec: any, index: number) => (
          <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                rec.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                rec.priority === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {rec.priority} priority
              </span>
            </div>
            <p className="text-slate-700 mb-4 leading-relaxed font-medium">{rec.recommendation}</p>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-emerald-700 font-medium"><strong>Expected Impact:</strong> {rec.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMissingSections = (sections: any[]) => (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-orange-100 rounded-xl">
          <FileText className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Missing Sections</h3>
      </div>
      {sections.length === 0 ? (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-green-800 font-semibold">All important sections are present!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section: any, index: number) => (
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-900 text-lg">{section.section}</h4>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  section.importance === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                  section.importance === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {section.importance} importance
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{section.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Enhanced ATS Score component
  const renderATSScore = (atsScore: any) => (
    <div className={`bg-white border rounded-xl p-6 shadow-sm ${getScoreBg(atsScore.score)}`}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('ats')}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-900">ATS Score</h3>
            {renderScoreBadge(atsScore.score)}
          </div>
        </div>
        {activeSection === 'ats' ? <ChevronUp className="text-slate-500 w-5 h-5" /> : <ChevronDown className="text-slate-500 w-5 h-5" />}
      </div>
      
      {activeSection === 'ats' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-end justify-between">
            <div className={`text-5xl font-bold ${getScoreColor(atsScore.score)}`}>
              {atsScore.score}
              <span className="text-2xl text-slate-500">/100</span>
            </div>
            <div className="w-3/5">
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    atsScore.score >= 80 ? 'bg-green-500' :
                    atsScore.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${atsScore.score}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
              <p className="text-slate-600 text-sm font-medium">Keyword Match</p>
              <p className="font-bold text-slate-900 text-lg">{atsScore.keyword_match || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
              <p className="text-slate-600 text-sm font-medium">Format Score</p>
              <p className="font-bold text-slate-900 text-lg">{atsScore.format_score || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="font-bold text-slate-900 mb-3">Analysis</h4>
            <p className="text-slate-700 leading-relaxed">{atsScore.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );

  // Enhanced Missing Skills component
  const renderMissingSkills = (skills: any[]) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('skills')}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Missing Skills {skills.length > 0 && <span className="text-red-600">({skills.length})</span>}
          </h3>
        </div>
        {activeSection === 'skills' ? <ChevronUp className="text-slate-500 w-5 h-5" /> : <ChevronDown className="text-slate-500 w-5 h-5" />}
      </div>
      
      {activeSection === 'skills' && (
        <div className="mt-6">
          {skills.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-800 font-semibold">Great! No critical skills are missing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill: any, index: number) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{skill.skill}</h4>
                      {renderPriorityBadge(skill.importance)}
                    </div>
                    <p className="text-slate-600">{skill.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Enhanced Grammar Check component
  const renderGrammarCheck = (grammar: any) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('grammar')}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Grammar & Spelling {grammar.errors_found > 0 && <span className="text-blue-600">({grammar.errors_found})</span>}
          </h3>
        </div>
        {activeSection === 'grammar' ? <ChevronUp className="text-slate-500 w-5 h-5" /> : <ChevronDown className="text-slate-500 w-5 h-5" />}
      </div>
      
      {activeSection === 'grammar' && (
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center bg-slate-50 border border-slate-200 p-5 rounded-xl flex-1">
              <div className="text-3xl font-bold text-blue-600">{grammar.errors_found}</div>
              <div className="text-sm text-slate-600 font-medium">Issues Found</div>
            </div>
            <div className="text-center bg-slate-50 border border-slate-200 p-5 rounded-xl flex-1">
              <div className="text-3xl font-bold text-slate-900">{grammar.word_count}</div>
              <div className="text-sm text-slate-600 font-medium">Total Words</div>
            </div>
          </div>
          
          {grammar.issues && grammar.issues.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Issues Found</h4>
              {grammar.issues.slice(0, 3).map((issue: any, index: number) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="font-bold text-blue-700 capitalize">{issue.type} Error</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-red-700"><strong>Issue:</strong> "{issue.text}"</p>
                    <p className="text-green-700"><strong>Suggestion:</strong> "{issue.suggestion}"</p>
                    <p className="text-slate-600 text-sm">{issue.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Enhanced Projects Analysis component
  const renderProjectsAnalysis = (projects: any[]) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('projects')}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Projects Analysis</h3>
        </div>
        {activeSection === 'projects' ? <ChevronUp className="text-slate-500 w-5 h-5" /> : <ChevronDown className="text-slate-500 w-5 h-5" />}
      </div>
      
      {activeSection === 'projects' && (
        <div className="mt-6">
          {projects.length === 0 ? (
            <p className="text-slate-600">No projects found to analyze.</p>
          ) : (
            <div className="space-y-6">
              {projects.map((project: any, index: number) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h4 className="font-bold text-slate-900 text-xl mb-4">{project.project_name}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.strengths && project.strengths.length > 0 && (
                      <div>
                        <h5 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Strengths
                        </h5>
                        <ul className="space-y-2">
                          {project.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-slate-600 flex items-start gap-3">
                              <Star className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.weaknesses && project.weaknesses.length > 0 && (
                      <div>
                        <h5 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Areas for Improvement
                        </h5>
                        <ul className="space-y-2">
                          {project.weaknesses.map((weakness: string, i: number) => (
                            <li key={i} className="text-slate-600 flex items-start gap-3">
                              <span className="w-4 h-4 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {project.improvement_suggestions && project.improvement_suggestions.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h5 className="font-bold text-blue-700 mb-3">Improvement Suggestions</h5>
                      <ul className="space-y-2">
                        {project.improvement_suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="text-slate-600 flex items-start gap-3">
                            <Zap className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-indigo-100 border border-indigo-200 px-5 py-2.5 rounded-full mb-6">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700 font-semibold">AI-Powered Resume Analysis</span>
          </div>
          {/* <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Resume Analyzer
          </h1> */}
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Optimize your resume with ATS scoring, skill gap analysis, and actionable insights
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Inputs */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="font-bold text-xl mb-6 text-slate-900">Upload Documents</h2>
              
              {/* Resume Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-slate-700">
                  Resume (PDF/DOCX)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragActive 
                      ? "border-indigo-400 bg-indigo-50" 
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
                        Drop your resume here
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
                <label className="block text-sm font-semibold mb-3 text-slate-700">
                  Job Description
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl p-4 min-h-[160px] text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Paste the job description you're applying for..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!resumeFile || !jdText || isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-3"
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
                    className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
                  >
                    <FileText className="w-4 h-4" />
                    Test Text Extraction
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Results */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Analyzing your resume</h3>
                <p className="text-slate-600 text-center max-w-md">
                  This usually takes 10-30 seconds. We're checking ATS compatibility, skills match, and more...
                </p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                {analysisResult.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <h3 className="font-bold text-red-800">Analysis Error</h3>
                    </div>
                    <p className="text-red-700 mt-3">{analysisResult.error}</p>
                  </div>
                ) : (
                  <>
                    {analysisResult.ats_score && renderATSScore(analysisResult.ats_score)}
                    {analysisResult.missing_skills && renderMissingSkills(analysisResult.missing_skills)}
                    {analysisResult.missing_sections && renderMissingSections(analysisResult.missing_sections)}
                    {analysisResult.grammar_and_spelling && renderGrammarCheck(analysisResult.grammar_and_spelling)}
                    {analysisResult.projects_analysis && renderProjectsAnalysis(analysisResult.projects_analysis)}
                    {analysisResult.overall_recommendations && renderRecommendations(analysisResult.overall_recommendations)}
                  </>
                )}
                
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={handleStartOver}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-5">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Upload your resume and job description to get a comprehensive analysis with ATS scoring, skills matching, and improvement suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;