"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Toast from "./toast"

type ToastType = "success" | "error" | "info"

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType; duration: number }>>([])
  const [isReady, setIsReady] = useState(false)
  let toastId = 0

  // Set ready state after mount
  useEffect(() => {
    setIsReady(true)
  }, [])

  const showToast = (message: string, type: ToastType = "info", duration = 5000) => {
    if (!isReady) {
      console.warn("Toast provider not ready yet")
      return
    }

    const id = toastId++
    // Use longer duration for errors to ensure users have time to read them
    const actualDuration = type === "error" ? 8000 : duration
    setToasts((prev) => [...prev, { id, message, type, duration: actualDuration }])
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    // Return a dummy implementation if used outside provider
    return {
      showToast: (message: string, type?: ToastType) => {
        console.warn("useToast used outside of ToastProvider:", message, type)
      },
    }
  }
  return context
}
