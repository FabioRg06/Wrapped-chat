"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function CancionRepeatSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )

      const items = wordsRef.current?.children
      if (items) {
        gsap.fromTo(
          items,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.2,
            ease: "back.out(1.5)",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  const colors = [
    "from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-purple)] to-[var(--wrapped-pink)]",
    "from-[var(--wrapped-pink)] to-[var(--wrapped-yellow)]",
    "from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]",
    "from-[var(--wrapped-orange)] to-[var(--wrapped-cyan)]",
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-cyan)]/20 via-background to-[var(--wrapped-purple)]/20"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--wrapped-cyan)] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[var(--wrapped-purple)] rounded-full blur-[100px] opacity-20" />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div ref={titleRef} className="text-center mb-10">
          <h2 className="text-5xl font-black text-foreground mb-3">
            Tu Canción On Repeat
          </h2>
          <p className="text-3xl">🔁</p>
        </div>

        <div ref={wordsRef} className="space-y-3">
          {stats.cancionRepeat.slice(0, 5).map((item, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${colors[i % colors.length]} p-1 rounded-2xl`}
            >
              <div className="bg-background rounded-[15px] p-4">
                <p className="text-sm font-bold text-foreground/60 mb-1">
                  Palabra {i + 1}
                </p>
                <h3 className="text-xl font-black text-foreground mb-2">
                  "{item.palabra}"
                </h3>
                <p className="text-xs leading-relaxed text-foreground/70">
                  {item.significado}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
