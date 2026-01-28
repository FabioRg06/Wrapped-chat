"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { Sparkles } from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function ChatAuraSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const auraRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )

      // Aura glow animation
      gsap.fromTo(
        auraRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "elastic.out(1, 0.5)"
        }
      )

      // Description animation
      gsap.fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.6, ease: "power2.out" }
      )

      // Continuous sparkle animation
      const sparkles = containerRef.current?.querySelectorAll('.sparkle')
      sparkles?.forEach((sparkle, i) => {
        gsap.to(sparkle, {
          scale: gsap.utils.random(0.8, 1.2),
          opacity: gsap.utils.random(0.3, 0.8),
          duration: gsap.utils.random(1, 2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-purple)]/20 via-background to-[var(--wrapped-pink)]/20"
    >
      {/* Background sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <Sparkles
            key={i}
            className="sparkle absolute text-[var(--wrapped-pink)] opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 12 + Math.random() * 12,
            }}
          />
        ))}
      </div>

      {/* Aura glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-[var(--wrapped-pink)]/20 via-[var(--wrapped-purple)]/10 to-transparent rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        <div ref={titleRef} className="mb-8">
          <p className="text-muted-foreground text-lg mb-2">
            La esencia de su conversación
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Tu Aura de Chat
          </h2>
        </div>

        <div ref={auraRef} className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--wrapped-pink)] via-[var(--wrapped-purple)] to-[var(--wrapped-cyan)] rounded-full blur-2xl opacity-50" />
            <div className="relative bg-gradient-to-r from-[var(--wrapped-pink)] via-[var(--wrapped-purple)] to-[var(--wrapped-cyan)] text-background px-8 py-4 rounded-full text-2xl font-bold shadow-2xl">
              🌈 {stats.chatAura.name}
            </div>
          </div>
        </div>

        <div ref={descriptionRef} className="max-w-lg mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {stats.chatAura.description}
          </p>
        </div>
      </div>
    </div>
  )
}