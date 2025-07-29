"use client"

import { AlertTriangle, CheckCircle, BookOpen, FileBadge, ChevronDown, ChevronUp } from "lucide-react"

interface MissingSkillsSectionProps {
  skills: any[]
  activeSection: string | null
  toggleSection: (section: string) => void
}

export default function MissingSkillsSection({ skills, activeSection, toggleSection }: MissingSkillsSectionProps) {
  // Changed to default export
  const renderPriorityBadge = (priority: string) => (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
        priority === "critical"
          ? "bg-red-100 text-red-700 border border-red-200"
          : priority === "important"
            ? "bg-amber-100 text-amber-700 border border-amber-200"
            : "bg-blue-100 text-blue-700 border border-blue-200"
      }`}
    >
      {priority} priority
    </span>
  )

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("skills")}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Missing Skills {skills.length > 0 && <span className="text-red-600">({skills.length})</span>}
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
              <p className="text-green-800 font-semibold">Great! No critical skills are missing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill: any, index: number) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 text-lg">{skill.skill}</h4>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {skill.type}
                      </span>
                      {renderPriorityBadge(skill.importance.toLowerCase())}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-3">{skill.suggestion}</p>

                  {skill.learning_resources && skill.learning_resources.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" /> Learning Resources
                      </h5>
                      <ul className="space-y-2 pl-5">
                        {skill.learning_resources.map((resource: string, i: number) => (
                          <li key={i} className="text-slate-700 list-disc">
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {skill.demonstration_strategy && (
                    <div className="mt-4">
                      <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <FileBadge className="w-4 h-4 text-green-500" /> How to Demonstrate
                      </h5>
                      <p className="text-slate-700">{skill.demonstration_strategy}</p>
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
