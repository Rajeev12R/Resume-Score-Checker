"use client"

import type React from "react"
import { useUser, useClerk, useAuth } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import {
  ArrowRight,
  Play,
  Star,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

// Mock BackgroundGradientAnimation component
const BackgroundGradientAnimation = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]" />
      {children}
    </div>
  )
}

// Enhanced Button component
const Button = ({
  children,
  className,
  containerClassName,
  ...props
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  [key: string]: any
}) => {
  return (
    <div className={cn("relative", containerClassName)}>
      <button
        className={cn(
          "relative px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  )
}

// Enhanced MacBook Component with realistic 3D perspective and video
const MacBookDemo = () => {
  // Placeholder YouTube video ID - replace with your actual demo video ID
  const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ" // Example: Rick Astley - Never Gonna Give You Up
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&modestbranding=1&showinfo=0&rel=0`

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Enhanced Floating elements around MacBook */}
      <motion.div
        className="absolute -top-12 -left-12 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center z-10"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Zap className="w-10 h-10 text-white" />
      </motion.div>

      <motion.div
        className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-xl flex items-center justify-center z-10"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Award className="w-8 h-8 text-white" />
      </motion.div>

      <motion.div
        className="absolute -bottom-8 -right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl px-6 py-3 shadow-xl z-10"
        animate={{
          y: [0, -8, 0],
          x: [0, 3, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <div className="text-lg font-bold">98%</div>
          <div className="text-xs opacity-90">Success Rate</div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/4 -left-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl px-4 py-2 shadow-xl z-10"
        animate={{
          x: [0, -5, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 2.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-bold">+250%</span>
        </div>
      </motion.div>

      {/* Enhanced MacBook Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 60, rotateX: 25 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ perspective: "1200px" }}
      >
        {/* MacBook Base/Keyboard with enhanced realism */}
        <motion.div
          className="relative"
          animate={{
            rotateX: [0, 1.5, 0],
            rotateY: [0, 0.8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Enhanced Keyboard Base */}
          <div
            className="w-full h-12 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-b-3xl shadow-2xl border border-gray-300"
            style={{
              transform: "rotateX(75deg) translateZ(-6px)",
              transformOrigin: "bottom",
            }}
          >
            {/* Realistic Keyboard Keys */}
            <div className="grid grid-cols-15 gap-1 p-3 h-full">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-sm shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  style={{ height: "4px", minWidth: "4px" }}
                />
              ))}
            </div>
            {/* Trackpad */}
            <div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gray-100 rounded-lg border border-gray-200 shadow-inner"
              style={{ transform: "translateZ(2px)" }}
            />
          </div>

          {/* Enhanced Screen */}
          <motion.div
            className="relative bg-gray-900 rounded-t-3xl shadow-2xl overflow-hidden border-2 border-gray-800"
            style={{
              aspectRatio: "16/10",
              transform: "rotateX(-8deg)",
              transformOrigin: "bottom",
            }}
            whileHover={{ rotateX: -5 }}
            transition={{ duration: 0.4 }}
          >
            {/* Screen Bezel with Apple-like design */}
            <div className="absolute inset-0 bg-black rounded-t-3xl p-6">
              {/* Camera and sensors */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              </div>

              {/* Screen Content with YouTube Video */}
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative shadow-inner">
                <iframe
                  src={youtubeEmbedUrl}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title="ResumeAI Demo Video"
                ></iframe>
              </div>
            </div>

            {/* Enhanced Screen Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-t-3xl pointer-events-none"></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

const Hero = () => {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const { user } = useUser()
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleProtectedClick = async () => {
    if (isSignedIn) {
      router.push("/resume-analysis")
    } else {
      openSignIn()
    }
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundGradientAnimation>
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Main Hero Section */}
          <div className="flex-1 px-6 py-8 md:py-16 flex items-center">
            <div className="max-w-7xl mx-auto w-full">
              {/* Enhanced Stats Bar with impactful numbers */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 md:mb-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {[
                  {
                    icon: Users,
                    text: "25K+ Resumes Analyzed",
                    color: "text-blue-600",
                    bg: "from-blue-50 to-blue-100",
                  },
                  {
                    icon: Star,
                    text: "4.8/5 User Rating",
                    color: "text-yellow-500",
                    bg: "from-yellow-50 to-yellow-100",
                  },
                  {
                    icon: TrendingUp,
                    text: "3x More Interviews",
                    color: "text-green-600",
                    bg: "from-green-50 to-green-100",
                  },
                  {
                    icon: Shield,
                    text: "ATS Optimized",
                    color: "text-purple-600",
                    bg: "from-purple-50 to-purple-100",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-2 bg-gradient-to-r ${item.bg} backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm font-semibold text-gray-700">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left side - Enhanced Text content */}
                <motion.div
                  className="space-y-8 text-center lg:text-left order-2 lg:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div>
                    <motion.h1
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                        Transform Your
                      </span>
                      <br />
                      <motion.span
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        Career with AI
                      </motion.span>
                    </motion.h1>
                  </div>

                  <motion.p
                    className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Get instant, AI-powered resume analysis that identifies
                    gaps, optimizes keywords, and{" "}
                    <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      triples your interview chances
                    </span>{" "}
                    in minutes.
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-center lg:justify-start gap-3 text-sm text-gray-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="flex -space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.img
                          key={i}
                          src={`https://picsum.photos/seed/${i + 100}/200/200`} // Using Picsum for avatars
                          alt={`User ${i + 1}`}
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-3 border-white shadow-lg object-cover"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">
                        25,000+ professionals
                      </div>
                      <div className="text-sm text-gray-500">
                        already transformed their careers
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25"
                      containerClassName="w-full sm:w-auto"
                      onClick={handleProtectedClick}
                    >
                      <motion.span
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        Analyze My Resume Free
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </Button>

                    <motion.button
                      className="group flex items-center gap-3 px-6 py-4 text-gray-700 hover:text-gray-900 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-white/30 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Play className="w-5 h-5 ml-1" />
                      </motion.div>
                      <span className="font-semibold">Watch 2-min Demo</span>
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Right side - Enhanced MacBook Demo */}
                <motion.div
                  className="relative order-1 lg:order-2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                >
                  <MacBookDemo />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  )
}

export default Hero
