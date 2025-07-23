"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useState } from "react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar: "/placeholder.svg?height=60&width=60",
    quote:
      "This AI resume checker helped me land my dream job at Google. The insights were incredibly detailed and actionable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Microsoft",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "The skill gap analysis was spot-on. I improved my resume and got 3x more interview calls within a week.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Netflix",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "Amazing tool! The AI suggestions helped me highlight my achievements better. Highly recommend to everyone.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Frontend Developer",
    company: "Airbnb",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "I was struggling with my resume for months. This tool gave me the clarity I needed in just minutes.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "UX Designer",
    company: "Spotify",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "The match score feature is brilliant. It helped me tailor my resume for each application perfectly.",
    rating: 5,
  },
  {
    id: 6,
    name: "Alex Rivera",
    role: "DevOps Engineer",
    company: "Tesla",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "Incredible accuracy in identifying missing keywords. My application success rate doubled immediately.",
    rating: 5,
  },
  {
    id: 7,
    name: "Jessica Wang",
    role: "Marketing Manager",
    company: "Adobe",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "The AI recommendations were like having a personal career coach. Absolutely game-changing tool.",
    rating: 5,
  },
  {
    id: 8,
    name: "Ryan O'Connor",
    role: "Full Stack Developer",
    company: "Stripe",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "Simple, effective, and incredibly insightful. This tool should be mandatory for all job seekers.",
    rating: 5,
  },
  {
    id: 9,
    name: "Priya Patel",
    role: "Business Analyst",
    company: "Amazon",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "The detailed feedback helped me understand exactly what recruiters were looking for. Fantastic tool!",
    rating: 5,
  },
  {
    id: 10,
    name: "Michael Brown",
    role: "Cloud Architect",
    company: "AWS",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "Professional, accurate, and incredibly helpful. This AI tool revolutionized my job search process.",
    rating: 5,
  },
  {
    id: 11,
    name: "Anna Kowalski",
    role: "Cybersecurity Specialist",
    company: "Meta",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "The insights were so precise that I felt like the AI understood my career better than I did.",
    rating: 5,
  },
  {
    id: 12,
    name: "James Wilson",
    role: "Machine Learning Engineer",
    company: "OpenAI",
    avatar: "/placeholder.svg?height=60&width=60",
    quote: "Outstanding tool that provides actionable feedback. It's like having an expert resume reviewer 24/7.",
    rating: 5,
  },
]

// Split testimonials into 3 columns
const column1 = testimonials.slice(0, 4)
const column2 = testimonials.slice(4, 8)
const column3 = testimonials.slice(8, 12)

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 mb-6 group"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-blue-500 opacity-60" />
      </div>

      {/* Quote Text */}
      <p className="text-gray-700 leading-relaxed mb-6 group-hover:text-gray-800 transition-colors">
        "{testimonial.quote}"
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <img
          src={testimonial.avatar || "/placeholder.svg"}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
        />
        <div>
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-500">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const ScrollingColumn = ({
  testimonials,
  direction = "up",
  duration = 20,
  className = "",
}: {
  testimonials: typeof column1
  direction?: "up" | "down"
  duration?: number
  className?: string
}) => {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex flex-col"
        animate={
          isPaused
            ? {}
            : {
                y: direction === "up" ? [0, -100 * testimonials.length] : [0, 100 * testimonials.length],
              }
        }
        transition={{
          duration: duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {/* First set */}
        {testimonials.map((testimonial) => (
          <TestimonialCard key={`first-${testimonial.id}`} testimonial={testimonial} />
        ))}
        {/* Duplicate set for seamless loop */}
        {testimonials.map((testimonial) => (
          <TestimonialCard key={`second-${testimonial.id}`} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  )
}

export default function TestimonialSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
            Loved by Professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have transformed their careers with our AI-powered resume analysis.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px] relative">
          {/* Column 1 - Scrolls Up */}
          <ScrollingColumn testimonials={column1} direction="up" duration={25} className="h-full" />

          {/* Column 2 - Scrolls Down */}
          <ScrollingColumn testimonials={column2} direction="down" duration={30} className="h-full" />

          {/* Column 3 - Scrolls Up */}
          <ScrollingColumn testimonials={column3} direction="up" duration={35} className="h-full" />

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-white/20">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 5).map((testimonial, index) => (
                <img
                  key={testimonial.id}
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm font-semibold text-gray-900 ml-2">4.9/5</span>
              </div>
              <p className="text-sm text-gray-600">From 50,000+ satisfied users</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
