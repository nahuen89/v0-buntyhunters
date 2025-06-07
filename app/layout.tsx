import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { GameProvider } from "@/contexts/game-context"

export const metadata: Metadata = {
  title: "Chronicles of Fate",
  description: "A tactical RPG where your allies make their own decisions in battle",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  )
}
