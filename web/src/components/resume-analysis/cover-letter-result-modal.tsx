"use client"

import { useState } from "react"
import { 
  X, Mail, Copy, Download, Edit3, Info, Star, Target, 
  TrendingUp, CheckCircle, AlertCircle, Lightbulb, 
  RefreshCw, Eye, FileText, BarChart3
} from "lucide-react"

interface CoverLetterResultModalProps {
  showCoverLetterResult: boolean
  setShowCoverLetterResult: (show: boolean) => void
  coverLetterResult: {
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
    generation_metadata?: {
      model_version: string
      prompt_version: string
      temperature: number
      quality_score: number
    }
  }
  coverLetterData: {
    companyName: string
    roleTitle: string
    industry: string
    tone: string
    experienceLevel: string
    preferredLength: string
  }
  handleCopyCoverLetter: () => void
  handleDownloadCoverLetter: () => void
  setShowCoverLetterForm: (show: boolean) => void
}

export default function CoverLetterResultModal({
  showCoverLetterResult,
  setShowCoverLetterResult,
  coverLetterResult,
  coverLetterData,
  handleCopyCoverLetter,
  handleDownloadCoverLetter,
  setShowCoverLetterForm,
}: CoverLetterResultModalProps) {
  const [activeTab, setActiveTab] = useState<'letter' | 'analysis' | 'metrics'>('letter')

  if (!showCoverLetterResult || !coverLetterResult) return null

  const qualityMetrics = coverLetterResult.quality_metrics
  const effectivenessAnalysis = coverLetterResult.effectiveness_analysis
  const industryOptimization = coverLetterResult.industry_optimization
  const qualityScore = qualityMetrics?.overall_score || effectivenessAnalysis?.content_analysis?.skill_coverage || 85

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-200'
    if (score >= 75) return 'text-blue-600 bg-blue-100 border-blue-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    return 'text-red-600 bg-red-100 border-red-200'
  }

  const getQualityLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  const renderQualityMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className={`border rounded-xl p-4 ${getQualityColor(qualityScore)}`}>
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Overall Quality</p>
            <p className="text-xl font-bold">{Math.round(qualityScore)}/100</p>
          </div>
        </div>
        <p className="text-sm">{getQualityLabel(qualityScore)}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-slate-600">Word Count</p>
            <p className="text-xl font-bold text-slate-900">
              {effectivenessAnalysis?.readability_metrics?.word_count || 'N/A'}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600">
          {effectivenessAnalysis?.readability_metrics?.reading_level || 'Good length'}
        </p>
      </div>

      {/* <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-sm text-slate-600">Skills Coverage</p>
            <p className="text-xl font-bold text-slate-900">
              {effectivenessAnalysis?.content_analysis?.skill_coverage 
                ? `${Math.round(effectivenessAnalysis.content_analysis.skill_coverage)}%` 
                : 'N/A'}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600">JD requirements match</p>
      </div> */}

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-sm text-slate-600">Industry Alignment</p>
            <p className="text-xl font-bold text-slate-900">
              {industryOptimization?.industry ? '✓' : 'N/A'}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 capitalize">
          {industryOptimization?.industry || 'General'} optimized
        </p>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'letter':
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-sm">
                {coverLetterResult.cover_letter}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyCoverLetter}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </button>
              <button
                onClick={handleDownloadCoverLetter}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => {
                  setShowCoverLetterForm(true)
                  setShowCoverLetterResult(false)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit & Regenerate
              </button>
            </div>
          </div>
        )

      case 'analysis':
        return (
          <div className="space-y-6">
            {effectivenessAnalysis && (
              <>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Content Analysis
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-slate-800 mb-2">Skills Mentioned:</h5>
                      <div className="flex flex-wrap gap-2">
                        {effectivenessAnalysis.content_analysis.mentioned_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-slate-800 mb-2">Missing JD Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {effectivenessAnalysis.content_analysis.missing_jd_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Achievements Highlighted:</strong> {effectivenessAnalysis.content_analysis.quantified_achievements} quantified results
                    </p>
                  </div>
                </div>

                {effectivenessAnalysis.improvement_suggestions.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                      Improvement Suggestions
                    </h4>
                    <div className="space-y-2">
                      {effectivenessAnalysis.improvement_suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-700">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {industryOptimization && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-600" />
                  Industry Optimization Applied
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-indigo-800">
                      <strong>Industry:</strong> {industryOptimization.industry}
                    </p>
                    <p className="text-sm text-indigo-800">
                      <strong>Tone:</strong> {industryOptimization.tone_applied}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-800">
                      <strong>Length:</strong> {industryOptimization.length_category}
                    </p>
                    <p className="text-sm text-indigo-800">
                      <strong>Keywords Used:</strong> {industryOptimization.industry_keywords_used?.join(', ') || 'General'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'metrics':
        return (
          <div className="space-y-6">
            {qualityMetrics && (
              <>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Quality Breakdown
                  </h4>
                  
                  <div className="space-y-4">
                    {Object.entries(qualityMetrics.component_scores).map(([key, score]) => {
                      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-slate-900 min-w-[3rem]">{Math.round(score)}/100</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {qualityMetrics.issues.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Areas for Improvement
                    </h4>
                    <div className="space-y-2">
                      {qualityMetrics.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm text-slate-700">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`border rounded-xl p-6 ${getQualityColor(qualityScore)}`}>
                  <h4 className="font-semibold mb-2">Overall Recommendation</h4>
                  <p className="text-sm">{qualityMetrics.recommendation}</p>
                </div>
              </>
            )}

            {effectivenessAnalysis && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Readability Metrics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{effectivenessAnalysis.readability_metrics.word_count}</p>
                    <p className="text-sm text-slate-600">Words</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{effectivenessAnalysis.readability_metrics.paragraph_count}</p>
                    <p className="text-sm text-slate-600">Paragraphs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{effectivenessAnalysis.readability_metrics.avg_words_per_paragraph}</p>
                    <p className="text-sm text-slate-600">Avg Words/Para</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">{effectivenessAnalysis.readability_metrics.reading_level}</p>
                    <p className="text-sm text-slate-600">Reading Level</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-white/70 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Cover Letter Generated</h3>
                <p className="text-blue-100">
                  {coverLetterData.roleTitle} at {coverLetterData.companyName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCoverLetterResult(false)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {renderQualityMetrics()}

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 mb-6">
            {[
              { id: 'letter', label: 'Cover Letter', icon: Eye },
              { id: 'analysis', label: 'Analysis', icon: BarChart3 },
              { id: 'metrics', label: 'Quality Metrics', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}