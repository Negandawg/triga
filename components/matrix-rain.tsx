"use client"

import { useEffect, useRef, useState } from "react"

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const [isReady, setIsReady] = useState(false)

  // Only initialize after component is mounted
  useEffect(() => {
    // Set a timeout to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Main animation effect
  useEffect(() => {
    if (!isReady || typeof window === "undefined" || typeof document === "undefined") return

    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size to match window
      const resizeCanvas = () => {
        try {
          if (canvas && window) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
          }
        } catch (error) {
          console.error("Error resizing canvas:", error)
        }
      }

      resizeCanvas()

      // Safely add event listener
      let resizeListener: (() => void) | null = null
      try {
        resizeListener = () => resizeCanvas()
        window.addEventListener("resize", resizeListener)
      } catch (error) {
        console.error("Error adding resize listener:", error)
      }

      // Matrix rain characters
      const characters =
        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const charArray = characters.split("")

      // Column settings
      const fontSize = 14
      const columns = Math.floor(canvas.width / fontSize)

      // Create drops array
      const drops: number[] = []
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor((Math.random() * -canvas.height) / fontSize)
      }

      // Mouse position state
      let mouseX = 0
      let mouseY = 0

      // Safely add mouse event listeners
      let mouseMoveListener: ((e: MouseEvent) => void) | null = null
      try {
        mouseMoveListener = (e: MouseEvent) => {
          mouseX = e.clientX
          mouseY = e.clientY
        }
        if (window) {
          window.addEventListener("mousemove", mouseMoveListener)
        }
      } catch (error) {
        console.error("Error adding mousemove listener:", error)
      }

      // Draw function
      const draw = () => {
        try {
          if (!ctx || !canvas) return

          // Add semi-transparent black rectangle on top of previous frame
          ctx.fillStyle = "rgba(0, 0, 5, 0.1)"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Set text color and font
          ctx.font = `${fontSize}px monospace`

          // Loop through drops
          for (let i = 0; i < drops.length; i++) {
            // Get random character
            const text = charArray[Math.floor(Math.random() * charArray.length)]

            // Calculate x position
            const x = i * fontSize
            const y = drops[i] * fontSize

            // Check if mouse is near this character
            let brightness = 1
            const distance = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2))
            // Increase brightness based on proximity to mouse (150px radius)
            if (distance < 150) {
              // Exponential falloff for more natural spotlight effect
              brightness = 1 + Math.max(0, 1.5 * Math.pow(1 - distance / 150, 2))
            }

            // Calculate gradient color based on position and mouse proximity
            const gradient = ctx.createLinearGradient(0, y, 0, y + fontSize * 5)
            gradient.addColorStop(
              0,
              `rgba(${Math.min(255, 200 * brightness)}, ${Math.min(255, 120 * brightness)}, ${Math.min(
                255,
                255 * brightness,
              )}, 1)`,
            ) // Brighter purple at top
            gradient.addColorStop(
              0.6,
              `rgba(${Math.min(255, 160 * brightness)}, ${Math.min(255, 80 * brightness)}, ${Math.min(
                255,
                220 * brightness,
              )}, 0.8)`,
            ) // Mid purple
            gradient.addColorStop(
              1,
              `rgba(${Math.min(255, 120 * brightness)}, ${Math.min(255, 40 * brightness)}, ${Math.min(
                255,
                160 * brightness,
              )}, 0.2)`,
            ) // Faded purple at bottom

            ctx.fillStyle = gradient

            // Draw character
            ctx.fillText(text, x, y)

            // Reset drop when it reaches bottom or randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0
            }

            // Move drop down
            drops[i]++
          }
        } catch (error) {
          console.error("Error in draw function:", error)
        }
      }

      // Animation loop using requestAnimationFrame
      let lastTime = 0
      const animate = (time: number) => {
        try {
          const deltaTime = time - lastTime

          // Only draw every ~33ms (30fps)
          if (deltaTime > 33) {
            draw()
            lastTime = time
          }

          requestRef.current = requestAnimationFrame(animate)
        } catch (error) {
          console.error("Error in animation loop:", error)
        }
      }

      // Start animation with a delay to ensure everything is ready
      setTimeout(() => {
        requestRef.current = requestAnimationFrame(animate)
      }, 200)

      // Cleanup
      return () => {
        try {
          if (resizeListener && window) {
            window.removeEventListener("resize", resizeListener)
          }
          if (mouseMoveListener && window) {
            window.removeEventListener("mousemove", mouseMoveListener)
          }
          if (requestRef.current) {
            cancelAnimationFrame(requestRef.current)
          }
        } catch (error) {
          console.error("Error in cleanup:", error)
        }
      }
    } catch (error) {
      console.error("Error in MatrixRain effect:", error)
      return () => {}
    }
  }, [isReady])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 matrix-rain" />
}
