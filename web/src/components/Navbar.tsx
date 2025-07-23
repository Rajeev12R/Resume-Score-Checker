"use client"
import { Button } from "./ui/moving-border"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-20 w-full"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl shadow-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-2xl blur-sm opacity-50"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                ResumeAI
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Score Checker</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {["Features", "How it Works", "Pricing", "About"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
            </nav>

            <Button
              className="bg-white/90 backdrop-blur-sm text-gray-900 border-gray-200 hover:bg-white hover:shadow-lg px-6 py-2"
              containerClassName="h-auto"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
          >
            <nav className="flex flex-col gap-4">
              {["Features", "How it Works", "Pricing", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 w-full"
                  containerClassName="w-full"
                >
                  Sign In
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
