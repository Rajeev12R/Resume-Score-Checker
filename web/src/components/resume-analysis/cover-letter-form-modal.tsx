"use client"

import { X, Mail, Sparkles } from "lucide-react"

interface CoverLetterFormModalProps {
  showCoverLetterForm: boolean
  setShowCoverLetterForm: (show: boolean) => void
  coverLetterData: {
    companyName: string
    roleTitle: string
    personalTouch: string
  }
  setCoverLetterData: (data: {
    companyName: string
    roleTitle: string
    personalTouch: string
  }) => void
  handleGenerateCoverLetter: () => void
  isGeneratingCoverLetter: boolean
}

export default function CoverLetterFormModal({
  // Changed to default export
  showCoverLetterForm,
  setShowCoverLetterForm,
  coverLetterData,
  setCoverLetterData,
  handleGenerateCoverLetter,
  isGeneratingCoverLetter,
}: CoverLetterFormModalProps) {
  if (!showCoverLetterForm) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Generate Cover Letter
            </h3>
          </div>
          <button
            onClick={() => setShowCoverLetterForm(false)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Company Name *
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Google, Microsoft, Startup Inc."
              value={coverLetterData.companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCoverLetterData({
                  ...coverLetterData,
                  companyName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Role Title *
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Senior Software Engineer, Product Manager"
              value={coverLetterData.roleTitle}
              onChange={(e) =>
                setCoverLetterData({
                  ...coverLetterData,
                  roleTitle: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Personal Touch (Optional)
            </label>
            <textarea
              className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Any specific details about the company, personal connection, or motivation you'd like to include..."
              value={coverLetterData.personalTouch}
              onChange={(e) =>
                setCoverLetterData({
                  ...coverLetterData,
                  personalTouch: e.target.value,
                })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGenerateCoverLetter}
              disabled={
                !coverLetterData.companyName ||
                !coverLetterData.roleTitle ||
                isGeneratingCoverLetter
              }
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              {isGeneratingCoverLetter ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Cover Letter
                </>
              )}
            </button>
            <button
              onClick={() => setShowCoverLetterForm(false)}
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
