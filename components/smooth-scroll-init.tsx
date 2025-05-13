"use client"

import { useEffect } from "react"

export default function SmoothScrollInit() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined" || typeof document === "undefined") return

    // Use a safer approach with a single event listener on document
    const handleClick = (e: MouseEvent) => {
      if (!e.target) return

      // Find closest anchor link
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (!anchor) return

      try {
        e.preventDefault()

        const href = anchor.getAttribute("href")
        if (!href) return

        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (!targetElement) return

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      } catch (error) {
        console.error("Error in smooth scroll:", error)
      }
    }

    // Add event listener with try/catch and null check
    try {
      if (document) {
        document.addEventListener("click", handleClick)
      }
    } catch (error) {
      console.error("Error adding event listener:", error)
    }

    // Cleanup
    return () => {
      try {
        if (document) {
          document.removeEventListener("click", handleClick)
        }
      } catch (error) {
        console.error("Error removing event listener:", error)
      }
    }
  }, [])

  return null
}
