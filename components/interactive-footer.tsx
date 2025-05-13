"use client"

import { useState } from "react"
import { Bot, ArrowRight, Twitter, Github, DiscIcon as Discord } from "lucide-react"
import SciFiText from "@/components/sci-fi-text"
import Image from "next/image"

export function InteractiveFooter() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [email, setEmail] = useState("")

  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "Technology", href: "#technology" },
    { label: "Airdrop", href: "#airdrop" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-purple-500/20 py-12 bg-black/60 backdrop-blur-md">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-black/40 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <div className="w-10 h-10">
                <Image
                  src="/images/mydian-logo.png"
                  alt="Mydian Logo"
                  width={40}
                  height={40}
                  className="w-full h-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-400 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">
                  <SciFiText text="Mydian AI" glowIntensity="medium" />
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              The first AI assistant built specifically for the Solana blockchain ecosystem. Empowering developers,
              traders, and enthusiasts with intelligent insights.
            </p>

            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/40 transition-colors"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/40 transition-colors"
              >
                <Discord className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/40 transition-colors"
              >
                <Github className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <h3 className="font-bold mb-6 text-center md:text-left">
              <SciFiText text="Quick Links" glowIntensity="medium" />
            </h3>
            <ul className="space-y-1">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group flex items-center py-2 px-4 rounded-lg transition-all duration-300 hover:bg-purple-500/10"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="w-0 group-hover:w-2 h-2 rounded-full bg-purple-500 transition-all duration-300 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100"></div>
                    <span className="text-gray-400 group-hover:text-white transition-colors">{link.label}</span>
                    <ArrowRight
                      className={`ml-auto w-0 h-4 text-purple-400 opacity-0 transition-all duration-300 ${
                        hoveredIndex === index ? "w-4 opacity-100" : ""
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-auto">
            <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 max-w-xs">
              <h3 className="font-bold mb-3 text-center">
                <SciFiText text="Stay Updated" glowIntensity="medium" />
              </h3>
              <p className="text-gray-400 text-sm mb-4 text-center">
                Subscribe to our newsletter for the latest updates on Mydian AI and exclusive airdrop opportunities.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/60 border border-purple-500/30 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-purple-500"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">© 2023 Mydian AI. All rights reserved.</div>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Add default export that points to the named export
export default InteractiveFooter
