"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function ArtistTopSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Emoji animation
      gsap.fromTo(
        emojiRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        }
      )

      // Emoji bounce
      gsap.to(emojiRef.current, {
        y: -15,
        duration: 1.5,
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

      // Description animation
      gsap.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: "power2.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  const artist = stats.artistaTop

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-pink)]/20 via-background to-[var(--wrapped-purple)]/20"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--wrapped-pink)] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[var(--wrapped-purple)] rounded-full blur-[100px] opacity-20" />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="text-center mb-8">
          <div
            ref={emojiRef}
            className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]"
          >
            <span className="text-6xl">{artist.emoji}</span>
          </div>

          <div ref={titleRef}>
            <h2 className="text-5xl font-black text-foreground mb-2">
              Tu Artista Top
            </h2>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]">
              {artist.name}
            </p>
          </div>
        </div>

        <div ref={descRef} className="text-center">
          <p className="text-lg leading-relaxed text-foreground/80 mb-6">
            {artist.description}
          </p>
        </div>
      </div>
    </div>
  )
}
