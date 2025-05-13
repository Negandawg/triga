"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Solana3DLogoProps {
  className?: string
  height?: string
  width?: string
  spin?: boolean
  scale?: number
  use2D?: boolean
}

export default function Solana3DLogo({
  className = "",
  height = "200px",
  width = "200px",
  spin = true,
  scale = 1,
  use2D = true, // Default to 2D to avoid Three.js issues
}: Solana3DLogoProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className={`${className}`} style={{ height, width }}></div>
  }

  // Always render the 2D version for stability
  return (
    <div className={`${className} relative`} style={{ height, width }}>
      <div className={`absolute inset-0 flex items-center justify-center ${spin ? "animate-spin-slow" : ""}`}>
        <Image
          src="/images/solana-sol-logo.png"
          alt="Solana Logo"
          width={Number.parseInt(width) * 0.8}
          height={Number.parseInt(height) * 0.8}
          className="object-contain"
        />
      </div>
    </div>
  )
}
