"use client"

import { ClipboardCheck, Code, Users, Briefcase, ChevronDown, ChevronUp } from "lucide-react"

interface InterviewPrepSectionProps {
  prep: Record<string, any>
  activeSection: string | null
  toggleSection: (section: string) => void
}

export default function InterviewPrepSection({ prep, activeSection, toggleSection }: InterviewPrepSectionProps) {
  // Changed to default export
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("interview")}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <ClipboardCheck className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Interview Preparation</h3>
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
                      <span className="text-xs font-bold text-purple-700">{i + 1}</span>
                    </div>
                    <p className="text-slate-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prep.behavioral_questions && prep.behavioral_questions.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" /> Behavioral Questions
              </h4>
              <div className="space-y-4">
                {prep.behavioral_questions.map((question: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1.5 w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700">{i + 1}</span>
                    </div>
                    <p className="text-slate-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prep.portfolio_suggestions && prep.portfolio_suggestions.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" /> Portfolio Suggestions
              </h4>
              <ul className="space-y-2">
                {prep.portfolio_suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="text-slate-700 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mt-0.5 flex-shrink-0">
                      {i + 1}
                    </span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
