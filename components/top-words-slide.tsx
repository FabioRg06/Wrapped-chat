"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function TopWordsSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
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

      // Animate words with stagger
      const words = wordsRef.current?.children
      if (words) {
        gsap.fromTo(
          words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: {
              each: 0.05,
              from: "start",
            },
            delay: 0.2,
            ease: "power1.out",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, stats.topWords])

  const maxCount = stats.topWords[0]?.count || 1
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
            Las palabras que mas usaron
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Su vocabulario favorito
          </h2>
        </div>

        <div
          ref={wordsRef}
          className="flex flex-wrap justify-center items-center gap-3"
        >
          {stats.topWords.slice(0, 15).map((item, i) => {
            const size = Math.max(0.6, item.count / maxCount)
            const fontSize = 14 + size * 24

            return (
              <div
                key={item.word}
                className={`px-4 py-2 rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} cursor-default hover:scale-110 transition-transform`}
                style={{
                  fontSize: `${fontSize}px`,
                }}
              >
                <span className="font-bold text-foreground">{item.word}</span>
                <span className="ml-2 text-foreground/70 text-sm">
                  {item.count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
