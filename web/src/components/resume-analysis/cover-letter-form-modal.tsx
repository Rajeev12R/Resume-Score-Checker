//web\src\components\resume-analysis\cover-letter-form-modal.tsx
// ---upadte---


"use client"

import { useState } from "react"
import { X, Mail, Sparkles, Building2, User, Target, Palette, Clock, Lightbulb, Search } from "lucide-react"

interface CoverLetterData {
  companyName: string
  roleTitle: string
  industry: string
  companyValues: string
  personalTouch: string
  tone: string
  experienceLevel: string
  coverLetterType: string
  keyAchievements: string
  preferredLength: string
}

interface CoverLetterFormModalProps {
  showCoverLetterForm: boolean
  setShowCoverLetterForm: (show: boolean) => void
  coverLetterData: CoverLetterData
  setCoverLetterData: React.Dispatch<React.SetStateAction<CoverLetterData>> | ((data: Record<string, any>) => void)
  handleGenerateCoverLetter: () => void
  isGeneratingCoverLetter: boolean
}

export default function CoverLetterFormModal({
  showCoverLetterForm,
  setShowCoverLetterForm,
  coverLetterData,
  setCoverLetterData,
  handleGenerateCoverLetter,
  isGeneratingCoverLetter,
}: CoverLetterFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isResearchingCompany, setIsResearchingCompany] = useState(false)
  const [companyInsights, setCompanyInsights] = useState<any>(null)

  if (!showCoverLetterForm) return null

  const industries = [
    "Technology", "Finance", "Healthcare", "Marketing", "Consulting", 
    "Education", "Manufacturing", "Retail", "Government", "Non-profit", "Other"
  ]

  const toneOptions = [
    { value: "professional", label: "Professional", description: "Formal, business-appropriate" },
    { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and passionate" },
    { value: "creative", label: "Creative", description: "Unique voice, engaging" }
  ]

  const experienceLevels = [
    { value: "entry", label: "Entry Level", description: "0-2 years experience" },
    { value: "mid-level", label: "Mid Level", description: "3-7 years experience" },
    { value: "senior", label: "Senior Level", description: "8+ years experience" },
    { value: "executive", label: "Executive", description: "Leadership/C-level" }
  ]

  const coverLetterTypes = [
    { value: "application", label: "Job Application", description: "Standard application letter" },
    { value: "networking", label: "Networking", description: "Reaching out for opportunities" },
    { value: "referral", label: "Referral", description: "Following up on a referral" }
  ]

  const lengthOptions = [
    { value: "short", label: "Concise", description: "2-3 paragraphs, ~200 words" },
    { value: "medium", label: "Balanced", description: "3-4 paragraphs, ~300 words" },
    { value: "long", label: "Detailed", description: "4-5 paragraphs, ~400 words" }
  ]

  const handleCompanyResearch = async () => {
    if (!coverLetterData.companyName) return
    
    setIsResearchingCompany(true)
    try {
      const response = await fetch(
        `https://resume-score-checker.onrender.com/company-research/?company_name=${encodeURIComponent(coverLetterData.companyName)}&industry=${encodeURIComponent(coverLetterData.industry)}`
      )
      if (response.ok) {
        const data = await response.json()
        setCompanyInsights(data)
      }
    } catch (error) {
      console.error("Company research failed:", error)
    } finally {
      setIsResearchingCompany(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setCoverLetterData({
      ...coverLetterData,
      [field]: value
    })
  }

  const isStep1Valid = coverLetterData.companyName && coverLetterData.roleTitle && coverLetterData.industry
  const isStep2Valid = coverLetterData.tone && coverLetterData.experienceLevel && coverLetterData.preferredLength

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span className="text-blue-700 font-medium">Basic Information</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Let's get the essentials</h3>
        <p className="text-slate-600">Tell us about the position and company you're targeting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Company Name *
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
              placeholder="e.g., Google, Microsoft, Startup Inc."
              value={coverLetterData.companyName}
              onChange={(e) => updateFormData("companyName", e.target.value)}
            />
            <button
              type="button"
              onClick={handleCompanyResearch}
              disabled={!coverLetterData.companyName || isResearchingCompany}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 disabled:opacity-50"
              title="Research company"
            >
              {isResearchingCompany ? (
                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
          {companyInsights && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Company Values:</strong> {companyInsights.company_info.values.join(", ")}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Role Title *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Senior Software Engineer"
            value={coverLetterData.roleTitle}
            onChange={(e) => updateFormData("roleTitle", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-slate-700">
          Industry *
        </label>
        <select
          className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={coverLetterData.industry}
          onChange={(e) => updateFormData("industry", e.target.value)}
        >
          <option value="">Select an industry</option>
          {industries.map((industry) => (
            <option key={industry} value={industry.toLowerCase()}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-slate-700">
          Company Values/Culture (Optional)
        </label>
        <textarea
          className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
          placeholder="What do you know about their values, culture, or recent achievements?"
          value={coverLetterData.companyValues}
          onChange={(e) => updateFormData("companyValues", e.target.value)}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-4">
          <Palette className="w-5 h-5 text-purple-600" />
          <span className="text-purple-700 font-medium">Personalization</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Customize your approach</h3>
        <p className="text-slate-600">Tailor the tone and style to match your goals</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3 text-slate-700">
          Tone & Style *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {toneOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                coverLetterData.tone === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="tone"
                value={option.value}
                checked={coverLetterData.tone === option.value}
                onChange={(e) => updateFormData("tone", e.target.value)}
                className="sr-only"
              />
              <span className="font-medium text-slate-900">{option.label}</span>
              <span className="text-sm text-slate-600 mt-1">{option.description}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3 text-slate-700">
          Experience Level *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {experienceLevels.map((level) => (
            <label
              key={level.value}
              className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                coverLetterData.experienceLevel === level.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="experienceLevel"
                value={level.value}
                checked={coverLetterData.experienceLevel === level.value}
                onChange={(e) => updateFormData("experienceLevel", e.target.value)}
                className="sr-only"
              />
              <span className="font-medium text-slate-900">{level.label}</span>
              <span className="text-sm text-slate-600 mt-1">{level.description}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3 text-slate-700">
          Cover Letter Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {coverLetterTypes.map((type) => (
            <label
              key={type.value}
              className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                coverLetterData.coverLetterType === type.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="coverLetterType"
                value={type.value}
                checked={coverLetterData.coverLetterType === type.value}
                onChange={(e) => updateFormData("coverLetterType", e.target.value)}
                className="sr-only"
              />
              <span className="font-medium text-slate-900">{type.label}</span>
              <span className="text-sm text-slate-600 mt-1">{type.description}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3 text-slate-700">
          Preferred Length *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lengthOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                coverLetterData.preferredLength === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="preferredLength"
                value={option.value}
                checked={coverLetterData.preferredLength === option.value}
                onChange={(e) => updateFormData("preferredLength", e.target.value)}
                className="sr-only"
              />
              <span className="font-medium text-slate-900">{option.label}</span>
              <span className="text-sm text-slate-600 mt-1">{option.description}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-4">
          <Target className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">Final Touches</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Add personal elements</h3>
        <p className="text-slate-600">Highlight key achievements and add personal connections</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-slate-700">
          Key Achievements to Highlight (Optional)
        </label>
        <textarea
          className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
          placeholder="Specific achievements, metrics, or accomplishments you want to emphasize..."
          value={coverLetterData.keyAchievements}
          onChange={(e) => updateFormData("keyAchievements", e.target.value)}
        />
        <p className="text-xs text-slate-500 mt-1">
          Example: "Increased sales by 30%, Led team of 15 engineers, Reduced costs by $200K"
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-slate-700">
          Personal Touch (Optional)
        </label>
        <textarea
          className="w-full border border-slate-300 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
          placeholder="Personal connection to the company, specific motivation, or unique angle..."
          value={coverLetterData.personalTouch}
          onChange={(e) => updateFormData("personalTouch", e.target.value)}
        />
        <p className="text-xs text-slate-500 mt-1">
          Example: "I've been following your company's sustainability initiatives..." or "As a long-time user of your product..."
        </p>
      </div>

      {companyInsights && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Company Research Insights</h4>
              <div className="space-y-2 text-sm text-blue-800">
                {companyInsights.personalization_tips.map((tip: string, index: number) => (
                  <p key={index}>• {tip}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderProgressBar = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= step
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-20 h-1 mx-2 ${
                currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-white/70 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Create Cover Letter</h3>
                <p className="text-blue-100">Step {currentStep} of 3</p>
              </div>
            </div>
            <button
              onClick={() => setShowCoverLetterForm(false)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {renderProgressBar()}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={!isStep1Valid || !isStep2Valid || isGeneratingCoverLetter}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 flex items-center gap-3"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}