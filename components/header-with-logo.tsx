"use client"

import { useState, useEffect } from "react"
import { Bot } from "lucide-react"
import SciFiText from "@/components/sci-fi-text"
import Solana3DLogo from "@/components/solana-3d-logo"
import WalletButton from "@/components/wallet-button"
import MobileMenu from "@/components/mobile-menu"

export default function HeaderWithLogo() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if we're scrolling up or down
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        if (currentScrollY > 100) {
          setVisible(false)
        }
      } else {
        // Scrolling up
        setVisible(true)
      }

      // Set background based on scroll position
      setScrolled(currentScrollY > 50)

      // Update last scroll position
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 bg-black/80 backdrop-blur-md shadow-lg" : "py-6 bg-transparent"
      } ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Mobile Menu (Left Side) */}
          <div className="md:hidden mr-2">
            <MobileMenu />
          </div>

          <div className="w-8 h-8">
            <Solana3DLogo height="32px" width="32px" scale={0.8} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-violet-400 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <SciFiText text="Mydian AI" className="font-bold text-lg" glowIntensity="high" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <a
            href="#demo"
            className="hover:text-purple-400 transition-colors relative group overflow-hidden cursor-pointer"
          >
            <span>Demo</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
          <a
            href="#features"
            className="hover:text-purple-400 transition-colors relative group overflow-hidden cursor-pointer"
          >
            <span>Features</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
          <a
            href="#airdrop"
            className="hover:text-purple-400 transition-colors relative group overflow-hidden cursor-pointer"
          >
            <span>Airdrop</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
          <a
            href="#roadmap"
            className="hover:text-purple-400 transition-colors relative group overflow-hidden cursor-pointer"
          >
            <span>Roadmap</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
        </nav>

        <div className="wallet-adapter-button-container">
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
