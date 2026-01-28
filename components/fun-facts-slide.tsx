"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { Sparkles, Lightbulb } from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function FunFactsSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const factsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      )

      // Facts animation with cool reveal
      const facts = factsRef.current?.children
      if (facts) {
        gsap.fromTo(
          facts,
          { 
            x: (i) => (i % 2 === 0 ? -100 : 100), 
            opacity: 0,
            scale: 0.8,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.4,
            ease: "power3.out",
          }
        )

        // Subtle hover-like pulse on each fact
        Array.from(facts).forEach((fact, i) => {
          gsap.to(fact, {
            scale: 1.02,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3,
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, stats.funFacts])

  const colors = [
    "from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]",
    "from-[var(--wrapped-purple)] to-[var(--wrapped-pink)]",
    "from-[var(--wrapped-orange)] to-[var(--wrapped-yellow)]",
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-yellow)]/10 via-background to-[var(--wrapped-pink)]/10 py-12"
    >
      {/* Background sparkles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-[var(--wrapped-yellow)] opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 16 + Math.random() * 16,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <div ref={titleRef} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)] text-background px-4 py-2 rounded-full mb-4">
            <Lightbulb className="w-5 h-5" />
            <span className="font-bold text-sm">Momentos Memorables</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Recuerdos del chat
          </h2>
        </div>

        <div ref={factsRef} className="space-y-4">
          {stats.funFacts.map((fact, i) => (
            <div
              key={i}
              className={`relative overflow-hidden bg-gradient-to-r ${colors[i % colors.length]} p-[1px] rounded-2xl`}
            >
              <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center text-sm font-bold text-foreground">
                    {i + 1}
                  </span>
                  <p className="text-foreground leading-relaxed">{fact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
