"use client"

import { useState, useEffect } from "react"

interface GlitchTextProps {
  texts: string[]
  interval?: number
  glitchIntensity?: "low" | "medium" | "high"
}

export default function GlitchText({ texts, interval = 3000, glitchIntensity = "medium" }: GlitchTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [displayText, setDisplayText] = useState(texts[0])

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Start glitch effect
      setIsGlitching(true)

      // After a short delay, change the text and stop glitching
      setTimeout(
        () => {
          const nextIndex = (currentIndex + 1) % texts.length
          setCurrentIndex(nextIndex)
          setDisplayText(texts[nextIndex])

          // Small delay before stopping the glitch effect
          setTimeout(
            () => {
              setIsGlitching(false)
            },
            glitchIntensity === "high" ? 300 : glitchIntensity === "medium" ? 150 : 100,
          )
        },
        glitchIntensity === "high" ? 400 : glitchIntensity === "medium" ? 200 : 100,
      )
    }, interval)

    return () => clearInterval(intervalId)
  }, [currentIndex, interval, texts, glitchIntensity])

  // Function to create glitch effect by randomly replacing characters
  const glitchText = (text: string) => {
    if (!isGlitching) return text

    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`"
    let result = ""

    // Adjust glitch probability based on intensity
    const glitchProb = glitchIntensity === "high" ? 0.5 : glitchIntensity === "medium" ? 0.3 : 0.2

    for (let i = 0; i < text.length; i++) {
      if (Math.random() > 1 - glitchProb) {
        result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
      } else {
        result += text[i]
      }
    }

    return result
  }

  // Calculate shadow intensity based on glitch intensity
  const getShadow = () => {
    if (!isGlitching) return "none"

    if (glitchIntensity === "high") {
      return "0 0 8px rgba(168, 85, 247, 0.9), 0 0 15px rgba(168, 85, 247, 0.7), 0 0 25px rgba(168, 85, 247, 0.5)"
    } else if (glitchIntensity === "medium") {
      return "0 0 5px rgba(168, 85, 247, 0.7), 0 0 10px rgba(168, 85, 247, 0.5)"
    } else {
      return "0 0 3px rgba(168, 85, 247, 0.6)"
    }
  }

  // Calculate transform based on glitch intensity
  const getTransform = () => {
    if (!isGlitching) return "none"

    const offset = glitchIntensity === "high" ? 6 : glitchIntensity === "medium" ? 4 : 2
    return `translateX(${Math.random() * offset - offset / 2}px) translateY(${(Math.random() * offset) / 2 - offset / 4}px)`
  }

  return (
    <div className="relative">
      <p
        className={`text-gray-300 transition-all ${isGlitching ? "text-purple-400" : ""}`}
        style={{
          textShadow: getShadow(),
          transform: getTransform(),
        }}
      >
        {glitchText(displayText)}
      </p>
    </div>
  )
}
