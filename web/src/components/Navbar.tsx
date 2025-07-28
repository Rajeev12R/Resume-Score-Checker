"use client"

import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/moving-border"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Logo from "./logo"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn } = useUser()

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {/* Home */}
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group px-1"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>

              {/* About Us */}
              <a
                href="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group px-1"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>

              {/* Analyze Resume */}
              {isSignedIn ? (
                <a
                  href="/resume-analysis"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group px-1"
                >
                  Analyze Resume
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/resume-analysis">
                  <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group px-1">
                    Analyze Resume
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </SignInButton>
              )}
            </nav>

            {/* Auth Buttons */}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/resume-analysis">
                <Button
                  className="bg-white/90 backdrop-blur-sm text-gray-900 border-gray-200 hover:bg-white hover:shadow-lg px-6 py-2"
                  containerClassName="h-auto"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
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
          <div className="md:hidden mt-4 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
            <nav className="flex flex-col gap-4">
              <a
                href="/"
                className="text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>

              <a
                href="/about"
                className="text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </a>

              {isSignedIn ? (
                <a
                  href="/resume-analysis"
                  className="text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analyze Resume
                </a>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/resume-analysis">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors text-lg"
                  >
                    Analyze Resume
                  </button>
                </SignInButton>
              )}

              <div className="pt-4 border-t border-gray-200">
                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <SignInButton mode="modal" forceRedirectUrl="/resume-analysis">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 w-full px-4 py-2 rounded-xl">
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
