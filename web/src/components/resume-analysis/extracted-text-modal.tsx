"use client"

import { X } from "lucide-react"

interface ExtractedTextModalProps {
  showExtractedText: boolean
  setShowExtractedText: (show: boolean) => void
  extractedText: any
}

export default function ExtractedTextModal({
  showExtractedText,
  setShowExtractedText,
  extractedText,
}: ExtractedTextModalProps) {
  // Changed to default export
  if (!showExtractedText) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => setShowExtractedText(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label="Close extracted text view"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-3">Extracted Resume Text</h3>
        {extractedText.error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700">{extractedText.error}</p>
          </div>
        ) : (
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap font-mono">
            {extractedText.extracted_text}
          </pre>
        )}
      </div>
    </div>
  )
}
