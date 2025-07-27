"use client"

import { motion } from "framer-motion"
import { FileText, Check } from "lucide-react" // Changed icons to FileText and Check

const Logo = () => (
  <motion.a
    href="/" // Link to home page
    className="flex items-center gap-2 cursor-pointer"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400 }}
  >
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl shadow-lg transform rotate-6"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl blur-sm opacity-50 transform rotate-6"></div>
      <FileText className="w-6 h-6 text-white relative z-10" /> {/* Main icon */}
      <Check className="w-4 h-4 text-white absolute -bottom-1 -right-1 z-10 bg-green-500 rounded-full p-0.5 border-2 border-white" />{" "}
      {/* Checkmark icon */}
    </div>
    <div>
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
        ResumeAI
      </h1>
      <p className="text-xs text-gray-500 -mt-1">Smart Optimization</p>
    </div>
  </motion.a>
)

export default Logo
