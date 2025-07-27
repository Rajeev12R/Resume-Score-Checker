"use client"

import { motion } from "framer-motion"
import { Check, Brain, BarChart3, Sparkles, Upload, Zap, Award } from "lucide-react"

const features = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Upload Resume & Job Description",
    description: "Submit your resume (PDF/DOCX) and job description effortlessly.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconShape: "rounded-xl",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Parse & Extract Data",
    description: "Advanced AI extraction of skills, experience, and keywords from your documents.",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    iconShape: "rounded-full",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Comparison",
    description: "Our intelligent AI model analyzes alignment and suggests precise improvements.",
    iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500",
    iconShape: "rounded-lg rotate-12",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Generate Scores & Feedback",
    description: "Receive detailed match scores (%), identify skill gaps, and get tailored suggestions.",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
    iconShape: "rounded-2xl",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Pro Features",
    description: "Unlock AI-generated edits, multi-JD testing, and comprehensive PDF reports.",
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
    iconShape: "rounded-xl rotate-6",
    comingSoon: true, // Added comingSoon flag
  },
]

export default function FeatureSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50/50 via-blue-50/30 to-purple-50/20 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center relative">
          {/* Vertical Divider - Made longer and more prominent */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2">
            <div className="h-full w-px bg-gradient-to-b from-blue-200 via-purple-300 to-pink-200 opacity-60"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
          </div>

          {/* Left Side - Enhanced Resume Visualization */}
          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl scale-110 animate-pulse-slow"></div>
              {/* Main Resume Stack */}
              <div className="relative">
                {/* Background Papers */}
                <motion.div
                  className="absolute top-2 left-2 w-80 h-96 bg-white/60 rounded-2xl shadow-lg"
                  animate={{ rotate: [2, -1, 2] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                ></motion.div>
                <motion.div
                  className="absolute top-1 left-1 w-80 h-96 bg-white/80 rounded-2xl shadow-lg"
                  animate={{ rotate: [1, 3, 1] }}
                  transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                ></motion.div>
                {/* Main Resume Document */}
                <motion.div
                  className="relative bg-white rounded-2xl shadow-2xl p-8 w-80 h-96 border border-gray-100 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, rotateY: 5, rotateZ: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Header with Profile */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-md"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-800 rounded-full mb-1"></div>
                        <div className="h-2 bg-gray-400 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  {/* Skills Section */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="h-2 bg-blue-500 rounded-full w-1/4"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="h-1 bg-blue-500 rounded-full w-3/4"></div>
                        </div>
                        <div className="h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="h-1 bg-green-500 rounded-full w-2/3"></div>
                        </div>
                        <div className="h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <div className="h-1 bg-purple-500 rounded-full w-4/5"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="h-2 bg-green-500 rounded-full w-1/3"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1.5 bg-gray-200 rounded-full"></div>
                        <div className="h-1.5 bg-gray-200 rounded-full w-5/6"></div>
                        <div className="h-1.5 bg-gray-200 rounded-full w-2/3"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="h-2 bg-purple-500 rounded-full w-1/4"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1.5 bg-gray-200 rounded-full w-4/5"></div>
                        <div className="h-1.5 bg-gray-200 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Floating AI Analysis Indicators */}
              <motion.div
                className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 shadow-2xl backdrop-blur-sm border border-white/20"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              {/* Score Badge with Animation */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl px-6 py-3 font-bold shadow-2xl backdrop-blur-sm border border-white/20"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 1, type: "spring", stiffness: 500 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-2xl">85%</div>
                <div className="text-xs opacity-90">Match Score</div>
              </motion.div>
              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${-10 + (i % 2) * 120}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Side - Modern Feature List */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                  How It Works
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our AI-powered system analyzes your resume with cutting-edge technology to give you the edge.
                </p>
              </motion.div>
            </div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <motion.div
                    className="flex items-start space-x-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-100 hover:shadow-md"
                    whileHover={{ x: 8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.div
                      className={`flex-shrink-0 w-14 h-14 ${feature.iconBg} ${feature.iconShape} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      whileHover={{ scale: 1.1, rotate: feature.iconShape.includes("rotate") ? 0 : 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-900 transition-colors">
                        {feature.title}
                        {feature.comingSoon && (
                          <span className="ml-3 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                            <Sparkles className="w-3 h-3 mr-1" /> Coming Soon
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                    <motion.div
                      className="flex-shrink-0"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-10 p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl border border-blue-100 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-xl text-gray-900">Unlock Your Full Potential</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our advanced AI features are designed to give you an unfair advantage in the job market. Get ready to
                stand out and land your dream job faster.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
