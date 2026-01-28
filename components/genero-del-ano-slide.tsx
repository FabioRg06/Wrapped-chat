"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { Zap } from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function GeneroDelAnoSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Icon animation
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        }
      )

      // Icon pulse
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      })

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" }
      )

      // Items animation
      const items = itemsRef.current?.children
      if (items) {
        gsap.fromTo(
          items,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            delay: 0.5,
            ease: "power2.out",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  const colors = [
    "from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]",
    "from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]",
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-orange)]/20 via-background to-[var(--wrapped-yellow)]/20"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--wrapped-orange)] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[var(--wrapped-yellow)] rounded-full blur-[100px] opacity-20" />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="text-center mb-10">
          <div
            ref={iconRef}
            className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-[var(--wrapped-orange)] to-[var(--wrapped-yellow)]"
          >
            <Zap className="w-8 h-8 text-foreground" />
          </div>

          <div ref={titleRef}>
            <h2 className="text-5xl font-black text-foreground mb-2">
              De qué hablaron
            </h2>
            <p className="text-muted-foreground text-sm">
              Los temas principales de la conversación
            </p>
          </div>
        </div>

        <div ref={itemsRef} className="space-y-4">
          {stats.generoDelAno.slice(0, 3).map((tema, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${colors[i % colors.length]} p-[2px] rounded-2xl`}
            >
              <div className="bg-background rounded-[14px] p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-black text-foreground/60 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {tema.tema}
                    </h3>
                    <p className="text-xs leading-relaxed text-foreground/70 whitespace-pre-wrap">
                      {tema.detalles}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
