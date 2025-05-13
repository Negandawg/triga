"use client"

import { useState } from "react"
import { Check, Clock } from "lucide-react"
import ParticleEffect from "./particle-effect"

interface RoadmapItem {
  quarter: string
  title: string
  description: string
  completed: boolean
  details?: string[]
}

export default function InteractiveRoadmap() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const roadmapItems: RoadmapItem[] = [
    {
      quarter: "Q2 2024 - Q1 2025",
      title: "Research & Development",
      description:
        "Initial research phase, team formation, and concept validation. Development of core AI models specialized for Solana blockchain data analysis.",
      completed: true,
      details: [
        "Assembled core team of AI researchers and Solana developers",
        "Completed market research and competitor analysis",
        "Developed initial AI model architecture",
        "Secured seed funding from strategic investors",
      ],
    },
    {
      quarter: "Q2 2025",
      title: "Private Alpha",
      description:
        "Limited access release to strategic partners and early adopters. Focused on smart contract analysis and basic market intelligence features.",
      completed: true,
      details: [
        "Released alpha version to 50 selected users",
        "Implemented core smart contract analysis features",
        "Developed basic market intelligence dashboard",
        "Collected and analyzed user feedback",
      ],
    },
    {
      quarter: "Q3 2025",
      title: "Public Beta & Token Launch",
      description:
        "Public beta release with expanded features. Introduction of MYDN token and initial distribution to early supporters and waitlist members.",
      completed: false,
      details: [
        "Launch public beta with improved UI/UX",
        "Release MYDN token on Solana",
        "Distribute airdrops to waitlist members",
        "Implement token utility features",
        "Expand AI capabilities with new models",
      ],
    },
    {
      quarter: "Q4 2025",
      title: "Full Platform Launch",
      description:
        "Complete platform launch with all core features. Integration with major Solana dApps and expanded developer tools.",
      completed: false,
      details: [
        "Release v1.0 of Mydian AI platform",
        "Launch developer SDK and API",
        "Integrate with major Solana dApps",
        "Implement advanced security features",
        "Expand team with additional AI researchers",
      ],
    },
    {
      quarter: "Q1 2026",
      title: "Ecosystem Expansion",
      description:
        "Introduction of advanced features including predictive analytics, automated trading strategies, and expanded developer SDK.",
      completed: false,
      details: [
        "Launch predictive analytics module",
        "Implement automated trading strategies",
        "Expand developer SDK with new tools",
        "Begin research on multi-chain support",
        "Establish strategic partnerships with major protocols",
      ],
    },
  ]

  return (
    <div id="roadmap-container" className="max-w-5xl mx-auto relative">
      <ParticleEffect containerId="roadmap-container" />

      {/* Vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 via-violet-500 to-blue-500 rounded-full hidden md:block"></div>

      {roadmapItems.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-center mb-16 relative ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => setActiveIndex(activeIndex === index ? null : index)}
        >
          {/* Timeline dot */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 z-10 hidden md:flex items-center justify-center transition-all duration-300 ${
              item.completed ? "border-purple-500 bg-purple-900/50" : "border-gray-500 bg-black"
            } ${
              hoverIndex === index || activeIndex === index ? "scale-150 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
            }`}
          >
            {item.completed && <Check className="w-4 h-4 text-purple-300" />}
            {!item.completed && <Clock className="w-4 h-4 text-gray-400" />}
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-6">
            <div
              className={`bg-black/40 backdrop-blur-sm border rounded-lg p-6 transition-all duration-500 ${
                activeIndex === index
                  ? "border-purple-500/50 bg-black/60 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : hoverIndex === index
                    ? "border-purple-500/30 bg-black/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    : item.completed
                      ? "border-purple-500/40"
                      : "border-purple-500/20"
              }`}
            >
              <div className="text-sm font-bold text-purple-400 mb-2">{item.quarter}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>

              {/* Status indicator */}
              <div className="mt-4 flex items-center">
                <div
                  className={`inline-block px-3 py-1 text-xs rounded-full ${
                    item.completed ? "bg-purple-500/20 text-purple-300" : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {item.completed ? "Completed" : "Upcoming"}
                </div>

                <div className="ml-auto text-sm text-purple-400">
                  {activeIndex === index ? "Hide details" : "View details"}
                </div>
              </div>

              {/* Expanded details */}
              <div
                className={`overflow-hidden transition-all duration-500 mt-4 ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pt-4 border-t border-purple-500/20">
                  <h4 className="font-bold text-white mb-2">Milestone Details:</h4>
                  <ul className="space-y-2">
                    {item.details?.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-1 text-purple-400">•</div>
                        <span className="text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer for mobile */}
          <div className="h-8 md:hidden"></div>
        </div>
      ))}
    </div>
  )
}
