"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function ConversationThemesSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const themesRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )

      // Animate themes with stagger
      const themes = themesRef.current?.children
      if (themes) {
        gsap.fromTo(
          themes,
          { scale: 0, opacity: 0, rotation: () => gsap.utils.random(-30, 30) },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            stagger: {
              each: 0.05,
              from: "start",
            },
            delay: 0.3,
            ease: "back.out(1.7)",
          }
        )

        // Floating animation for each theme
        Array.from(themes).forEach((theme, i) => {
          gsap.to(theme, {
            y: gsap.utils.random(-10, 10),
            x: gsap.utils.random(-5, 5),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.1,
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, stats.conversationThemes])

  const maxPercentage = stats.conversationThemes[0]?.percentage || 1
  const colors = [
    "from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]",
    "from-[var(--wrapped-purple)] to-[var(--wrapped-cyan)]",
    "from-[var(--wrapped-orange)] to-[var(--wrapped-pink)]",
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-purple)]/20 via-background to-[var(--wrapped-pink)]/20"
    >
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--wrapped-purple)] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--wrapped-pink)] rounded-full blur-[130px] opacity-20" />

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div ref={titleRef} className="text-center mb-12">
          <p className="text-muted-foreground text-lg mb-2">
            Los temas que dominaron
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Temas de Conversación
          </h2>
        </div>

        <div
          ref={themesRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl"
        >
          {stats.conversationThemes.slice(0, 15).map((item, i) => {
            const size = Math.max(0.6, item.percentage / maxPercentage)
            const fontSize = 14 + size * 16

            return (
              <div
                key={item.theme}
                className={`p-4 rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} cursor-default hover:scale-105 transition-transform`}
                style={{
                  fontSize: `${fontSize}px`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-foreground">{item.theme}</span>
                  <span className="text-foreground/70 text-sm font-medium">
                    {item.percentage}%
                  </span>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}