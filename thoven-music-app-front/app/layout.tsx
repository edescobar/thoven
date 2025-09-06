import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Fredoka } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

export const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const fontDisplay = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Thoven - Personalized Music Lessons",
  description: "Connect with expert music teachers for personalized 1-on-1 lessons. Learn piano, guitar, violin, and more with qualified instructors.",
  keywords: "music lessons, piano lessons, guitar lessons, violin lessons, music teachers, online music lessons",
  authors: [{ name: "Thoven" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Thoven - Personalized Music Lessons",
    description: "Connect with expert music teachers for personalized 1-on-1 lessons",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable} antialiased`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
