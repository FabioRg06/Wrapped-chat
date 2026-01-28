"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { ChatStats } from "@/lib/types"
import { IntroSlide } from "./intro-slide"
import { TotalMessagesSlide } from "./total-messages-slide"
import { TopChatterSlide } from "./top-chatter-slide"
import { TopWordsSlide } from "./top-words-slide"
import { TopEmojisSlide } from "./top-emojis-slide"
import { GeneroDelAnoSlide } from "./genero-del-ano-slide"
import { MomentosMemoralesSlide } from "./momentos-memorables-slide"
import { ChatAuraSlide } from "./chat-aura-slide"
import { ActiveHoursSlide } from "./active-hours-slide"
import { StreakSlide } from "./streak-slide"
import { PersonalitiesSlide } from "./personalities-slide"
import { FunFactsSlide } from "./fun-facts-slide"
import { FinalSlide } from "./final-slide"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface WrappedSlidesProps {
  stats: ChatStats
  onRestart: () => void
}

const SLIDES = [
  IntroSlide,
  TotalMessagesSlide,
  TopChatterSlide,
  TopWordsSlide,
  TopEmojisSlide,
  GeneroDelAnoSlide,
  MomentosMemoralesSlide,
  ChatAuraSlide,
  ActiveHoursSlide,
  StreakSlide,
  PersonalitiesSlide,
  FunFactsSlide,
  FinalSlide,
]

export function WrappedSlides({ stats, onRestart }: WrappedSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${((currentSlide + 1) / SLIDES.length) * 100}%`,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [currentSlide])

  const animateSlideTransition = (direction: "next" | "prev") => {
    if (!slideRef.current) return

    const xOffset = direction === "next" ? -100 : 100
    const xStart = direction === "next" ? 100 : -100

    gsap
      .timeline()
      .to(slideRef.current, {
        x: xOffset,
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "power2.in",
      })
      .set(slideRef.current, { x: xStart, scale: 0.9 })
      .to(slideRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      })
  }

  const goToNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      animateSlideTransition("next")
      setTimeout(() => setCurrentSlide((prev) => prev + 1), 400)
    }
  }

  const goToPrev = () => {
    if (currentSlide > 0) {
      animateSlideTransition("prev")
      setTimeout(() => setCurrentSlide((prev) => prev - 1), 400)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") goToNext()
    if (e.key === "ArrowLeft") goToPrev()
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlide])

  const CurrentSlideComponent = SLIDES[currentSlide]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-[var(--wrapped-pink)] via-[var(--wrapped-purple)] to-[var(--wrapped-cyan)]"
          style={{ width: "10%" }}
        />
      </div>

      {/* Slide indicators */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              animateSlideTransition(i > currentSlide ? "next" : "prev")
              setTimeout(() => setCurrentSlide(i), 400)
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-[var(--wrapped-pink)] w-6"
                : i < currentSlide
                  ? "bg-[var(--wrapped-pink)]/50"
                  : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Main slide content */}
      <div
        ref={slideRef}
        className="w-full h-full"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          if (x > rect.width / 2) goToNext()
          else goToPrev()
        }}
      >
        <CurrentSlideComponent
          stats={stats}
          onRestart={onRestart}
          isActive={true}
        />
      </div>

      {/* Navigation buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          goToPrev()
        }}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-all ${
          currentSlide === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          goToNext()
        }}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-all ${
          currentSlide === SLIDES.length - 1
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Touch hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/50 text-xs">
        Toca para avanzar
      </div>
    </div>
  )
}
