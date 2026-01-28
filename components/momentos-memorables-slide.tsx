"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function MomentosMemoralesSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )

      const items = itemsRef.current?.children
      if (items) {
        gsap.fromTo(
          items,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.2,
            ease: "power2.out",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  const colors = [
    "from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-purple)] to-[var(--wrapped-cyan)]",
    "from-[var(--wrapped-cyan)] to-[var(--wrapped-yellow)]",
    "from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]",
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-pink)]/20 via-background to-[var(--wrapped-cyan)]/20"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--wrapped-pink)] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[var(--wrapped-cyan)] rounded-full blur-[100px] opacity-20" />

      <div className="relative z-10 w-full max-w-xl px-6">
        <div ref={titleRef} className="text-center mb-10">
          <h2 className="text-5xl font-black text-foreground mb-3">
            Momentos Memorables
          </h2>
          <p className="text-2xl">✨</p>
        </div>

        <div ref={itemsRef} className="space-y-4">
          {stats.momentosMemorables.slice(0, 3).map((momento, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${colors[i % colors.length]} p-1 rounded-2xl`}
            >
              <div className="bg-background rounded-[15px] p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {momento.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {momento.historia}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
