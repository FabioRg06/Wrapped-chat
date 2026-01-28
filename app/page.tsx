"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { FileUpload } from "@/components/file-upload"
import { WrappedSlides } from "@/components/wrapped-slides"
import type { ChatStats } from "@/lib/types"
import { MessageCircle, Sparkles } from "lucide-react"

export default function ChatWrappedPage() {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const uploadRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (!containerRef.current || stats) return

    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )

      // Animate subtitle
      gsap.fromTo(
        subtitleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      )

      // Animate upload area only if no stats yet
      if (!stats) {
        gsap.fromTo(
          uploadRef.current,
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, delay: 0.4, ease: "back.out(1.5)" }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [stats])


  const handleFileSelect = async (content: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatContent: content }),
      })

      if (!response.ok) {
        throw new Error("Error al analizar el chat")
      }

      const data = await response.json()

      // Animate out before showing slides
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => setStats(data),
        })
      } else {
        setStats(data)
      }
    } catch (err) {
      setError("Hubo un error al analizar tu chat. Intenta de nuevo.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    setStats(null)
    setError(null)
  }

  if (stats) {
    return <WrappedSlides stats={stats} onRestart={handleRestart} />
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-6 py-12"
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--wrapped-pink)] rounded-full blur-[180px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[var(--wrapped-cyan)] rounded-full blur-[160px] opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--wrapped-purple)] rounded-full blur-[140px] opacity-15 animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <MessageCircle
            key={i}
            className="absolute text-[var(--wrapped-pink)] opacity-10"
            style={{
              left: `${10 + (i % 4) * 25}%`,
              top: `${15 + Math.floor(i / 4) * 60}%`,
              width: 24 + (i % 3) * 12,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[var(--wrapped-pink)]/10 border border-[var(--wrapped-pink)]/30 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-[var(--wrapped-pink)]" />
            <span className="text-sm font-medium text-[var(--wrapped-pink)]">
              Descubre tu ano en mensajes
            </span>
          </div>

          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-black tracking-tight text-foreground text-balance"
          >
            Chat
            <span className="block bg-gradient-to-r from-[var(--wrapped-pink)] via-[var(--wrapped-purple)] to-[var(--wrapped-cyan)] bg-clip-text text-transparent">
              Wrapped
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg text-muted-foreground max-w-md mx-auto text-pretty"
          >
            Sube tu chat exportado y descubre estadisticas increibles sobre tus conversaciones
          </p>
        </div>

        {/* Upload area */}
        <div ref={uploadRef}>
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground max-w-sm space-y-2">
          <p className="font-medium text-foreground">Como exportar tu chat:</p>
          <ul className="space-y-1">
            <li>
              <span className="text-[var(--wrapped-pink)]">WhatsApp:</span> Chat {'->'} Mas {'->'} Exportar chat
            </li>
            <li>
              <span className="text-[var(--wrapped-cyan)]">Telegram:</span> Chat {'->'} Exportar historial
            </li>
          </ul>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

      </div>
    </div>
  )
}
