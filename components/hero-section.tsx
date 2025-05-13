"use client"

import { ArrowRight } from "lucide-react"
import WalletButton from "@/components/wallet-button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(153,69,255,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <div className="max-w-xl mx-auto md:mx-0 md:ml-20">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center md:text-left">
                <span className="gradient-text">The First AI Assistant</span>
                <br />
                Built for Solana
              </h1>

              <p className="text-xl text-gray-300 mb-8 text-center md:text-left">
                Revolutionizing how you interact with the Solana blockchain. Analyze smart contracts, get real-time
                market insights, and simplify blockchain complexity through artificial intelligence.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <WalletButton className="of-button">Join Airdrop Waitlist</WalletButton>

                <a href="#demo" className="of-button-outline inline-flex items-center">
                  See Demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>

              <div className="mt-8 text-sm text-gray-400 text-center md:text-left">
                Join 3,000+ others on the waitlist. Connect for airdrop eligibility.
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="relative w-[350px] h-[350px] group">
              <Image
                src="/images/solana-sol-logo.png"
                alt="Solana Logo"
                width={350}
                height={350}
                className="transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Add default export that points to the named export
export default HeroSection
