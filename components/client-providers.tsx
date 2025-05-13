"use client"

import { useState, useEffect, type ReactNode } from "react"
import dynamic from "next/dynamic"

// Dynamically import components that might cause issues
const WalletContextProvider = dynamic(() => import("@/components/wallet-provider"), { ssr: false })
const ToastProvider = dynamic(() => import("@/components/ui/toast-context").then((mod) => mod.ToastProvider), {
  ssr: false,
})

export function ClientProviders({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // Return a simple placeholder during SSR
    return <>{children}</>
  }

  return (
    <WalletContextProvider>
      <ToastProvider>{children}</ToastProvider>
    </WalletContextProvider>
  )
}

// Add default export that points to the named export
export default ClientProviders
