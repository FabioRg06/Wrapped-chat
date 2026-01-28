"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function TotalMessagesSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate the big number counting up
      const counter = { value: 0 }
      gsap.to(counter, {
        value: stats.totalMessages,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = Math.round(
              counter.value
            ).toLocaleString()
          }
        },
      })

      // Scale animation for the number
      gsap.fromTo(
        numberRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      )

      // Animate label
      gsap.fromTo(
        labelRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" }
      )

      // Animate stats cards
      const cards = statsRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.5,
            ease: "power2.out",
          }
        )
      }

      // Pulse animation
      gsap.to(numberRef.current, {
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, stats.totalMessages])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-pink)]/20 via-background to-[var(--wrapped-cyan)]/20"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--wrapped-pink)] rounded-full blur-[150px] opacity-30" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <p className="text-muted-foreground text-lg">Enviaron un total de</p>

        <span
          ref={numberRef}
          className="text-7xl md:text-9xl font-black bg-gradient-to-r from-[var(--wrapped-pink)] via-[var(--wrapped-yellow)] to-[var(--wrapped-cyan)] bg-clip-text text-transparent"
        >
          0
        </span>

        <p ref={labelRef} className="text-3xl md:text-4xl font-bold text-foreground">
          mensajes
        </p>

        <div ref={statsRef} className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl px-6 py-4">
            <p className="text-2xl font-bold text-[var(--wrapped-cyan)]">
              {stats.totalWords.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">palabras</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl px-6 py-4">
            <p className="text-2xl font-bold text-[var(--wrapped-purple)]">
              {stats.totalCharacters.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">caracteres</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl px-6 py-4">
            <p className="text-2xl font-bold text-[var(--wrapped-yellow)]">
              {Math.round(stats.averageMessageLength)}
            </p>
            <p className="text-sm text-muted-foreground">caracteres/mensaje</p>
          </div>
        </div>
      </div>
    </div>
  )
}
