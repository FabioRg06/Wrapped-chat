"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { Clock, Sun, Moon, Sunrise, Sunset } from "lucide-react"

interface SlideProps {
  stats: ChatStats
  onRestart: () => void
  isActive: boolean
}

export function ActiveHoursSlide({ stats, isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate clock icon with rotation
      gsap.fromTo(
        clockRef.current,
        { scale: 0, rotation: -360 },
        {
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
        }
      )

      // Animate time display
      gsap.fromTo(
        timeRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: "power2.out" }
      )

      // Animate day display
      gsap.fromTo(
        dayRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.6, ease: "power2.out" }
      )

      // Clock pulse
      gsap.to(clockRef.current, {
        boxShadow: "0 0 80px var(--wrapped-cyan)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  const hour = stats.mostActiveHour.hour
  const getTimeOfDay = () => {
    if (hour >= 6 && hour < 12) return { icon: Sunrise, label: "Manana", color: "wrapped-yellow" }
    if (hour >= 12 && hour < 18) return { icon: Sun, label: "Tarde", color: "wrapped-orange" }
    if (hour >= 18 && hour < 22) return { icon: Sunset, label: "Noche", color: "wrapped-purple" }
    return { icon: Moon, label: "Madrugada", color: "wrapped-cyan" }
  }

  const timeOfDay = getTimeOfDay()
  const TimeIcon = timeOfDay.icon

  const formatHour = (h: number) => {
    const period = h >= 12 ? "PM" : "AM"
    const hour12 = h % 12 || 12
    return `${hour12}:00 ${period}`
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--wrapped-cyan)]/20 via-background to-[var(--wrapped-purple)]/20"
    >
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[var(--wrapped-cyan)] rounded-full blur-[150px] opacity-20" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <p className="text-muted-foreground text-lg">
          Sus conversaciones mas activas son...
        </p>

        <div
          ref={clockRef}
          className="relative p-8 rounded-full bg-gradient-to-br from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)]"
          style={{ boxShadow: "0 0 40px var(--wrapped-cyan)" }}
        >
          <Clock className="w-20 h-20 text-foreground" strokeWidth={1.5} />
        </div>

        <div ref={timeRef} className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <TimeIcon className={`w-8 h-8 text-[var(--${timeOfDay.color})]`} />
            <span className="text-xl text-muted-foreground">{timeOfDay.label}</span>
          </div>
          <p className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[var(--wrapped-cyan)] to-[var(--wrapped-purple)] bg-clip-text text-transparent">
            {formatHour(hour)}
          </p>
          <p className="text-muted-foreground">
            {stats.mostActiveHour.count.toLocaleString()} mensajes a esta hora
          </p>
        </div>

        <div
          ref={dayRef}
          className="mt-4 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6"
        >
          <p className="text-muted-foreground text-sm mb-2">Dia mas activo</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-[var(--wrapped-yellow)] to-[var(--wrapped-orange)] bg-clip-text text-transparent">
            {stats.mostActiveDay.day}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            {stats.mostActiveDay.count.toLocaleString()} mensajes
          </p>
        </div>
      </div>
    </div>
  )
}
