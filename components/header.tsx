"use client"

import { useState, useEffect } from "react"
import { Bot } from "lucide-react"
import WalletButton from "@/components/wallet-button"
import MobileMenu from "@/components/mobile-menu"
import Image from "next/image"

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "floating-navbar py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Image src="/images/mydian-logo.png" alt="Mydian Logo" width={32} height={32} className="mr-2" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-orbitron font-bold text-lg gradient-text">Mydian AI</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {["Demo", "Features", "Airdrop", "Technology", "Partners", "Roadmap"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 hover:text-white transition-colors relative group overflow-hidden cursor-pointer"
            >
              <span>{item}</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <WalletButton />
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

// Add default export that points to the named export
export default Header
