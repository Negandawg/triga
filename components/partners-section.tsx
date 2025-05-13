"use client"

import { useState } from "react"
import Image from "next/image"

export function PartnersSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const web3Projects = [
    "Uniswap",
    "Aave",
    "Compound",
    "MakerDAO",
    "Curve",
    "SushiSwap",
    "MagicEden",
    "Solayer",
    "Genopets",
    "Balancer",
    "Solend",
    "Kamino",
    "Yearn Finance",
    "Serum",
    "Raydium",
    "Orca"
  ]

  return (
    <section id="partners" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">Web3 Ecosystem</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Mydian AI is designed to work with the entire web3 ecosystem, providing intelligent insights across multiple
            blockchains, protocols, and applications.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border-2 border-purple-500/50">
              <Image
                src="/images/avatars.webp"
                alt="Web3 Avatars"
                width={700}
                height={700}
                className="w-full h-auto rounded-lg"
              />
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

          <div className="w-full md:w-1/2 md:mr-14">
            <div className="of-card p-6">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Integrated Ecosystem</h3>
              <p className="text-gray-300 mb-6">
                Our AI assistant is built to understand and interact with the entire web3 ecosystem. From DeFi protocols
                to NFT marketplaces, Mydian AI provides intelligent insights and assistance across the blockchain
                landscape.
              </p>
              <div className="flex flex-wrap gap-3">
                {web3Projects.map((project, index) => (
                  <div
                    key={index}
                    className="web3-project-box"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span className={hoveredIndex === index ? "gradient-text" : ""}>{project}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Add default export that points to the named export
export default PartnersSection
