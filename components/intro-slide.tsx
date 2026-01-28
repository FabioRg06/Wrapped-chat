"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { MessageCircle } from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function IntroSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate particles
      const particles = particlesRef.current?.children
      if (particles) {
        gsap.fromTo(
          particles,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.6,
            duration: 1.5,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
          }
        )
        gsap.to(particles, {
          y: "random(-20, 20)",
          x: "random(-20, 20)",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.2,
        })
      }

      // Animate icon
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          delay: 0.3,
          ease: "back.out(1.7)",
        }
      )

      // Animate title with split text effect
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power3.out" }
      )

      // Animate subtitle
      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.8, ease: "power2.out" }
      )

      // Continuous glow animation on icon
      gsap.to(iconRef.current, {
        boxShadow: "0 0 60px var(--wrapped-pink), 0 0 100px var(--wrapped-purple)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-[var(--wrapped-purple)]/10 to-background"
    >
      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, var(--wrapped-pink), var(--wrapped-${["cyan", "purple", "yellow"][i % 3]}))`,
              filter: "blur(40px)",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <div
          ref={iconRef}
          className="p-6 rounded-3xl bg-gradient-to-br from-[var(--wrapped-pink)] to-[var(--wrapped-purple)]"
          style={{ boxShadow: "0 0 40px var(--wrapped-pink)" }}
        >
          <MessageCircle className="w-16 h-16 text-foreground" strokeWidth={1.5} />
        </div>

        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-black text-foreground tracking-tight text-balance"
        >
          Tu Chat
          <span className="block bg-gradient-to-r from-[var(--wrapped-pink)] via-[var(--wrapped-purple)] to-[var(--wrapped-cyan)] bg-clip-text text-transparent">
            Wrapped {new Date().getFullYear() - 1}
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-muted-foreground max-w-md text-pretty"
        >
          {stats.chatDuration.years > 0
            ? `${stats.chatDuration.years} ${stats.chatDuration.years === 1 ? "ano" : "anos"} de conversaciones`
            : stats.chatDuration.months > 0
              ? `${stats.chatDuration.months} ${stats.chatDuration.months === 1 ? "mes" : "meses"} de conversaciones`
              : `${stats.chatDuration.days} dias de conversaciones`}
          {" "}resumidos en segundos
        </p>
      </div>
    </div>
  )
}
