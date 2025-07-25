"use client"
import { useState, useEffect } from "react"
import { ArrowRight, Play, Star, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Mock BackgroundGradientAnimation component
const BackgroundGradientAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 animate-pulse"></div>
      {children}
    </div>
  );
};

// Mock Moving Border Button component
const Button = ({ 
  children, 
  className, 
  containerClassName, 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  containerClassName?: string;
  [key: string]: any;
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
  );
};

const Hero = () => {
  const [mounted, setMounted] = useState(false);
    const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
      <BackgroundGradientAnimation>
        <div className="relative z-10 min-h-screen flex flex-col">

          {/* Main Hero Section */}
          <div className="flex-1 px-6 py-8 md:py-16 flex items-center">
            <div className="max-w-7xl mx-auto w-full">
              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 md:mb-16">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 shadow-lg border border-white/20">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">50K+ Users</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 shadow-lg border border-white/20">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 shadow-lg border border-white/20">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">AI-Powered</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left side - Text content */}
                <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                        Optimize Your
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Resume with AI
                      </span>
                    </h1>
                  </div>

                  <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Get instant, professional feedback with our advanced AI system.
                    <span className="font-semibold text-gray-800"> Maximize your application success rate</span> in
                    minutes, not days.
                  </p>

                  <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white"
                        ></div>
                      ))}
                    </div>
                    <span className="text-xs md:text-sm">Trusted by 50,000+ professionals worldwide</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-2xl"
                      containerClassName="w-full sm:w-auto"
                      onClick={() => router.push("/resume-analysis")}
                    >
                      <span className="flex items-center gap-2">
                        Analyze Your Resume
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </span>
                    </Button>

                    <button className="group flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 text-gray-700 hover:text-gray-900 transition-colors">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 md:w-5 md:h-5 ml-1" />
                      </div>
                      <span className="font-medium text-sm md:text-base">Watch Demo</span>
                    </button>
                  </div>
                </div>

                {/* Right side - Enhanced Demo */}
                <div className="relative order-1 lg:order-2">
                  <div className="relative">
                    {/* Floating Elements */}
                    <div className="absolute -top-4 md:-top-8 -left-4 md:-left-8 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center animate-bounce">
                      <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>

                    <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-xl flex items-center justify-center animate-pulse">
                      <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>

                    {/* Main Demo Container */}
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 font-medium">AI Analysis</div>
                      </div>

                      {/* Resume Preview */}
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm md:text-xl">JD</span>
                          </div>
                          <div className="flex-1">
                            <div className="h-3 md:h-4 bg-gray-800 rounded-full mb-2 w-3/4"></div>
                            <div className="h-2 md:h-3 bg-gray-400 rounded-full w-1/2"></div>
                          </div>
                        </div>

                        {/* Skills Analysis */}
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="font-semibold text-gray-800 text-sm md:text-base">Skills Match Analysis</h3>

                          {[
                            { skill: "React.js", match: 95, color: "from-green-500 to-emerald-600" },
                            { skill: "TypeScript", match: 88, color: "from-blue-500 to-blue-600" },
                            { skill: "Node.js", match: 76, color: "from-yellow-500 to-orange-500" },
                            { skill: "Python", match: 45, color: "from-red-500 to-pink-500" },
                          ].map((item, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm font-medium text-gray-700">{item.skill}</span>
                                <span className="text-xs md:text-sm font-bold text-gray-900">{item.match}%</span>
                              </div>
                              <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                  style={{ width: `${item.match}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Score Badge */}
                        <div className="flex items-center justify-center">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-xl">
                            <div className="text-center">
                              <div className="text-xl md:text-3xl font-bold">85%</div>
                              <div className="text-xs md:text-sm opacity-90">Overall Match</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Score */}
                    <div className="absolute -bottom-3 md:-bottom-6 -right-3 md:-right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl md:rounded-2xl px-3 md:px-4 py-2 shadow-xl animate-pulse">
                      <div className="text-xs md:text-sm font-bold">+40% Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  )
}

export default Hero