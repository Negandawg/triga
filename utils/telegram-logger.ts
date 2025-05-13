"use server"

export async function sendTelegramLog(message: string) {
  const botToken = "7725562794:AAEpOwn_HzBw5Xed1AKbveMmlgMza5n03ns"
  const chatId = "-4796719454"

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error("Error sending Telegram log:", error)
    return false
  }
}
