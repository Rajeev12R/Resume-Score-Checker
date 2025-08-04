import { Sparkles, Layout, Type, Target, CheckCircle, AlertTriangle } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ATSScoreCardProps {
  atsScore: Record<string, any>
}

export default function ATSScoreCard({ atsScore }: ATSScoreCardProps) {
  // Changed to default export
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

  return (
    <div className={`bg-white border rounded-xl p-6 shadow-sm ${getScoreBg(atsScore.overall)}`}>
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
          <div className={`text-5xl font-bold ${getScoreColor(atsScore.overall)}`}>
            {atsScore.overall}
            <span className="text-2xl text-slate-500">/100</span>
          </div>
          <div className="w-3/5">
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  atsScore.overall >= 80 ? "bg-green-500" : atsScore.overall >= 60 ? "bg-amber-500" : "bg-red-500"
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
              <p className="text-slate-600 text-sm font-medium">Keyword Match</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">{atsScore.breakdown?.keyword_match || "N/A"} / 100</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Layout className="w-4 h-4 text-amber-500" />
              <p className="text-slate-600 text-sm font-medium">Structure</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">{atsScore.breakdown?.structure || "N/A"} / 100</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-green-500" />
              <p className="text-slate-600 text-sm font-medium">Readability</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">{atsScore.breakdown?.readability || "N/A"} / 100</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Analysis</h4>
          <div className="prose prose-slate text-base leading-7 max-w-full space-y-4">
            <ReactMarkdown>{atsScore.explanation || ""}</ReactMarkdown>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atsScore.matched_keywords && atsScore.matched_keywords.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Matched Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {atsScore.matched_keywords.map((keyword: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {atsScore.missing_keywords && atsScore.missing_keywords.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {atsScore.missing_keywords.map((keyword: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
