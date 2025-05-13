import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Orbitron, Rajdhani } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ClientProviders from "@/components/client-providers"
import ErrorBoundaryWrapper from "@/components/error-boundary-wrapper"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mydian AI - The First AI Assistant for Solana",
  description:
    "Join the waitlist for Mydian AI, the first AI assistant built specifically for Solana developers, traders, and enthusiasts.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} ${orbitron.variable} ${rajdhani.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientProviders>
            {/* Use the client component wrapper instead of direct dynamic import */}
            <ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
