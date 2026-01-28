"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import {
  MessageCircleQuestion,
  Laugh,
  Moon,
  Sun,
  Mic,
  ImageIcon,
  Sparkles,
} from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function PersonalitiesSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      )

      // Cards animation
      const cards = cardsRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, rotateX: -30 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.12,
            delay: 0.3,
            ease: "back.out(1.5)",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  const personalities = [
    {
      title: "El Preguntador",
      icon: MessageCircleQuestion,
      name: stats.questionAsker.name,
      value: `${stats.questionAsker.count} preguntas`,
      color: "wrapped-cyan",
      gradient: "from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]",
    },
    {
      title: "El Risitas",
      icon: Laugh,
      name: stats.laughMaster.name,
      value: `${stats.laughMaster.count} risas`,
      color: "wrapped-yellow",
      gradient: "from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)]",
    },
    ...(stats.lateNightChatter
      ? [
          {
            title: "El Noctambulo",
            icon: Moon,
            name: stats.lateNightChatter.name,
            value: `${stats.lateNightChatter.count} mensajes nocturnos`,
            color: "wrapped-purple",
            gradient: "from-[var(--wrapped-purple)] to-[var(--wrapped-pink)]",
          },
        ]
      : []),
    ...(stats.earlyBird
      ? [
          {
            title: "El Madrugador",
            icon: Sun,
            name: stats.earlyBird.name,
            value: `${stats.earlyBird.count} mensajes tempranos`,
            color: "wrapped-orange",
            gradient: "from-[var(--wrapped-orange)] to-[var(--wrapped-yellow)]",
          },
        ]
      : []),
    ...(stats.conversationStarters[0]
      ? [
          {
            title: "El Iniciador",
            icon: Sparkles,
            name: stats.conversationStarters[0].name,
            value: `${stats.conversationStarters[0].count} conversaciones iniciadas`,
            color: "wrapped-pink",
            gradient: "from-[var(--wrapped-pink)] to-[var(--wrapped-cyan)]",
          },
        ]
      : []),
    ...(stats.voiceNoteFan
      ? [
          {
            title: "El Fan de Notas de Voz",
            icon: Mic,
            name: stats.voiceNoteFan.name,
            value: `${stats.voiceNoteFan.count} notas de voz`,
            color: "wrapped-cyan",
            gradient: "from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]",
          },
        ]
      : []),
    ...(stats.mediaSharer
      ? [
          {
            title: "El Rey de los Stickers",
            icon: ImageIcon,
            name: stats.mediaSharer.name,
            value: `${stats.mediaSharer.count} stickers enviados`,
            color: "wrapped-purple",
            gradient: "from-[var(--wrapped-purple)] to-[var(--wrapped-pink)]",
          },
        ]
      : []),
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-pink)]/20 via-background to-[var(--wrapped-purple)]/20 py-16"
    >
      {/* Background decorations */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--wrapped-pink)] rounded-full blur-[140px] opacity-20" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[var(--wrapped-purple)] rounded-full blur-[120px] opacity-20" />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div ref={titleRef} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Personalidades del chat
          </h2>
          <p className="text-muted-foreground">
            Cada uno tiene su rol especial
          </p>
        </div>

        <div ref={cardsRef} className="space-y-4">
          {personalities.map((personality) => {
            const Icon = personality.icon
            return (
              <div
                key={personality.title}
                className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 hover:scale-[1.02] transition-transform cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${personality.gradient}`}
                  >
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {personality.title}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {personality.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium text-[var(--${personality.color})]`}
                    >
                      {personality.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
