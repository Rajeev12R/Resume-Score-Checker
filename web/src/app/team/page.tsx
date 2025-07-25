"use client"

import type React from "react"
import { Github, Linkedin, Instagram, Users, Lightbulb, Target, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface TeamMember {
  name: string
  role: string
  image: string
  bio: string
  social: {
    github: string
    linkedin: string
    instagram: string
  }
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

interface SocialIconProps {
  href: string
  Icon: React.ElementType
  bg: string
  hover: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => (
  <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
    <CardContent className="p-8 text-center">
      <div
        className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </CardContent>
  </Card>
)

const SocialIcon: React.FC<SocialIconProps> = ({ href, Icon, bg, hover }) => (
  <a
    href={href}
    className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${bg} ${hover} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="w-5 h-5" />
  </a>
)

const TeamPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Rajeev Ranjan",
      role: "Full Stack Web Developer",
      image: "/rajeev_ranjan.png",
      bio: "Crafting seamless web experiences using React, Node.js, and cloud platforms. Rajeev is driven by a passion for scalable architecture and clean code principles.",
      social: {
        github: "https://github.com/rajeev12r",
        linkedin: "https://linkedin.com/in/rajeev12r",
        instagram: "https://instagram.com/ranjan.rajeev12",
      },
    },
    {
      name: "Sai Prashant",
      role: "Full Stack Web Developer",
      image: "/sai_prashant.png",
      bio: "Merging design and logic, Sai builds user-centric applications with React, TypeScript, and modern frameworks. A firm believer in tech-driven solutions for real-world problems.",
      social: {
        github: "https://github.com/saiprashanth751",
        linkedin: "https://linkedin.com/in/sai-prashanth-029058220/",
        instagram: "https://instagram.com/sai.prashant",
      },
    },
  ]
    const router = useRouter()

  const achievements = [
    "AI-powered resume optimization",
    "ATS compatibility analysis",
    "Real-time feedback system",
    "Industry-specific templates",
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4 mr-2" />
            Trusted by 10,000+ job seekers
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            About Our
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Mission</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            We are a passionate team of developers committed to simplifying job applications with AI. Our goal is to
            help job seekers build standout resumes using automated tools that enhance formatting, grammar, and ATS
            compatibility.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-white text-sm font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How We Help You Succeed</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful AI-driven tools designed to elevate your job applications and help you stand out in today's
              competitive market
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="text-blue-600 w-8 h-8" />}
              title="Targeted Optimization"
              description="Align your resume with job descriptions using AI analysis to highlight your strengths and eliminate potential mismatches with precision."
              color="bg-blue-100"
            />
            <FeatureCard
              icon={<Lightbulb className="text-emerald-600 w-8 h-8" />}
              title="Instant AI Feedback"
              description="Receive comprehensive AI-driven feedback in seconds to enhance your resume's impact and improve your chances of landing interviews."
              color="bg-emerald-100"
            />
            <FeatureCard
              icon={<Users className="text-purple-600 w-8 h-8" />}
              title="Career Empowerment"
              description="Stand out to recruiters and hiring managers by presenting your most compelling professional self with data-driven insights."
              color="bg-purple-100"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet the Developers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Driven by purpose, built with precision. Get to know the passionate developers behind your career success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {teamMembers.map((member, idx) => (
              <Card
                key={idx}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover bg-white"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4 text-lg">{member.role}</p>
                    <p className="text-gray-700 leading-relaxed mb-8">{member.bio}</p>
                    <div className="flex justify-center space-x-4">
                      <SocialIcon
                        href={member.social.github}
                        Icon={Github}
                        bg="bg-gray-900"
                        hover="hover:bg-gray-700"
                      />
                      <SocialIcon
                        href={member.social.linkedin}
                        Icon={Linkedin}
                        bg="bg-blue-600"
                        hover="hover:bg-blue-700"
                      />
                      <SocialIcon
                        href={member.social.instagram}
                        Icon={Instagram}
                        bg="bg-gradient-to-r from-pink-500 to-purple-500"
                        hover="hover:from-pink-600 hover:to-purple-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Take the first step toward landing your dream job with AI-powered insights that matter. Join thousands of
            successful job seekers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
            onClick={() => router.push("/resume-analysis")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Start Analyzing Your Resume
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
            >
              View Sample Results
            </Button>
          </div>
          <div className="mt-8 flex justify-center items-center space-x-8 text-sm opacity-80">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free to start
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant results
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TeamPage
