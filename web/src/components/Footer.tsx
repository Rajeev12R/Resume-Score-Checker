"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com",
      hoverColor: "hover:text-gray-900",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com",
      hoverColor: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com",
      hoverColor: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com",
      hoverColor: "hover:text-blue-600",
    },
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Left side - Copyright */}
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl shadow-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl blur-sm opacity-50"></div>
              </div>
              <span className="font-bold text-gray-900">ResumeAI</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-sm">© 2025 ResumeAI. All rights reserved.</span>
          </div>

          {/* Right side - Links and Social */}
          <div className="flex items-center gap-6">
            {/* Team Link */}
            <motion.a
              href="/team"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Team
            </motion.a>

            <span className="text-gray-400">|</span>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-500 ${social.hoverColor} transition-colors p-2 rounded-lg hover:bg-gray-50`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
