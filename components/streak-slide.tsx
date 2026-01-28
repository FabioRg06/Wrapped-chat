"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { Flame, Calendar } from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function StreakSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const flameRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Flame animation
      gsap.fromTo(
        flameRef.current,
        { scale: 0, y: 50 },
        {
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      )

      // Flame flicker
      gsap.to(flameRef.current, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Counter animation
      const counter = { value: 0 }
      gsap.to(counter, {
        value: stats.longestStreak.days,
        duration: 1.5,
        delay: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = Math.round(counter.value).toString()
          }
        },
      })

      gsap.fromTo(
        numberRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0.4 }
      )

      // Date animation
      gsap.fromTo(
        dateRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.8, ease: "power2.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, stats.longestStreak])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-orange)]/20 via-background to-[var(--wrapped-yellow)]/20"
    >
      {/* Fire glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--wrapped-orange)] rounded-full blur-[180px] opacity-30" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p className="text-muted-foreground text-lg">La racha mas larga fue de</p>

        <div
          ref={flameRef}
          className="relative"
        >
          <div className="absolute inset-0 bg-[var(--wrapped-orange)] blur-3xl opacity-50" />
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[var(--wrapped-yellow)] via-[var(--wrapped-orange)] to-destructive">
            <Flame className="w-20 h-20 text-foreground" strokeWidth={1.5} />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            ref={numberRef}
            className="text-8xl md:text-9xl font-black bg-gradient-to-b from-[var(--wrapped-yellow)] via-[var(--wrapped-orange)] to-destructive bg-clip-text text-transparent"
          >
            0
          </span>
          <span className="text-3xl font-bold text-foreground">dias</span>
        </div>

        <p className="text-xl text-muted-foreground">
          de conversacion consecutiva
        </p>

        <div
          ref={dateRef}
          className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-2xl px-6 py-4 mt-4"
        >
          <Calendar className="w-5 h-5 text-[var(--wrapped-orange)]" />
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Desde</p>
            <p className="font-medium text-foreground">
              {stats.longestStreak.startDate} - {stats.longestStreak.endDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
