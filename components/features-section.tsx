"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowRight, Bot, Cpu, Zap } from "lucide-react"
import GlitchText from "@/components/glitch-text"
import FeatureDetailModal from "@/components/feature-detail-modal"

const FEATURES = [
  {
    icon: <Bot className="w-10 h-10 text-[#9945FF]" />,
    title: "Smart Contract Analysis",
    descriptions: [
      "Get instant analysis of any Solana smart contract code",
      "Identify vulnerabilities in your smart contracts",
      "Optimize your contract for lower gas fees",
    ],
    details:
      "Our AI can break down complex smart contracts into plain English, highlight potential security issues, and suggest optimizations to reduce transaction costs.",
    modalDetails: [
      "Automatic vulnerability detection for common security issues",
      "Natural language explanations of complex contract logic",
      "Gas optimization recommendations with estimated savings",
      "Visual representation of contract execution flow",
      "Comparison with industry best practices and standards",
      "Integration with popular development environments",
      "Historical analysis of similar contracts and their performance",
    ],
    image: "/images/features/smart-contract.png",
  },
  {
    icon: <Zap className="w-10 h-10 text-[#14F195]" />,
    title: "Market Intelligence",
    descriptions: [
      "Real-time insights on Solana tokens and NFTs",
      "Predictive analytics for market movements",
      "Custom alerts for your watchlist assets",
    ],
    details:
      "Stay ahead of the market with AI-powered insights. Mydian analyzes on-chain data, social sentiment, and historical patterns to help you make informed decisions.",
    modalDetails: [
      "Real-time price alerts and market movement notifications",
      "Sentiment analysis from social media and news sources",
      "On-chain activity monitoring for whale movements",
      "Technical analysis with AI-powered pattern recognition",
      "Customizable dashboard with your favorite metrics",
      "Historical performance data with predictive trends",
      "Integration with popular trading platforms",
    ],
    image: "/images/features/market-intelligence.png",
  },
  {
    icon: <Cpu className="w-10 h-10 text-[#00C2FF]" />,
    title: "Developer Assistant",
    descriptions: [
      "Code generation for Solana developers",
      "Debugging assistance for complex issues",
      "Performance optimization recommendations",
    ],
    details:
      "Accelerate your development workflow with AI assistance. Generate boilerplate code, debug issues, and get personalized recommendations for improving your dApps.",
    modalDetails: [
      "Intelligent code completion and generation for Solana programs",
      "Automated bug detection and fix suggestions",
      "Performance benchmarking against similar applications",
      "Interactive tutorials for common development patterns",
      "Integration with GitHub, VSCode, and other development tools",
      "Natural language to code translation for rapid prototyping",
      "Customizable code templates for common use cases",
    ],
    image: "/images/features/developer-assistant.png",
  },
]

export function FeaturesSection() {
  const [activeModal, setActiveModal] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch((err) => {
        console.error("Video play error:", err)
        setVideoError(true)
      })
    }
  }, [])

  const openModal = (index: number) => {
    setActiveModal(index)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 ">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">Supercharge Your Solana Experience</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our AI assistant brings powerful capabilities to help you navigate the Solana ecosystem with ease. From
            smart contract analysis to market intelligence, Mydian AI is your all-in-one solution.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 flex justify-center">
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-xl border-2 border-purple-500/50 p-1 transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                boxShadow: isHovering ? "0 0 25px 5px rgba(153, 69, 255, 0.5)" : "none",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              {!videoError ? (
                <video
                  ref={videoRef}
                  className={`w-full h-auto rounded-lg ${videoLoaded ? "opacity-100" : "opacity-0"}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={handleVideoLoaded}
                  onError={handleVideoError}
                  style={{ transition: "opacity 0.5s ease" }}
                >
                  <source src="/videos/features-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-0 pb-[100%] bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                    <p>Experience the power of AI on Solana</p>
                  </div>
                </div>
              )}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent"
                style={{
                  background: "linear-gradient(45deg, #9945FF, #14F195) border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 md:mr-10">
            <div className="grid gap-8">
              {FEATURES.map((feature, index) => (
                <div key={index} className="of-card p-6 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="mr-4">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 gradient-text">{feature.title}</h3>
                      <div className="h-20">
                        <GlitchText texts={feature.descriptions} interval={4000} />
                      </div>

                      <p className="mt-4 text-gray-300 text-sm">{feature.details}</p>
                      <div className="mt-6">
                        <button
                          onClick={() => openModal(index)}
                          className="text-[#9945FF] hover:text-[#14F195] transition-colors text-sm flex items-center"
                        >
                          Learn more <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Detail Modals */}
        {activeModal !== null && (
          <FeatureDetailModal
            isOpen={activeModal !== null}
            onClose={closeModal}
            title={FEATURES[activeModal].title}
            description={FEATURES[activeModal].details}
            details={FEATURES[activeModal].modalDetails}
            image={FEATURES[activeModal].image}
          />
        )}
      </div>
    </section>
  )
}

// Add default export that points to the named export
export default FeaturesSection
