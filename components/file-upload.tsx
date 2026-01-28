"use client"

import React from "react"

import { useCallback } from "react"
import { Upload, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (content: string) => void
  isLoading: boolean
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.name.endsWith(".txt")) {
        readFile(file)
      }
    },
    [onFileSelect]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        readFile(file)
      }
    },
    [onFileSelect]
  )

  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onFileSelect(content)
    }
    reader.readAsText(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "relative group cursor-pointer",
        "w-full max-w-md aspect-square",
        "rounded-3xl",
        "bg-gradient-to-br from-[var(--wrapped-pink)]/20 via-[var(--wrapped-purple)]/20 to-[var(--wrapped-cyan)]/20",
        "border-2 border-dashed border-[var(--wrapped-pink)]/50",
        "hover:border-[var(--wrapped-pink)] hover:from-[var(--wrapped-pink)]/30 hover:via-[var(--wrapped-purple)]/30 hover:to-[var(--wrapped-cyan)]/30",
        "transition-all duration-500",
        "flex flex-col items-center justify-center gap-6",
        isLoading && "pointer-events-none opacity-50"
      )}
    >
      <input
        type="file"
        accept=".txt"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isLoading}
      />

      <div className="relative">
        <div className="absolute inset-0 bg-[var(--wrapped-pink)] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="relative bg-gradient-to-br from-[var(--wrapped-pink)] to-[var(--wrapped-purple)] p-6 rounded-2xl">
          {isLoading ? (
            <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-foreground" strokeWidth={1.5} />
          )}
        </div>
      </div>

      <div className="text-center px-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          {isLoading ? "Analizando tu chat..." : "Sube tu chat"}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isLoading
            ? "Esto puede tomar unos segundos"
            : "Arrastra o haz clic para subir un archivo .txt"}
        </p>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground/60 text-xs">
        <FileText className="w-4 h-4" />
        <span>WhatsApp, Telegram, o cualquier chat exportado</span>
      </div>
    </div>
  )
}
