"use client"

import {
  Lightbulb,
  BarChart2,
  Calendar,
  TrendingUp,
  ClipboardCheck,
  X,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface RecommendationsSectionProps {
  recommendations: Record<string, any>[]
  activeSection: string | null
  toggleSection: (section: string) => void
}

export default function RecommendationsSection({
  recommendations,
  activeSection,
  toggleSection,
}: RecommendationsSectionProps) {
  // Changed to default export
  return (
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
            <h3 className="text-xl font-bold text-slate-900">Strategic Recommendations</h3>
            <p className="text-sm text-slate-500 mt-1">Prioritized actions for maximum impact</p>
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
              <p className="text-sm text-slate-600 mt-2">Focus on high-impact items first to maximize your results</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <h4 className="font-bold text-emerald-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Implementation Plan
              </h4>
              <p className="text-sm text-slate-600 mt-2">Estimated timeline for completing all recommendations</p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <h4 className="font-bold text-amber-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Expected Impact
              </h4>
              <p className="text-sm text-slate-600 mt-2">Prioritize actions that will yield the greatest improvement</p>
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
                        <span className="font-bold text-indigo-700">{index + 1}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{rec.action}</h4>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          rec.impact === "High"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : rec.impact === "Medium"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        Impact: {rec.impact}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          rec.difficulty === "Easy"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : rec.difficulty === "Medium"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        Difficulty: {rec.difficulty}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          rec.timeline === "Immediate"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : rec.timeline === "1 Week"
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
                      <ClipboardCheck className="w-4 h-4 text-indigo-600" /> Implementation Steps
                    </h5>
                    <ol className="space-y-2 pl-5">
                      {rec.implementation_steps.map((step: string, i: number) => (
                        <li key={i} className="text-slate-700 list-decimal pl-2">
                          {step}
                        </li>
                      ))}
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
}
