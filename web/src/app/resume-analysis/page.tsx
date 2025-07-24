"use client"

import { motion } from "framer-motion"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { AuroraBackground } from "@/components/ui/aurora-background"
import {
  FiUpload,
  FiFileText,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi"
import axios from "axios"

interface AnalysisResult {
  role: string
  analysis: {
    missing_sections: string[]
    missing_skills: string[]
    impact_statements: string[]
    project_relevance: { project: string; relevant: boolean }[]
  }
  resume_sections: Record<string, any>
  jd_sections: Record<string, any>
}

const Page = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdText, setJdText] = useState<string>("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pythonUrl =
    process.env.NEXT_PUBLIC_PYTHON_URL || "http://127.0.0.1:8000"

  const onDropResume = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0])
      setAnalysis(null)
      setError(null)
    }
  }, [])

  const {
    getRootProps: getResumeRootProps,
    getInputProps: getResumeInputProps,
    isDragActive: isResumeDragActive,
  } = useDropzone({
    onDrop: onDropResume,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
  })

  const removeResume = () => {
    setResumeFile(null)
    setAnalysis(null)
    setError(null)
  }

  const analyze = async () => {
    if (!resumeFile || !jdText.trim()) return
    setIsAnalyzing(true)
    setAnalysis(null)
    setError(null)
    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("jd_text", jdText)
    console.log("Sending analyze request", { resumeFile, jdText, pythonUrl })
    try {
      const response = await axios.post(`${pythonUrl}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setAnalysis(response.data)
    } catch (err) {
      setError("Error analyzing files. Please try again.")
      console.error("Error in analyze request:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full text-gray-900"
      >
        <div className="text-3xl md:text-5xl font-bold text-center">
          Resume & JD Analyzer
        </div>
        <div className="font-extralight text-base md:text-xl text-center">
          Upload your resume and job description to get a deep, role-based
          analysis.
        </div>
        {/* Resume Dropzone */}
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Resume (PDF, DOC, DOCX)
          </label>
          <div
            {...getResumeRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors bg-transparent ${
              isResumeDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getResumeInputProps()} />
            {resumeFile ? (
              <div className="flex items-center justify-center gap-2 p-2">
                <FiFileText className="text-xl" />
                <span className="truncate max-w-xs">{resumeFile.name}</span>
                <button
                  type="button"
                  onClick={removeResume}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <FiUpload className="mx-auto text-2xl text-gray-400" />
                <p className="text-sm text-gray-500">
                  {isResumeDragActive
                    ? "Drop your resume here"
                    : "Drag & drop your resume here, or click to select"}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* JD Textarea */}
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description (Paste Text)
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 resize-none"
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={10}
          />
        </div>
        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-lg disabled:opacity-50"
            disabled={!resumeFile || !jdText.trim() || isAnalyzing}
            onClick={analyze}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        {/* Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-8 space-y-8"
          >
            <div className="text-2xl font-bold text-center mb-4">
              Analysis Results
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Role */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 to-blue-300 shadow flex flex-col items-center">
                <div className="text-lg font-semibold mb-2">
                  Identified Role
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {analysis.role}
                </div>
              </div>
              {/* Missing Sections */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-red-100 to-yellow-100 shadow">
                <div className="text-lg font-semibold mb-2">
                  Missing Sections
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis.missing_sections.length === 0 ? (
                    <span className="text-green-700 flex items-center gap-1">
                      <FiCheckCircle />
                      All sections present
                    </span>
                  ) : (
                    analysis.analysis.missing_sections.map(
                      (section: string) => (
                        <span
                          key={section}
                          className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                          <FiAlertCircle />
                          {section}
                        </span>
                      )
                    )
                  )}
                </div>
              </div>
              {/* Missing Skills */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-100 to-green-100 shadow">
                <div className="text-lg font-semibold mb-2">Missing Skills</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis.missing_skills.length === 0 ? (
                    <span className="text-green-700 flex items-center gap-1">
                      <FiCheckCircle />
                      All skills present
                    </span>
                  ) : (
                    analysis.analysis.missing_skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                      >
                        <FiAlertCircle />
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Impact Statements */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 shadow">
                <div className="text-lg font-semibold mb-2">
                  Impact Statements
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.analysis.impact_statements.length === 0 ? (
                    <li className="text-gray-500">
                      No strong impact statements detected.
                    </li>
                  ) : (
                    analysis.analysis.impact_statements.map(
                      (stmt: string, idx: number) => (
                        <li key={idx} className="text-green-700">
                          {stmt}
                        </li>
                      )
                    )
                  )}
                </ul>
              </div>
              {/* Project Relevance */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 shadow">
                <div className="text-lg font-semibold mb-2">
                  Project Relevance
                </div>
                <ul className="space-y-1">
                  {analysis.analysis.project_relevance.length === 0 ? (
                    <li className="text-gray-500">No projects found.</li>
                  ) : (
                    analysis.analysis.project_relevance.map(
                      (
                        proj: { project: string; relevant: boolean },
                        idx: number
                      ) => (
                        <li
                          key={idx}
                          className={`flex items-center gap-2 ${
                            proj.relevant ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {proj.relevant ? (
                            <FiCheckCircle />
                          ) : (
                            <FiAlertCircle />
                          )}
                          {proj.project}
                        </li>
                      )
                    )
                  )}
                </ul>
              </div>
            </div>
            {/* Expandable Resume & JD Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gray-50 shadow">
                <div className="font-semibold mb-2">Resume Sections</div>
                <div className="space-y-2">
                  {Object.entries(analysis.resume_sections).map(
                    ([section, content]) => (
                      <details key={section} className="bg-white rounded p-2">
                        <summary className="cursor-pointer font-semibold capitalize">
                          {section.replace(/_/g, " ")}
                        </summary>
                        <pre className="whitespace-pre-wrap text-xs mt-2">
                          {typeof content === "string"
                            ? content
                            : JSON.stringify(content, null, 2)}
                        </pre>
                      </details>
                    )
                  )}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 shadow">
                <div className="font-semibold mb-2">JD Sections</div>
                <div className="space-y-2">
                  {Object.entries(analysis.jd_sections).map(
                    ([section, content]) => (
                      <details key={section} className="bg-white rounded p-2">
                        <summary className="cursor-pointer font-semibold capitalize">
                          {section.replace(/_/g, " ")}
                        </summary>
                        <pre className="whitespace-pre-wrap text-xs mt-2">
                          {typeof content === "string"
                            ? content
                            : JSON.stringify(content, null, 2)}
                        </pre>
                      </details>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AuroraBackground>
  )
}

export default Page
