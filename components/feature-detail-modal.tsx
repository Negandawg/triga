"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import SciFiText from "@/components/sci-fi-text"

interface FeatureDetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  details: string[]
  image?: string
}

export default function FeatureDetailModal({
  isOpen,
  onClose,
  title,
  description,
  details,
  image,
}: FeatureDetailModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    } else {
      // Allow scrolling when modal is closed
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen && !isAnimating) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

      <div
        className={`relative bg-black/90 border border-purple-500/30 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto transition-all duration-300 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/50 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            <SciFiText text={title} glowIntensity="medium" />
          </h3>

          {image && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-auto" />
            </div>
          )}

          <p className="text-gray-300 mb-6">{description}</p>

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-purple-400">Key Features</h4>
            <ul className="space-y-3">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-300">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-500/20">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
