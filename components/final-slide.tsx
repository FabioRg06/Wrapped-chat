"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { Heart, RotateCcw, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function FinalSlide({ stats, onRestart, isActive }: SlideProps) {
  const [showShare, setShowShare] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const shareModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Confetti explosion
      const confetti = confettiRef.current?.children
      if (confetti) {
        gsap.fromTo(
          confetti,
          {
            scale: 0,
            opacity: 1,
            x: 0,
            y: 0,
          },
          {
            scale: 1,
            opacity: 0,
            x: () => gsap.utils.random(-300, 300),
            y: () => gsap.utils.random(-300, 300),
            rotation: () => gsap.utils.random(-360, 360),
            duration: 2,
            stagger: 0.02,
            ease: "power2.out",
          }
        )
      }

      // Heart animation
      gsap.fromTo(
        heartRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "elastic.out(1, 0.5)",
        }
      )

      // Heart beat
      gsap.to(heartRef.current, {
        scale: 1.1,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      })

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: "power2.out" }
      )

      // Buttons animation
      gsap.fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.8, ease: "power2.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  const colors = [
    "var(--wrapped-pink)",
    "var(--wrapped-cyan)",
    "var(--wrapped-yellow)",
    "var(--wrapped-purple)",
    "var(--wrapped-orange)",
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-pink)]/20 via-background to-[var(--wrapped-cyan)]/20"
    >
      {/* Confetti */}
      <div
        ref={confettiRef}
        className="absolute top-1/2 left-1/2 pointer-events-none"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: colors[i % colors.length],
            }}
          />
        ))}
      </div>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--wrapped-pink)] rounded-full blur-[200px] opacity-20" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <div
          ref={heartRef}
          className="relative"
        >
          <div className="absolute inset-0 bg-[var(--wrapped-pink)] blur-3xl opacity-50" />
          <div className="relative p-8 rounded-full bg-gradient-to-br from-[var(--wrapped-pink)] to-destructive">
            <Heart className="w-16 h-16 text-foreground fill-foreground" />
          </div>
        </div>

        <div ref={contentRef} className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-foreground text-balance">
            Eso es todo por ahora
          </h2>
          <p className="text-lg text-muted-foreground max-w-md text-pretty">
            {stats.totalMessages.toLocaleString()} mensajes, {stats.totalWords.toLocaleString()} palabras,
            y un monton de momentos compartidos
          </p>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Desde</span>
            <span className="font-bold text-foreground">
              {stats.firstMessage.date}
            </span>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-[var(--wrapped-pink)]/10 to-[var(--wrapped-purple)]/10 rounded-xl border border-[var(--wrapped-pink)]/20">
            <p className="text-sm italic text-muted-foreground">
              &ldquo;{stats.fraseFinal}&rdquo;
            </p>
          </div>
        </div>

        <div ref={buttonsRef} className="flex flex-wrap justify-center gap-3 mt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              setShowShare(true)
            }}
            variant="outline"
            size="lg"
            className="gap-2 rounded-full border-[var(--wrapped-cyan)]/50 hover:bg-[var(--wrapped-cyan)]/10"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onRestart()
            }}
            variant="outline"
            size="lg"
            className="gap-2 rounded-full border-[var(--wrapped-pink)]/50 hover:bg-[var(--wrapped-pink)]/10"
          >
            <RotateCcw className="w-4 h-4" />
            Analizar otro chat
          </Button>
        </div>

        {/* Share Modal */}
        {showShare && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              ref={shareModalRef}
              className="bg-card rounded-2xl p-6 max-w-md w-full text-center"
            >
              <h3 className="text-xl font-bold mb-4">Comparte tu Chat Wrapped</h3>
              <p className="text-muted-foreground mb-6">
                Muestra tus estadísticas de chat a tus amigos
              </p>

              {/* QR Code placeholder */}
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="w-32 h-32 bg-foreground/10 rounded mx-auto flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">QR Code</span>
                </div>
              </div>

              {/* Share link */}
              <div className="bg-muted rounded-lg p-3 mb-4">
                <p className="text-sm font-mono break-all">
                  https://chat-wrapped.vercel.app/share/abc123
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowShare(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button className="flex-1">
                  Copiar enlace
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
