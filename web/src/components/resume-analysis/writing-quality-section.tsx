

"use client"

import { PenTool, AlertCircle, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

interface WritingIssue {
  type: string
  context: string
  original: string
  suggestion: string
}

interface WritingQualitySectionProps {
  writing: Record<string, any>
  activeSection: string | null
  toggleSection: (section: string) => void
}

export default function WritingQualitySection({ writing, activeSection, toggleSection }: WritingQualitySectionProps) {
  // Changed to default export
  return (
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
            <h3 className="text-lg font-semibold text-gray-900">Writing Quality</h3>
            <p className="text-sm text-gray-500">Professionalism, clarity, and impact assessment</p>
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
                <div className="text-sm font-medium text-blue-600">Professionalism Score</div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                <div className="text-lg font-semibold text-gray-800 mb-1 leading-tight">
                  {writing.overall_quality_description?.split(".")[0] || "Good"}
                </div>
                <div className="text-sm font-medium text-gray-600">Overall Quality</div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-amber-700 mb-1">{writing.error_count || 0}</div>
                <div className="text-sm font-medium text-amber-600">Issues Found</div>
              </div>
            </div>

            {/* Issues Section */}
            {writing.issues && writing.issues.length > 0 ? (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <h4 className="text-lg font-semibold text-gray-900">Issues to Address</h4>
                </div>

                <div className="space-y-4">
                  {writing.issues.map((issue: WritingIssue, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <div className="p-4 bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 capitalize">
                            {issue.type}
                          </span>
                          <span className="text-sm text-gray-500">{issue.context}</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-2">ORIGINAL</div>
                          <div className="bg-red-50 border-l-4 border-red-200 p-3 rounded-r-lg">
                            <span className="text-sm text-red-800 font-mono">"{issue.original}"</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>

                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-2">SUGGESTED</div>
                          <div className="bg-green-50 border-l-4 border-green-200 p-3 rounded-r-lg">
                            <span className="text-sm text-green-800 font-mono">"{issue.suggestion}"</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-xl mb-8">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <p className="text-green-800 font-medium">Excellent! Your writing meets professional standards.</p>
              </div>
            )}

            {/* Analysis Section */}
            {writing.analysis && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Professional Writing Tips</h4>
                <div className="prose prose-sm prose-blue max-w-none">
                  <div className="text-blue-800 leading-relaxed whitespace-pre-line">{writing.analysis}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
