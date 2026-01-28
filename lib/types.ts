export interface ChatStats {
  totalMessages: number
  totalWords: number
  totalCharacters: number
  participants: {
    name: string
    messageCount: number
    wordCount: number
    percentage: number
  }[]
  topWords: { word: string; count: number }[]
  topEmojis: { emoji: string; count: number }[]
  conversationThemes: { theme: string; percentage: number; description: string }[]
  mostActiveHour: { hour: number; count: number }
  mostActiveDay: { day: string; count: number }
  longestStreak: { days: number; startDate: string; endDate: string }
  averageMessageLength: number
  conversationStarters: { name: string; count: number }[]
  lateNightChatter: { name: string; count: number }
  earlyBird: { name: string; count: number }
  questionAsker: { name: string; count: number }
  laughMaster: { name: string; count: number }
  voiceNoteFan: { name: string; count: number }
  mediaSharer: { name: string; count: number }
  firstMessage: { date: string; author: string; content: string }
  chatDuration: { days: number; months: number; years: number }
  chatAura: { name: string; description: string }
  funFacts: string[]
  artistaTop: { name: string; description: string; emoji: string }
  generoDelAno: { tema: string; porcentaje: number; detalles: string }[]
  cancionRepeat: { palabra: string; significado: string }[]
  momentosMemorables: { titulo: string; historia: string }[]
  fraseFinal: string
}
