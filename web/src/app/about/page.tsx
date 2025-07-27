"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  Brain,
  BarChart3,
  Sparkles,
  Shield,
  Lightbulb,
  Users,
  Zap,
  Award,
  FileText,
  Compass,
} from "lucide-react"

export default function AboutPage() {
  const sections = [
    { id: "overview", title: "Overview" },
    { id: "our-philosophy", title: "Our Philosophy" },
    { id: "ai-resume-analysis", title: "AI Resume Analysis" },
    { id: "ats-scoring", title: "ATS Scoring" },
    { id: "skill-gap-keyword-analysis", title: "Skill Gap & Keyword Analysis" },
    { id: "actionable-feedback", title: "Actionable Feedback" },
    { id: "instant-results", title: "Instant Results" },
    { id: "user-experience", title: "User Experience" },
    { id: "pro-features", title: "Pro Features" },
    { id: "team-trust", title: "Team & Trust" },
  ]

  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sectionRefs.current.map((ref) => {
        if (!ref) return Infinity
        const rect = ref.getBoundingClientRect()
        return rect.top >= 0 && rect.top < window.innerHeight
          ? Math.abs(rect.top)
          : Infinity
      })
      const minOffset = Math.min(...offsets)
      const idx = offsets.indexOf(minOffset)
      if (idx !== -1 && sections[idx] && sections[idx].id !== activeSection) {
        setActiveSection(sections[idx].id)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSection, sections])

  const FeatureItem = ({
    icon,
    title,
    description,
    children,
    id,
    isComingSoon = false,
  }: {
    icon: React.ReactNode
    title: string
    description: string
    children: React.ReactNode
    id: string
    isComingSoon?: boolean
  }) => (
    <section
      id={id}
      ref={(el) => {
        sectionRefs.current[sections.findIndex((s) => s.id === id)] = el
      }}
      className="mb-16 pb-8 border-b border-gray-200 last:border-b-0 last:pb-0"
    >
      <header className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
            {icon}
          </div>
          {title}
          {isComingSoon && (
            <span className="ml-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" /> Coming Soon
            </span>
          )}
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
      </header>
      <div className="max-w-none">
        <ul className="space-y-4 text-gray-700">
          {children}
        </ul>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          {/* Table of Contents */}
          <nav className="hidden lg:block sticky top-8 h-fit">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Table of Contents
              </h2>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block py-2 px-3 rounded-md text-sm transition-colors duration-150 ${
                        activeSection === section.id
                          ? "bg-blue-100 text-blue-900 font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="min-w-0">
            {/* Header */}
            <header className="mb-12 pb-8 border-b border-gray-200">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                About ResumeAI
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
                Advanced AI-powered resume optimization platform designed to help job seekers 
                navigate modern recruitment systems and stand out in competitive markets.
              </p>
            </header>

            {/* Overview Section */}
            <section
              id="overview"
              ref={(el) => {
                sectionRefs.current[
                  sections.findIndex((s) => s.id === "overview")
                ] = el
              }}
              className="mb-16 pb-8 border-b border-gray-200"
            >
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" /> 
                  Overview
                </h2>
              </header>
              <div className="text-lg text-gray-700 space-y-4 leading-relaxed max-w-none">
                <p>
                  ResumeAI leverages advanced artificial intelligence to analyze and optimize 
                  resumes for modern recruitment workflows. Our platform addresses the critical 
                  challenge of Applicant Tracking System (ATS) compatibility while providing 
                  actionable insights to improve your professional presentation.
                </p>
                <p>
                  Built for professionals at every career stage, ResumeAI transforms the complex 
                  process of resume optimization into a streamlined, data-driven experience that 
                  maximizes your chances of advancing through initial screening processes.
                </p>
              </div>
            </section>

            {/* Philosophy Section */}
            <section
              id="our-philosophy"
              ref={(el) => {
                sectionRefs.current[
                  sections.findIndex((s) => s.id === "our-philosophy")
                ] = el
              }}
              className="mb-16 pb-8 border-b border-gray-200"
            >
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <Compass className="w-8 h-8 text-blue-600" /> 
                  Our Philosophy
                </h2>
              </header>
              <div className="text-lg text-gray-700 max-w-none mb-6 leading-relaxed">
                <p>
                  Our approach is founded on three core principles that guide every aspect 
                  of our platform development and user experience design.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Intelligence Augmentation
                  </h3>
                  <p className="text-gray-700">
                    We enhance human decision-making with AI insights rather than replacing 
                    professional judgment. Our technology provides data-driven recommendations 
                    that inform strategic resume improvements.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Accessibility & Usability
                  </h3>
                  <p className="text-gray-700">
                    Complex AI analysis is translated into clear, actionable recommendations. 
                    Our interface prioritizes user experience without sacrificing analytical depth.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Continuous Evolution
                  </h3>
                  <p className="text-gray-700">
                    Our algorithms and features evolve with recruitment industry changes, 
                    ensuring users always have access to current best practices and optimization strategies.
                  </p>
                </div>
              </div>
            </section>

            {/* Feature Sections */}
            <FeatureItem
              id="ai-resume-analysis"
              icon={<Brain className="w-6 h-6 text-blue-600" />}
              title="AI Resume Analysis"
              description="Advanced natural language processing analyzes resume content against job requirements, providing comprehensive compatibility assessment and optimization recommendations."
            >
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Document Processing:</strong>
                <span>Secure upload and parsing of PDF and DOCX formats with extraction of skills, experience, education, and keyword data.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Contextual Analysis:</strong>
                <span>Advanced AI models (Google Gemini, OpenAI GPT) perform semantic comparison between resume content and job requirements.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Gap Identification:</strong>
                <span>Systematic identification of alignment strengths and strategic improvement opportunities based on target role requirements.</span>
              </li>
            </FeatureItem>

            <FeatureItem
              id="ats-scoring"
              icon={<Shield className="w-6 h-6 text-green-600" />}
              title="ATS Compatibility Scoring"
              description="Comprehensive evaluation of resume compatibility with Applicant Tracking Systems, addressing the critical first step in modern recruitment processes."
            >
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Compatibility Score:</strong>
                <span>Quantitative assessment (percentage-based) indicating likelihood of successful ATS parsing and keyword matching.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Technical Optimization:</strong>
                <span>Identification of formatting issues, keyword density problems, and structural elements that may impact ATS performance.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Best Practice Recommendations:</strong>
                <span>Specific guidance on resume structure, formatting, and content organization for optimal ATS readability.</span>
              </li>
            </FeatureItem>

            <FeatureItem
              id="skill-gap-keyword-analysis"
              icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
              title="Skills Gap & Keyword Analysis"
              description="Data-driven identification of missing competencies and strategic keyword optimization opportunities to enhance resume relevance and searchability."
            >
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Competency Mapping:</strong>
                <span>Systematic comparison of your skills profile against job requirements, highlighting gaps and alignment areas.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Strategic Integration:</strong>
                <span>Contextual recommendations for incorporating relevant keywords and technical terms naturally within existing content.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Industry Alignment:</strong>
                <span>Analysis of industry-specific terminology and professional language to ensure appropriate technical communication.</span>
              </li>
            </FeatureItem>

            <FeatureItem
              id="actionable-feedback"
              icon={<Lightbulb className="w-6 h-6 text-purple-600" />}
              title="Actionable Feedback System"
              description="Detailed, implementable recommendations that transform abstract optimization concepts into specific improvement actions."
            >
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Section-Specific Analysis:</strong>
                <span>Targeted feedback on professional summary, experience descriptions, technical skills, and educational background sections.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Impact Quantification:</strong>
                <span>Guidance on incorporating metrics and measurable achievements to demonstrate professional impact and results.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Content Enhancement:</strong>
                <span>Specific suggestions for improving clarity, professional language, and technical accuracy across all resume sections.</span>
              </li>
            </FeatureItem>

            <FeatureItem
              id="instant-results"
              icon={<Zap className="w-6 h-6 text-red-600" />}
              title="Real-Time Processing"
              description="Immediate analysis and feedback delivery enabling rapid iteration and optimization without workflow delays."
            >
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Processing Speed:</strong>
                <span>Analysis completion within seconds of document upload, enabling efficient optimization workflows.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Interactive Dashboard:</strong>
                <span>Comprehensive results presentation with visual indicators, progress metrics, and prioritized recommendation lists.</span>
              </li>
            </FeatureItem>

            <FeatureItem
              id="user-experience"
              icon={<Sparkles className="w-6 h-6 text-teal-600" />}
              title="Professional Interface Design"
              description="Enterprise-grade user experience design optimized for professional workflows and efficient task completion."
            >
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Cross-Platform Compatibility:</strong>
                <span>Responsive design ensuring consistent functionality across desktop, tablet, and mobile devices.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Streamlined Workflow:</strong>
                <span>Intuitive document upload process with clear progress indicators and guided optimization steps.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Professional Standards:</strong>
                <span>Interface design adhering to accessibility guidelines and professional software standards.</span>
              </li>
            </FeatureItem>

            <FeatureItem
              id="pro-features"
              icon={<Award className="w-6 h-6 text-indigo-600" />}
              title="Advanced Pro Features"
              description="Enhanced capabilities for power users requiring comprehensive analysis tools and advanced optimization features."
              isComingSoon={true}
            >
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">AI-Assisted Editing:</strong>
                <span>Direct content suggestions and automated improvements based on best practice analysis and industry standards.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Multi-Position Analysis:</strong>
                <span>Simultaneous evaluation against multiple job descriptions for professionals targeting diverse opportunities.</span>
              </li>
              <li className="flex flex-col space-y-2">
                <strong className="text-gray-900">Comprehensive Reporting:</strong>
                <span>Detailed PDF reports with analytical insights, performance metrics, and strategic recommendations for offline review.</span>
              </li>
            </FeatureItem>

            {/* Team & Trust Section */}
            <section
              id="team-trust"
              ref={(el) => {
                sectionRefs.current[
                  sections.findIndex((s) => s.id === "team-trust")
                ] = el
              }}
              className="mb-16 pb-8"
            >
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" /> 
                  Platform Reliability & Security
                </h2>
              </header>
              <div className="text-lg text-gray-700 space-y-4 leading-relaxed max-w-none">
                <p>
                  ResumeAI is developed by experienced software engineers specializing in 
                  artificial intelligence, natural language processing, and enterprise software 
                  development. Our team combines technical expertise with deep understanding 
                  of recruitment processes and career development strategies.
                </p>
                <p>
                  Our platform maintains enterprise-grade security standards for document 
                  processing and data handling. We are committed to user privacy, data 
                  protection, and providing reliable, consistent performance for professional 
                  use cases across diverse industries and career levels.
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-sm text-gray-600">Enterprise-grade data protection and secure document processing</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Reliability</h3>
                  <p className="text-sm text-gray-600">Consistent performance with 99.9% uptime and robust infrastructure</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-sm text-gray-600">Professional technical support and comprehensive documentation</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}