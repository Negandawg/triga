"use client"

interface SciFiTextProps {
  text: string
  className?: string
  glowColor?: "purple" | "blue" | "cyan" | "multi"
  glowIntensity?: "low" | "medium" | "high"
}

export default function SciFiText({
  text,
  className = "",
  glowColor = "multi",
  glowIntensity = "medium",
}: SciFiTextProps) {
  // Define gradient based on glowColor
  const getGradient = () => {
    switch (glowColor) {
      case "purple":
        return "from-purple-400 to-purple-600"
      case "blue":
        return "from-blue-400 to-blue-600"
      case "cyan":
        return "from-cyan-400 to-cyan-600"
      case "multi":
      default:
        return "from-purple-400 via-violet-300 to-blue-300"
    }
  }

  // Define text shadow based on glowIntensity
  const getTextShadow = () => {
    const color =
      glowColor === "purple"
        ? "168, 85, 247"
        : glowColor === "blue"
          ? "96, 165, 250"
          : glowColor === "cyan"
            ? "34, 211, 238"
            : "168, 85, 247" // Default to purple for multi

    switch (glowIntensity) {
      case "low":
        return `0 0 5px rgba(${color}, 0.7)`
      case "high":
        return `0 0 5px rgba(${color}, 0.7), 0 0 15px rgba(${color}, 0.5), 0 0 25px rgba(${color}, 0.3)`
      case "medium":
      default:
        return `0 0 5px rgba(${color}, 0.7), 0 0 10px rgba(${color}, 0.5)`
    }
  }

  return (
    <span
      className={`font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r ${getGradient()} ${className}`}
      style={{ textShadow: getTextShadow() }}
    >
      {text}
    </span>
  )
}
