"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import ParticleEffect from "./particle-effect"

interface FAQItem {
  question: string
  answer: string
}

export function InteractiveFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: "What is Mydian AI?",
      answer:
        "Mydian AI is the first artificial intelligence assistant built specifically for the Solana blockchain ecosystem. It helps users analyze smart contracts, understand market trends, and interact with the blockchain using natural language.",
    },
    {
      question: "How do I join the waitlist?",
      answer:
        "To join the waitlist, simply connect your Solana testnet wallet using the 'Join the Waitlist' button. Once connected, your wallet address will be added to our waitlist database, making you eligible for the upcoming airdrop.",
    },
    {
      question: "What can I do with Mydian AI?",
      answer:
        "Mydian AI can help you analyze smart contracts for vulnerabilities, provide real-time market insights, generate code for Solana development, explain complex blockchain concepts in simple terms, and much more.",
    },
    {
      question: "When will Mydian AI launch?",
      answer:
        "We're currently in the private alpha phase. Our public beta is scheduled for Q4 2025, with the full platform launch planned for Q1 2026. Waitlist members will receive early access invitations.",
    },
    {
      question: "Is there a token for Mydian AI?",
      answer:
        "Yes, the MYDN token will be launched alongside our public beta in Q4 2025. Waitlist members will be eligible for an airdrop of 50000 MYDN tokens, which can be used for premium features and governance.",
    },
  ]

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div id="faq-container" className="max-w-3xl mx-auto space-y-6 relative">
      <ParticleEffect containerId="faq-container" />

      {faqItems.map((item, index) => (
        <div
          key={index}
          className={`bg-black/40 backdrop-blur-sm border rounded-lg transition-all duration-500 ${
            activeIndex === index
              ? "border-purple-500/50 bg-black/60 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              : hoverIndex === index
                ? "border-purple-500/30 bg-black/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                : "border-purple-500/20"
          }`}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <button
            className="w-full text-left p-6 flex justify-between items-center"
            onClick={() => toggleItem(index)}
            aria-expanded={activeIndex === index}
          >
            <h3 className="text-xl font-bold text-white">{item.question}</h3>
            <div
              className={`transition-transform duration-300 ${
                activeIndex === index ? "rotate-180 text-purple-400" : ""
              }`}
            >
              {activeIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6 pt-0 text-gray-300">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Add default export that points to the named export
export default InteractiveFAQ
