"use client"

import { useState, useEffect, type ReactNode } from "react"
import dynamic from "next/dynamic"

// Dynamically import the ErrorBoundary with no SSR
const ErrorBoundary = dynamic(() => import("@/components/error-boundary"), { ssr: false })

interface ErrorBoundaryWrapperProps {
  children: ReactNode
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // During SSR or before mounting, just render children
  if (!isMounted) {
    return <>{children}</>
  }

  // After mounting, wrap with ErrorBoundary
  return <ErrorBoundary>{children}</ErrorBoundary>
}

// Add default export that points to the named export
export default ErrorBoundaryWrapper
