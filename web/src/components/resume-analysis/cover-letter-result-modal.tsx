"use client"

import { X, Mail, Copy, Download, Edit3, Info } from "lucide-react"

interface CoverLetterResultModalProps {
  showCoverLetterResult: boolean
  setShowCoverLetterResult: (show: boolean) => void
  coverLetter: string
  coverLetterData: {
    companyName: string
    roleTitle: string
    personalTouch: string
  }
  handleCopyCoverLetter: () => void
  handleDownloadCoverLetter: () => void
  setShowCoverLetterForm: (show: boolean) => void
}

export default function CoverLetterResultModal({
  // Changed to default export
  showCoverLetterResult,
  setShowCoverLetterResult,
  coverLetter,
  coverLetterData,
  handleCopyCoverLetter,
  handleDownloadCoverLetter,
  setShowCoverLetterForm,
}: CoverLetterResultModalProps) {
  if (!showCoverLetterResult) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Generated Cover Letter</h3>
                <p className="text-blue-100">
                  {coverLetterData.roleTitle} at {coverLetterData.companyName}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCoverLetterResult(false)
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-wrap gap-3">
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
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit & Regenerate
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">{coverLetter}</pre>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Pro Tips for Your Cover Letter</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Review and personalize the content before sending</li>
                  <li>• Ensure all company and role details are accurate</li>
                  <li>• Add specific examples that weren't captured from your resume</li>
                  <li>• Keep it concise and focused on value you bring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
