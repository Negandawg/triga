"use client"

import { type FC, type ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { useToast } from "@/components/ui/toast-context"

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css")

interface WalletContextProviderProps {
  children: ReactNode
}

const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const { showToast } = useToast()

  // Set up network and endpoint
  const network = WalletAdapterNetwork.Testnet
  const endpoint = useMemo(() => "https://api.testnet.solana.com", [])

  // Initialize wallets
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
        onError={(error) => {
          // Don't log user rejections as they are expected
          if (error.name === "WalletConnectionError" && error.error?.code === 4001) {
            console.log("User rejected the connection request")
            return
          }

          // Handle wallet not installed
          if (error.name === "WalletNotReadyError") {
            console.log("Wallet not installed or not ready")
            showToast("Please install Phantom or Solflare wallet extension", "info")
            return
          }

          // Handle connection rejected errors more gracefully
          if (error.message?.includes("Connection rejected")) {
            console.log("Wallet connection rejected")
            showToast("Wallet connection was rejected. Please try again.", "info")
            return
          }

          // Log other errors with more details
          console.error("Wallet error:", {
            name: error.name,
            message: error.message,
            error: error.error,
          })

          // Show a user-friendly error message
          showToast("Wallet connection failed. Please try again.", "error")
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider
