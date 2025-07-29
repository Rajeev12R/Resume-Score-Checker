"use client"

import { AlertTriangle, Target, X } from "lucide-react"
// Updated imports to use default exports
import ATSScoreCard from "./ats-score-card"
import MissingSkillsSection from "./missing-skills-section"
import WritingQualitySection from "./writing-quality-section"
import ProjectsAnalysisSection from "./projects-analysis-section"
import InterviewPrepSection from "./interview-prep-section"
import RecommendationsSection from "./recommendations-section"

interface AnalysisResultsDisplayProps {
  isLoading: boolean
  analysisResult: any
  handleStartOver: () => void
  activeSection: string | null
  toggleSection: (section: string) => void
}

export default function AnalysisResultsDisplay({
  // Changed to default export
  isLoading,
  analysisResult,
  handleStartOver,
  activeSection,
  toggleSection,
}: AnalysisResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Analyzing your resume...</h3>
        <p className="text-slate-600 text-center max-w-md">
          This usually takes 10-30 seconds. We're checking ATS compatibility, skills match, grammar, and more to provide
          comprehensive insights.
        </p>
      </div>
    )
  }

  if (analysisResult) {
    return (
      <div className="space-y-6">
        {analysisResult.error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-red-800 text-xl">Analysis Error</h3>
            </div>
            <p className="text-red-700 mt-3">{analysisResult.error}</p>
          </div>
        ) : (
          <>
            {analysisResult.ats_score && <ATSScoreCard atsScore={analysisResult.ats_score} />}
            {analysisResult.missing_skills && (
              <MissingSkillsSection
                skills={analysisResult.missing_skills}
                activeSection={activeSection}
                toggleSection={toggleSection}
              />
            )}
            {analysisResult.grammar_feedback && (
              <WritingQualitySection
                writing={analysisResult.grammar_feedback}
                activeSection={activeSection}
                toggleSection={toggleSection}
              />
            )}
            {analysisResult.projects_analysis && (
              <ProjectsAnalysisSection
                projects={analysisResult.projects_analysis}
                activeSection={activeSection}
                toggleSection={toggleSection}
              />
            )}
            {analysisResult.interview_preparation && (
              <InterviewPrepSection
                prep={analysisResult.interview_preparation}
                activeSection={activeSection}
                toggleSection={toggleSection}
              />
            )}
            {analysisResult.recommendations && (
              <RecommendationsSection
                recommendations={analysisResult.recommendations}
                activeSection={activeSection}
                toggleSection={toggleSection}
              />
            )}
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
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="bg-indigo-100 p-4 rounded-full mb-5">
        <Target className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Analyze Your Resume</h3>
      <p className="text-slate-600 text-base max-w-md">
        Upload your resume and paste the job description to get a comprehensive analysis with ATS scoring, skills
        matching, and personalized improvement suggestions.
      </p>
    </div>
  )
}
