"use client"

import { useEffect, useRef, useState } from "react"

interface ParticleEffectProps {
  containerId: string
}

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  alpha: number
  size: number
  color: string
}

export default function ParticleEffect({ containerId }: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const requestRef = useRef<number>()

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Find container element
  useEffect(() => {
    if (!isMounted || typeof document === "undefined") return

    const container = document.getElementById(containerId)
    if (container) {
      setContainerElement(container)
    }
  }, [containerId, isMounted])

  // Setup canvas and animation when container is found
  useEffect(() => {
    if (!containerElement || !canvasRef.current || !isMounted || typeof window === "undefined") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match container
    const updateCanvasSize = () => {
      const rect = containerElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    updateCanvasSize()

    // Safely add resize listener
    try {
      window.addEventListener("resize", updateCanvasSize)
    } catch (error) {
      console.error("Error adding resize listener:", error)
    }

    // Initialize particles
    const colors = ["#a855f7", "#8b5cf6", "#6366f1", "#3b82f6"]
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.5 + 0.2,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    initParticles()

    // Mouse position state
    let mouseX = 0
    let mouseY = 0
    let isHovering = false

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    const handleMouseEnter = () => {
      isHovering = true
    }

    const handleMouseLeave = () => {
      isHovering = false
    }

    // Add event listeners safely
    try {
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("mouseenter", handleMouseEnter)
      canvas.addEventListener("mouseleave", handleMouseLeave)
    } catch (error) {
      console.error("Error adding mouse event listeners:", error)
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Only animate if hovering
      if (isHovering) {
        // Draw and update particles
        particlesRef.current.forEach((particle) => {
          // Calculate distance from mouse
          const dx = particle.x - mouseX
          const dy = particle.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Attract particles to mouse position
          if (distance < 150) {
            const force = 0.2 * (1 - distance / 150)
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
          }

          // Update position
          particle.x += particle.vx
          particle.y += particle.vy
          particle.z += particle.vz

          // Boundary check
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
          if (particle.z < 0 || particle.z > 10) particle.vz *= -1

          // Draw particle
          ctx.globalAlpha = particle.alpha * (particle.z / 10)
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * (particle.z / 5 + 0.5), 0, Math.PI * 2)
          ctx.fill()
        })
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      try {
        window.removeEventListener("resize", updateCanvasSize)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseenter", handleMouseEnter)
        canvas.removeEventListener("mouseleave", handleMouseLeave)
      } catch (error) {
        console.error("Error removing event listeners:", error)
      }

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [containerElement, isMounted])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" style={{ mixBlendMode: "screen" }} />
  )
}
