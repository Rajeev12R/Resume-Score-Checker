"use client"

import type React from "react"

import { motion } from "framer-motion"

export const BackgroundGradientAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-50 animate-gradient"
        style={{ mixBlendMode: "overlay" }}
        animate={{
          x: ["-100%", "100%"],
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      {children}
    </div>
  )
}
