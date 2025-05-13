"use client"

import type React from "react"

import { type ReactNode, useRef, useState } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    // Calculate rotation (max 10 degrees)
    const rotateX = -(y / rect.height) * 20
    const rotateY = (x / rect.width) * 20

    setRotation({ x: rotateX, y: rotateY })
    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setRotation({ x: 0, y: 0 })
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-200 ${className}`}
      style={{
        transform: isHovering
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)`
          : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${position.x + (cardRef.current ? cardRef.current.getBoundingClientRect().width : 0) / 2}px ${position.y + (cardRef.current ? cardRef.current.getBoundingClientRect().height : 0) / 2}px, rgba(168, 85, 247, 0.15) 0%, transparent 70%)`,
            transform: "translateZ(20px)",
          }}
        />
      )}
    </div>
  )
}
