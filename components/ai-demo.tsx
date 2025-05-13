"use client"

import { useState, useEffect, useRef } from "react"
import { Bot } from "lucide-react"

const DEMO_CONVERSATION = [
  {
    query:
      "Fetch me the transaction log of 5sgAM8GCkuXXGGXsMp7aKKwvuvBfZoZ8S1VA5fVPCm8HVQYXKHbvPJetQ9SUoBBN4DoJw9qQpwLJjhgkZVR7HQkJ",
    response: [
      "Transaction Details:",
      "Signature: 5sgAM8GCkuXXGGXsMp7aKKwvuvBfZoZ8S1VA5fVPCm8HVQYXKHbvPJetQ9SUoBBN4DoJw9qQpwLJjhgkZVR7HQkJ",
      "Status: Confirmed (32 confirmations)",
      "Slot: 239,751,134",
      "Fee: 0.000005 SOL",
      "Recent Blockhash: 8x4iBrSVfgVkPPw7xJSdMqYVHz92GGZbBQqP3YHgSm7r",
      "",
      "Accounts Involved:",
      "- Sender: Gj5KX7JLjgJj2KYR8P9SHmCeBT7vA4UE1iL9Ld9WXG2Z",
      "- Receiver: 7EFk3VrBXnXqBLKdAyYY4WZSuRCwAhDKxPGfCdJpzn9B",
      "- Amount: 12.5 SOL",
      "",
      "Program Logs:",
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program 11111111111111111111111111111111 success",
      "",
      "Instruction Data:",
      "Transfer: 12.5 SOL",
    ],
  },
  {
    query: "What's the current price of SOL?",
    response: [
      "Current SOL Price:",
      "SOL/USD: $169.42 (+5.8% in 24h)",
      "SOL/BTC: 0.00278 BTC",
      "SOL/ETH: 0.0412 ETH",
      "",
      "Market Data:",
      "24h Volume: $2.1B",
      "Market Cap: $74.5B",
      "Fully Diluted Valuation: $89.7B",
      "",
      "Price Movement:",
      "1h: +0.8%",
      "24h: +5.8%",
      "7d: +12.3%",
      "30d: +28.7%",
    ],
  },
  {
    query: "Analyze smart contract GZNnph4EvmyjTRwT8dC6cgcgEHwpqHZrMuAwHXqgkGd3",
    response: [
      "Smart Contract Analysis: GZNnph4EvmyjTRwT8dC6cgcgEHwpqHZrMuAwHXqgkGd3",
      "",
      "Contract Type: SPL Token",
      "Program: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "Created: 2023-08-15",
      "",
      "Security Analysis:",
      "✓ No critical vulnerabilities detected",
      "✓ Standard SPL token implementation",
      "⚠️ Admin has minting privileges",
      "⚠️ No token supply cap implemented",
      "",
      "Token Details:",
      "- Name: Mydian Token",
      "- Symbol: MYDN",
      "- Decimals: 9",
      "- Current Supply: 100,000,000",
      "- Holders: 1,245",
      "",
      "Recommendation:",
      "This appears to be a standard SPL token with admin minting privileges. Consider implementing a supply cap for increased investor confidence.",
    ],
  },
]

export default function AIDemo() {
  const [activeConversation, setActiveConversation] = useState(0)
  const [typingIndex, setTypingIndex] = useState(0)
  const [showResponse, setShowResponse] = useState(false)
  const [responseIndex, setResponseIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)

  // Handle typing animation for query
  useEffect(() => {
    if (typingIndex < DEMO_CONVERSATION[activeConversation].query.length) {
      const timer = setTimeout(() => {
        setInputValue(DEMO_CONVERSATION[activeConversation].query.substring(0, typingIndex + 1))
        setTypingIndex(typingIndex + 1)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // When typing is complete, show response after a delay
      const timer = setTimeout(() => {
        setShowResponse(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [typingIndex, activeConversation])

  // Handle response animation
  useEffect(() => {
    if (showResponse && responseIndex < DEMO_CONVERSATION[activeConversation].response.length) {
      const timer = setTimeout(() => {
        setResponseIndex(responseIndex + 1)

        // Scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, 100)
      return () => clearTimeout(timer)
    } else if (showResponse && responseIndex >= DEMO_CONVERSATION[activeConversation].response.length) {
      // Move to next conversation after delay
      const timer = setTimeout(() => {
        const nextConversation = (activeConversation + 1) % DEMO_CONVERSATION.length
        setActiveConversation(nextConversation)
        setTypingIndex(0)
        setShowResponse(false)
        setResponseIndex(0)
        setInputValue("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showResponse, responseIndex, activeConversation])

  // Function to get terminal text class
  const getTerminalClass = (line: string) => {
    // Apply different colors to different types of lines
    if (line.startsWith("Program")) return "terminal-text-green"
    else if (line.startsWith("-")) return "terminal-text-cyan"
    else if (line.includes(":")) return "terminal-text-purple"
    else if (line.startsWith("✓")) return "terminal-text-green"
    else if (line.startsWith("⚠️")) return "terminal-text-blue"
    return "terminal-text"
  }

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden">
      <div className="bg-black/80 p-3 border-b border-purple-500/30 flex items-center">
        <Bot className="w-5 h-5 text-purple-400 mr-2" />
        <span className="text-purple-300 font-medium terminal-text">Mydian AI Terminal</span>
      </div>

      <div
        ref={terminalRef}
        className="p-4 h-[400px] overflow-y-auto terminal-scrollbar"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        <div className="flex items-start mb-4">
          <div className="bg-purple-600/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
            <span className="text-purple-300 text-xs">You</span>
          </div>
          <div>
            <div className="text-gray-400 mb-1" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              user@mydian:~$
            </div>
            <div className="text-white" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              {inputValue}
              <span
                className={`inline-block w-2 h-4 bg-purple-400 ml-0.5 ${typingIndex < DEMO_CONVERSATION[activeConversation].query.length ? "animate-blink" : "opacity-0"}`}
              ></span>
            </div>
          </div>
        </div>

        {showResponse && (
          <div className="flex items-start mt-6">
            <div className="bg-purple-600/40 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <Bot className="w-4 h-4 text-purple-200" />
            </div>
            <div>
              <div className="text-gray-400 mb-1" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                mydian-ai:~$
              </div>
              <div className="space-y-1">
                {DEMO_CONVERSATION[activeConversation].response.slice(0, responseIndex).map((line, i) => (
                  <div
                    key={i}
                    className={line === "" ? "h-3" : getTerminalClass(line)}
                    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                  >
                    {line}
                  </div>
                ))}
                {responseIndex < DEMO_CONVERSATION[activeConversation].response.length && (
                  <span className="inline-block w-2 h-4 bg-purple-400 ml-0.5 animate-blink"></span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-purple-500/30 flex">
        <input
          type="text"
          className="bg-black/60 border border-purple-500/30 rounded px-3 py-2 text-white w-full focus:outline-none focus:border-purple-500"
          placeholder="Ask Mydian AI..."
          readOnly
          value=""
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        />
      </div>
    </div>
  )
}
