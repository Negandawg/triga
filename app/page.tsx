"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import ClientOnly from "@/components/client-only"
import WalletButton from "@/components/wallet-button"

// Create a simple loading component
const LoadingPlaceholder = () => <div className="min-h-screen bg-black"></div>

// Dynamically import components with loading placeholders
const MatrixRain = dynamic(() => import("@/components/matrix-rain"), {
  ssr: false,
  loading: () => <div className="fixed top-0 left-0 w-full h-full z-0 bg-black"></div>,
})

const AIDemo = dynamic(() => import("@/components/ai-demo"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-black/60 rounded-xl"></div>,
})

const Header = dynamic(() => import("@/components/header"), {
  ssr: false,
  loading: () => <div className="h-20 bg-black/80"></div>,
})

const PartnersSection = dynamic(() => import("@/components/partners-section"), { ssr: false })
const TechnologySection = dynamic(() => import("@/components/technology-section"), { ssr: false })
const InteractiveFAQ = dynamic(() => import("@/components/interactive-faq"), { ssr: false })
const InteractiveRoadmap = dynamic(() => import("@/components/interactive-roadmap"), { ssr: false })
const AirdropSection = dynamic(() => import("@/components/airdrop-section"), { ssr: false })
const InteractiveFooter = dynamic(() => import("@/components/interactive-footer"), { ssr: false })
const SmoothScrollInit = dynamic(() => import("@/components/smooth-scroll-init"), { ssr: false })
const FeaturesSection = dynamic(() => import("@/components/features-section"), { ssr: false })
const HeroSection = dynamic(() => import("@/components/hero-section"), { ssr: false })

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <LoadingPlaceholder />
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Initialize smooth scrolling */}
      <ClientOnly>
        <SmoothScrollInit />
      </ClientOnly>

      {/* Matrix Rain Background */}
      <ClientOnly>
        <MatrixRain />
      </ClientOnly>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        {/* Header */}
        <ClientOnly fallback={<div className="h-20 bg-black/80"></div>}>
          <Header />
        </ClientOnly>

        {/* Hero Section */}
        <ClientOnly>
          <HeroSection />
        </ClientOnly>

        {/* Demo Section */}
        <section id="demo">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">See Mydian AI in Action</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Experience the power of our AI assistant with these interactive demos. Mydian AI can analyze
                transactions, provide market insights, and help you understand smart contracts with natural language.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <ClientOnly fallback={<div className="w-full h-[400px] bg-black/60 rounded-xl"></div>}>
                <AIDemo />
              </ClientOnly>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                Our AI assistant is trained on millions of Solana transactions, smart contracts, and market data points
                to provide accurate, contextual responses to your queries.
              </p>
              <a href="#airdrop" className="of-button inline-block">
                Check Airdrop Eligibility
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <ClientOnly>
          <FeaturesSection />
        </ClientOnly>

        {/* Airdrop Section */}
        <ClientOnly>
          <AirdropSection />
        </ClientOnly>

        {/* Technology Section */}
        <ClientOnly>
          <TechnologySection />
        </ClientOnly>

        {/* Partners Section */}
        <ClientOnly>
          <PartnersSection />
        </ClientOnly>

        {/* Roadmap Section */}
        <section id="roadmap">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">Development Roadmap</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our strategic plan for bringing Mydian AI to the Solana ecosystem and beyond. We're committed to
                building a powerful, user-friendly AI assistant for blockchain users.
              </p>
            </div>

            <ClientOnly>
              <InteractiveRoadmap />
            </ClientOnly>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">Frequently Asked Questions</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Get answers to common questions about Mydian AI, our technology, and how to get involved.
              </p>
            </div>

            <ClientOnly>
              <InteractiveFAQ />
            </ClientOnly>
          </div>
        </section>

        {/* Join Waitlist Section */}
        <section id="join">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto of-card p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(153,69,255,0.2),transparent_30%)] z-0"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(20,241,149,0.2),transparent_30%)] z-0"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center gradient-text">
                  Join the Mydian AI Waitlist
                </h2>

                <p className="text-gray-300 text-center mb-8">
                  Connect your Solana wallet to join our exclusive waitlist and qualify for the upcoming airdrop. Early
                  adopters will receive priority access and special benefits.
                </p>

                <div className="flex justify-center">
                  <WalletButton className="of-button">Join the Waitlist</WalletButton>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[
                    { label: "On Waitlist", value: "6,200+" },
                    { label: "Launch Date", value: "Q2 2026" },
                    { label: "Airdrop Value", value: "50000 MYDN" },
                    { label: "Supported Chains", value: "Solana" },
                  ].map((stat, index) => (
                    <div key={index} className="of-card p-3">
                      <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <ClientOnly>
          <InteractiveFooter />
        </ClientOnly>
      </div>
    </div>
  )
}
