"use client"

interface UserInfo {
  ip: string
  country: string
  city: string
  userAgent: string
}

export async function getUserInfo(): Promise<UserInfo> {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return {
      ip: "Unknown",
      country: "Unknown",
      city: "Unknown",
      userAgent: "Unknown",
    }
  }

  try {
    // Get IP from a service that returns the client's IP
    const ipResponse = await fetch("https://api.ipify.org?format=json")
    const ipData = await ipResponse.json()
    const ip = ipData.ip || "Unknown"

    // Get location data
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
    const geoData = await geoResponse.json()

    return {
      ip,
      country: geoData.country_name || "Unknown",
      city: geoData.city || "Unknown",
      userAgent: window.navigator.userAgent || "Unknown",
    }
  } catch (error) {
    console.error("Error fetching location data:", error)
    return {
      ip: "Unknown",
      country: "Unknown",
      city: "Unknown",
      userAgent: window.navigator?.userAgent || "Unknown",
    }
  }
}
