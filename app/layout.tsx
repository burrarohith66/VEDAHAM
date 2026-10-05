import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Vedaham — Learn Smarter. Build Skills. Become Career Ready.",
  description:
    "Vedaham is an AI-powered adaptive learning platform that connects academic learning with industry skills through mastery tracking, personalized roadmaps, skill-gap analysis and a context-aware AI tutor.",
  keywords: ["adaptive learning", "AI tutor", "skill gap analysis", "personalized roadmap", "mastery tracking", "career readiness"],
}

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
