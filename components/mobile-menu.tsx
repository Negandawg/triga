"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Solana3DLogo from "@/components/solana-3d-logo"
import SciFiText from "@/components/sci-fi-text"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="md:hidden" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 text-white hover:text-purple-400 transition-colors relative overflow-hidden group cursor-pointer"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
        <span className="absolute inset-0 bg-purple-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
      </button>

      <div
        className={`fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Solana3DLogo height="40px" width="40px" scale={0.8} />
            </div>
            <SciFiText text="Mydian AI" className="text-xl" glowIntensity="medium" />
          </div>
          <button
            onClick={toggleMenu}
            className="p-2 text-white hover:text-purple-400 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-6 space-y-6">
          {[
            { href: "#demo", label: "Demo" },
            { href: "#features", label: "Features" },
            { href: "#airdrop", label: "Airdrop" },
            { href: "#technology", label: "Technology" },
            { href: "#roadmap", label: "Roadmap" },
            { href: "#faq", label: "FAQ" },
            { href: "#join", label: "Join Waitlist" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="relative group py-3 px-4 bg-black/80 rounded-lg border border-purple-500/20 transition-all duration-300 cursor-pointer"
              onClick={toggleMenu}
            >
              <span className="relative z-10 text-white group-hover:text-purple-400 transition-colors">
                {item.label}
              </span>

              {/* 3D Hover Effect */}
              <span className="absolute inset-0 bg-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>

              {/* Glow effect */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-md"></span>
            </a>
          ))}
        </nav>

        <div className="mt-auto p-6 border-t border-purple-500/20">
          <div className="flex justify-center">
            <Solana3DLogo height="80px" width="80px" />
          </div>
        </div>
      </div>
    </div>
  )
}
