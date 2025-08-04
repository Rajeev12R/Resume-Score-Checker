"use client"

import { Code, CheckCircle, AlertTriangle, Zap, Sparkles, ChevronDown, ChevronUp } from "lucide-react"

interface ProjectsAnalysisSectionProps {
  projects: Record<string, any>[]
  activeSection: string | null
  toggleSection: (section: string) => void
}

export default function ProjectsAnalysisSection({
  projects,
  activeSection,
  toggleSection,
}: ProjectsAnalysisSectionProps) {
  // Changed to default export
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("projects")}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Code className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Projects Analysis {projects.length > 0 && <span className="text-emerald-600">({projects.length})</span>}
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
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-slate-900 text-xl">{project.project_name}</h4>
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
                          {project.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-slate-600 flex items-start gap-3">
                              <Sparkles className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.weaknesses && project.weaknesses.length > 0 && (
                      <div>
                        <h5 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" /> Areas for Improvement
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

                  {project.improvements && project.improvements.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h5 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Improvement Suggestions
                      </h5>
                      <ul className="space-y-2">
                        {project.improvements.map((suggestion: string, i: number) => (
                          <li key={i} className="text-slate-600 flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mt-0.5 flex-shrink-0">
                              {i + 1}
                            </span>
                            {suggestion}
                          </li>
                        ))}
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
                          {project.star_example.split("|").map((part: string, i: number) => (
                            <div key={i} className="text-center">
                              <div className="font-bold text-purple-700 mb-1">
                                {["Situation", "Task", "Action", "Result"][i]}
                              </div>
                              <p className="text-slate-700 text-sm">{part.trim()}</p>
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
}
