"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function TopEmojisSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const emojisRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const topEmojiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      )

      // Animate top emoji with bounce
      gsap.fromTo(
        topEmojiRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          delay: 0.3,
          ease: "elastic.out(1, 0.5)",
        }
      )

      // Pulse animation for top emoji
      gsap.to(topEmojiRef.current, {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      })

      // Animate other emojis
      const emojis = emojisRef.current?.children
      if (emojis) {
        gsap.fromTo(
          emojis,
          { y: 50, opacity: 0, scale: 0.5 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.6,
            ease: "back.out(1.7)",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, stats.topEmojis])

  const topEmoji = stats.topEmojis?.[0]
  const hasEmojis = stats.topEmojis && stats.topEmojis.length > 0

  // If no emojis data, return fallback
  if (!hasEmojis) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-cyan)]/20 via-background to-[var(--wrapped-yellow)]/20">
        <div className="relative z-10 text-center">
          <p className="text-muted-foreground mb-4">No hay datos de emojis disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-cyan)]/20 via-background to-[var(--wrapped-yellow)]/20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stats.topEmojis.slice(0, 8).map((item, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-10 animate-pulse"
            style={{
              left: `${10 + (i % 4) * 25}%`,
              top: `${10 + Math.floor(i / 4) * 70}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <div ref={titleRef} className="text-center">
          <p className="text-muted-foreground text-lg mb-2">El emoji favorito es</p>
        </div>

        <div
          ref={topEmojiRef}
          className="relative"
        >
          <div className="absolute inset-0 bg-[var(--wrapped-yellow)] blur-3xl opacity-30" />
          <div className="relative text-8xl md:text-9xl">
            {topEmoji?.emoji || "😊"}
          </div>
        </div>

        <div className="text-center">
          <p className="text-4xl font-bold text-foreground">
            {topEmoji?.count.toLocaleString() || 0}
          </p>
          <p className="text-muted-foreground">veces usado</p>
        </div>

        <div ref={emojisRef} className="flex flex-wrap justify-center gap-4 mt-4">
          {stats.topEmojis.slice(1, 6).map((item, i) => (
            <div
              key={item.emoji}
              className="flex flex-col items-center gap-2 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 min-w-[80px]"
            >
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-sm text-muted-foreground font-medium">
                {item.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
