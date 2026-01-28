"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { Crown, MessageSquare } from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function TopChatterSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const crownRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Crown animation
      gsap.fromTo(
        crownRef.current,
        { y: -50, opacity: 0, rotation: -20 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        }
      )

      // Crown bounce
      gsap.to(crownRef.current, {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      })

      // Animate bars
      const bars = barsRef.current?.children
      if (bars) {
        gsap.fromTo(
          bars,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.3,
            ease: "power3.out",
          }
        )

        // Animate progress bars width
        Array.from(bars).forEach((bar, i) => {
          const progressBar = bar.querySelector(".progress-bar")
          if (progressBar) {
            gsap.fromTo(
              progressBar,
              { width: 0 },
              {
                width: `${stats.participants[i]?.percentage || 0}%`,
                duration: 1,
                delay: 0.5 + i * 0.15,
                ease: "power2.out",
              }
            )
          }
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, stats.participants])

  const topParticipant = stats.participants[0]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-yellow)]/20 via-background to-[var(--wrapped-orange)]/20"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--wrapped-yellow)] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[var(--wrapped-orange)] rounded-full blur-[100px] opacity-20" />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="text-center mb-8">
          <div
            ref={crownRef}
            className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]"
          >
            <Crown className="w-10 h-10 text-background" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            El rey del chat es...
          </h2>
          <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)] bg-clip-text text-transparent">
            {topParticipant?.name || "Desconocido"}
          </p>
          <p className="text-muted-foreground mt-2">
            con {topParticipant?.messageCount.toLocaleString()} mensajes
          </p>
        </div>

        <div ref={barsRef} className="space-y-4">
          {stats.participants.slice(0, 5).map((participant, i) => (
            <div key={participant.name} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? "bg-[var(--wrapped-yellow)] text-background"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium text-foreground">
                    {participant.name}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {participant.messageCount.toLocaleString()} ({Math.round(participant.percentage)}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`progress-bar h-full rounded-full ${
                    i === 0
                      ? "bg-gradient-to-r from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]"
                      : i === 1
                        ? "bg-gradient-to-r from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]"
                        : "bg-gradient-to-r from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]"
                  }`}
                  style={{ width: 0 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
