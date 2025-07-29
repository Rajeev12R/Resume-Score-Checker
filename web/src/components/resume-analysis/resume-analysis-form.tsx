// web\src\components\resume-analysis\resume-analysis-form.tsx

"use client"
import { useDropzone } from "react-dropzone"
import { X, Mail, Upload, FileText, Zap, BookOpen, ClipboardEdit } from "lucide-react"

interface ResumeAnalysisFormProps {
  resumeFile: File | null
  setResumeFile: (file: File | null) => void
  jdText: string
  setJdText: (text: string) => void
  isLoading: boolean
  handleAnalyze: () => void
  handleExtractText: () => void
  handleRemoveFile: () => void
  setShowCoverLetterForm: (show: boolean) => void
  onDrop: (acceptedFiles: File[]) => void
}

export default function ResumeAnalysisForm({
  // Changed to default export
  resumeFile,
  setResumeFile,
  jdText,
  setJdText,
  isLoading,
  handleAnalyze,
  handleExtractText,
  handleRemoveFile,
  setShowCoverLetterForm,
  onDrop,
}: ResumeAnalysisFormProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    multiple: false,
  })

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sticky top-8">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardEdit className="w-6 h-6 text-indigo-600" />
        <h2 className="font-bold text-2xl text-slate-900">Resume Analysis</h2>
      </div>

      {/* Resume Upload */}
      <div className="mb-6">
        <label htmlFor="resume-upload" className="block text-sm font-semibold mb-3 text-slate-700">
          Resume (PDF/DOCX)
        </label>
        <div
          {...getRootProps()}
          id="resume-upload"
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ease-in-out ${
            isDragActive
              ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
              : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
          }`}
        >
          <input {...getInputProps()} />
          {resumeFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="font-semibold text-slate-900 truncate max-w-[160px]">{resumeFile.name}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile()
                }}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
                aria-label="Remove resume file"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            <div>
              <div className="p-4 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="font-semibold text-slate-900 mb-2">Drop your resume here or click to upload</p>
              <p className="text-sm text-slate-500">PDF, DOC, DOCX (max 10MB)</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div className="mb-6">
        <label htmlFor="jd-text" className="block text-sm font-semibold mb-3 text-slate-700">
          Job Description
        </label>
        <textarea
          id="jd-text"
          className="w-full border border-slate-300 rounded-xl p-4 min-h-[180px] text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-slate-900 placeholder:text-slate-400 shadow-sm"
          placeholder="Paste the job description you're applying for here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          aria-label="Job Description Textarea"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAnalyze}
          disabled={!resumeFile || !jdText || isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center gap-3 text-lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Analyze Resume
            </>
          )}
        </button>
        {/* Cover Letter Button */}
        <button
          onClick={() => setShowCoverLetterForm(true)}
          disabled={!resumeFile || !jdText || isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-3"
        >
          <Mail className="w-5 h-5" />
          Generate Cover Letter
        </button>

        {resumeFile && (
          <button
            onClick={handleExtractText}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base"
          >
            <BookOpen className="w-4 h-4" />
            View Extracted Text
          </button>
        )}
      </div>
    </div>
  )
}
