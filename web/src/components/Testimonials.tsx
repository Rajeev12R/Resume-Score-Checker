"use client"

import { motion } from "framer-motion"
import { Star, Quote, MapPin, Briefcase, GraduationCap, TrendingUp } from "lucide-react"
import { useState } from "react"

const testimonials = [
  {
    id: 1,
    name: "Arjun Sharma",
    role: "Final Year Student",
    company: "IIT Delhi",
    location: "New Delhi, India",
    avatar: "https://picsum.photos/seed/arjun/200/200",
    quote:
      "As a final year CS student, I was worried about my resume. This AI tool helped me identify missing technical skills and improved my project descriptions. Got placed at Microsoft with a 28 LPA package!",
    rating: 5,
    category: "student",
    achievement: "28 LPA Package",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Software Engineer",
    company: "Infosys",
    location: "Bangalore, India",
    avatar: "https://picsum.photos/seed/priya/200/200",
    quote:
      "After 2 years at Infosys, I wanted to switch to a product company. The AI analysis showed exactly what skills I needed to highlight. Now I'm at Flipkart with 40% salary hike!",
    rating: 5,
    category: "professional",
    achievement: "40% Salary Hike",
  },
  {
    id: 3,
    name: "Rahul Gupta",
    role: "Data Science Student",
    company: "BITS Pilani",
    location: "Pilani, India",
    avatar: "https://picsum.photos/seed/rahul/200/200",
    quote:
      "The skill gap analysis was incredible! It told me exactly which Python libraries and ML frameworks to add. Landed internships at both Google and Amazon for summer 2024.",
    rating: 5,
    category: "student",
    achievement: "Google & Amazon Internships",
  },
  {
    id: 4,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Google",
    location: "Mountain View, USA",
    avatar: "https://picsum.photos/seed/sarah/200/200",
    quote:
      "This AI resume checker helped me transition from engineering to product management. The insights were incredibly detailed and showed me how to reframe my technical experience.",
    rating: 5,
    category: "professional",
    achievement: "Career Transition",
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Fresh Graduate",
    company: "NIT Trichy",
    location: "Chennai, India",
    avatar: "https://picsum.photos/seed/vikram/200/200",
    quote:
      "Coming from a tier-2 college, I thought I had no chance at top companies. This tool helped me optimize my resume and I got offers from 5 companies including Zomato and Paytm!",
    rating: 5,
    category: "student",
    achievement: "5 Job Offers",
  },
  {
    id: 6,
    name: "Ananya Krishnan",
    role: "Frontend Developer",
    company: "Razorpay",
    location: "Bangalore, India",
    avatar: "https://picsum.photos/seed/ananya/200/200",
    quote:
      "The ATS optimization feature is brilliant! My resume was getting rejected everywhere. After using this tool, my interview call rate increased by 300%. Now working at my dream fintech company.",
    rating: 5,
    category: "professional",
    achievement: "300% More Interviews",
  },
  {
    id: 7,
    name: "Marcus Johnson",
    role: "MBA Student",
    company: "IIM Ahmedabad",
    location: "Ahmedabad, India",
    avatar: "https://picsum.photos/seed/marcus/200/200",
    quote:
      "Preparing for consulting interviews, I needed my resume to stand out. The AI suggestions helped me quantify my achievements better. Secured offers from McKinsey and BCG!",
    rating: 5,
    category: "student",
    achievement: "McKinsey & BCG Offers",
  },
  {
    id: 8,
    name: "Sneha Reddy",
    role: "DevOps Engineer",
    company: "Swiggy",
    location: "Hyderabad, India",
    avatar: "https://picsum.photos/seed/sneha/200/200",
    quote:
      "I was stuck in my career for 3 years. This tool showed me exactly which cloud certifications and tools to highlight. Got promoted to Senior DevOps Engineer with 50% raise!",
    rating: 5,
    category: "professional",
    achievement: "50% Salary Raise",
  },
  {
    id: 9,
    name: "Karthik Menon",
    role: "Computer Science Student",
    company: "VIT Vellore",
    location: "Vellore, India",
    avatar: "https://picsum.photos/seed/karthik/200/200",
    quote:
      "The AI identified that my resume lacked open-source contributions. I started contributing to GitHub projects and got selected for Google Summer of Code 2024!",
    rating: 5,
    category: "student",
    achievement: "Google Summer of Code",
  },
  {
    id: 10,
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Netflix",
    location: "Los Angeles, USA",
    avatar: "https://picsum.photos/seed/emily/200/200",
    quote:
      "The portfolio analysis feature helped me understand which projects to showcase. The AI recommendations were like having a senior designer mentor me through my career transition.",
    rating: 5,
    category: "professional",
    achievement: "Career Transition",
  },
  {
    id: 11,
    name: "Aditya Kumar",
    role: "Mechanical Engineering Student",
    company: "IIT Bombay",
    location: "Mumbai, India",
    avatar: "https://picsum.photos/seed/aditya/200/200",
    quote:
      "Even as a non-CS student, I wanted to break into tech. The AI helped me highlight my programming projects and technical skills. Got placed at Tesla as a Software Engineer!",
    rating: 5,
    category: "student",
    achievement: "Tesla Placement",
  },
  {
    id: 12,
    name: "Riya Jain",
    role: "Business Analyst",
    company: "Flipkart",
    location: "Bangalore, India",
    avatar: "https://picsum.photos/seed/riya/200/200",
    quote:
      "The keyword optimization was game-changing. My resume started getting noticed by recruiters immediately. Within 2 months, I had offers from 3 unicorn startups!",
    rating: 5,
    category: "professional",
    achievement: "3 Unicorn Offers",
  },
  {
    id: 13,
    name: "Harsh Agarwal",
    role: "Electronics Student",
    company: "DTU Delhi",
    location: "New Delhi, India",
    avatar: "https://picsum.photos/seed/harsh/200/200",
    quote:
      "I was struggling to get internships in my third year. This AI tool helped me restructure my resume to highlight relevant coursework and projects. Got summer internship at Samsung R&D!",
    rating: 5,
    category: "student",
    achievement: "Samsung R&D Internship",
  },
  {
    id: 14,
    name: "Meera Nair",
    role: "Data Scientist",
    company: "Ola",
    location: "Bangalore, India",
    avatar: "https://picsum.photos/seed/meera/200/200",
    quote:
      "The AI analysis revealed gaps in my machine learning portfolio. I added the suggested projects and certifications. Got headhunted by 3 companies and chose Ola with 60% hike!",
    rating: 5,
    category: "professional",
    achievement: "60% Salary Hike",
  },
  {
    id: 15,
    name: "David Kim",
    role: "Startup Founder",
    company: "Ex-Goldman Sachs",
    location: "Seoul, South Korea",
    avatar: "https://picsum.photos/seed/david/200/200",
    quote:
      "Even as a founder, I needed to update my resume for advisor positions. The AI helped me articulate my entrepreneurial journey and achievements in a compelling way.",
    rating: 5,
    category: "professional",
    achievement: "Multiple Advisor Roles",
  },
  {
    id: 16,
    name: "Ishita Sharma",
    role: "MBA Aspirant",
    company: "Deloitte",
    location: "Mumbai, India",
    avatar: "https://picsum.photos/seed/ishita/200/200",
    quote:
      "Preparing for MBA applications, I needed my consulting experience to shine. The AI helped me quantify my impact and structure my achievements. Got admits from 4 top B-schools!",
    rating: 5,
    category: "student",
    achievement: "4 B-School Admits",
  },
  {
    id: 17,
    name: "Alex Rivera",
    role: "Cloud Architect",
    company: "AWS",
    location: "Seattle, USA",
    avatar: "https://picsum.photos/seed/alex/200/200",
    quote:
      "The technical skills analysis was spot-on. It identified emerging cloud technologies I should learn and helped me position my experience better. Promoted to Principal Architect!",
    rating: 5,
    category: "professional",
    achievement: "Principal Architect Promotion",
  },
  {
    id: 18,
    name: "Tanvi Gupta",
    role: "Design Student",
    company: "NIFT Delhi",
    location: "New Delhi, India",
    avatar: "https://picsum.photos/seed/tanvi/200/200",
    quote:
      "As a design student, I wasn't sure how to present my creative work professionally. The AI helped me create a resume that got me internships at both Zomato and Swiggy design teams!",
    rating: 5,
    category: "student",
    achievement: "Top Design Internships",
  },
]

// Split testimonials into 3 columns with better distribution
const column1 = testimonials.slice(0, 6)
const column2 = testimonials.slice(6, 12)
const column3 = testimonials.slice(12, 18)

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "student":
        return <GraduationCap className="w-4 h-4 text-blue-500" />
      case "professional":
        return <Briefcase className="w-4 h-4 text-green-500" />
      default:
        return <TrendingUp className="w-4 h-4 text-purple-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "student":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "professional":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-purple-50 text-purple-700 border-purple-200"
    }
  }

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 mb-6 group relative overflow-hidden"
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Category Badge */}
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getCategoryColor(testimonial.category)}`}
      >
        {getCategoryIcon(testimonial.category)}
        {testimonial.category === "student" ? "Student" : "Professional"}
      </div>

      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-10 h-10 text-blue-500/60 group-hover:text-blue-600/80 transition-colors duration-300" />
      </div>

      {/* Quote Text */}
      <p className="text-gray-700 leading-relaxed mb-6 group-hover:text-gray-800 transition-colors duration-300 relative z-10">
        "{testimonial.quote}"
      </p>

      {/* Achievement Badge */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-200/50">
          <TrendingUp className="w-3 h-3" />
          {testimonial.achievement}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </motion.div>
        ))}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative">
          <img
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 text-lg">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
          <p className="text-sm text-blue-600 font-semibold">{testimonial.company}</p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{testimonial.location}</span>
          </div>
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

const StatsCard = ({
  icon: Icon,
  number,
  label,
  color,
}: { icon: any; number: string; label: string; color: string }) => (
  <motion.div
    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center"
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{number}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </motion.div>
)

export default function AdvancedTestimonialSection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-gray-50/50 via-blue-50/30 to-purple-50/20 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-green-200/50 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4 fill-current" />
            50,000+ Success Stories
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8 leading-tight">
            Loved by Students &<br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Professionals Worldwide
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            From IIT students to Silicon Valley professionals, discover how our AI-powered resume analysis has
            transformed careers across the globe.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StatsCard
              icon={GraduationCap}
              number="25K+"
              label="Students Placed"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <StatsCard
              icon={Briefcase}
              number="15K+"
              label="Career Switches"
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <StatsCard
              icon={TrendingUp}
              number="300%"
              label="Avg. Interview Increase"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <StatsCard
              icon={Star}
              number="4.9/5"
              label="User Rating"
              color="bg-gradient-to-r from-yellow-500 to-orange-500"
            />
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[800px] relative">
          {/* Column 1 - Scrolls Up */}
          <ScrollingColumn testimonials={column1} direction="up" duration={30} className="h-full" />

          {/* Column 2 - Scrolls Down */}
          <ScrollingColumn testimonials={column2} direction="down" duration={35} className="h-full" />

          {/* Column 3 - Scrolls Up */}
          <ScrollingColumn testimonials={column3} direction="up" duration={40} className="h-full" />

          {/* Enhanced Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50/50 via-gray-50/30 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-50/20 via-gray-50/30 to-transparent pointer-events-none z-20" />
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-6 bg-white/90 backdrop-blur-sm rounded-3xl px-10 py-6 shadow-2xl border border-white/30">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 6).map((testimonial, index) => (
                <motion.img
                  key={testimonial.id}
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-lg font-bold text-gray-900 ml-2">4.9/5</span>
              </div>
              <p className="text-gray-600 font-medium">From 50,000+ satisfied users worldwide</p>
              <p className="text-sm text-gray-500">Including students from IITs, NITs, and top universities</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
