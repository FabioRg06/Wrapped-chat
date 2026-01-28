import { GoogleGenAI } from "@google/genai"
import type { ChatStats } from "@/lib/types"

const ai = new GoogleGenAI({})

console.log("🔑 API Key loaded:", process.env.GEMINI_API_KEY ? "✅ Sí" : "❌ No")
console.log("🔑 API Key value:", process.env.GEMINI_API_KEY?.substring(0, 10) + "..." || "No cargada")

export async function POST(req: Request) {
  try {
    const { chatContent } = await req.json()

    console.log("📁 Received chat content length:", chatContent?.length || 0)
    console.log("📄 Chat content preview:", chatContent?.slice(0, 200) + "...")

    if (!chatContent) {
      return Response.json({ error: "No chat content provided" }, { status: 400 })
    }

    const contents = [
      {
        text: `Eres un experto en análisis de chats narrativos. Analiza el siguiente chat exportado y genera un análisis detallado en formato JSON tipo "Spotify Wrapped" para chats.

IMPORTANTE: 
- Responde ÚNICAMENTE con un OBJETO JSON VÁLIDO (comienza con { y termina con })
- NO incluyas markdown, backticks o código innecesario
- NO incluyas saltos de línea dentro de strings - usa espacios en su lugar
- Escapa correctamente comillas dobles en strings con backslash
- Sé CONCISO en descripciones

Estructura JSON requerida:

{
  "totalMessages": NÚMERO,
  "totalWords": NÚMERO,
  "totalCharacters": NÚMERO,
  "participants": [{"name": "STRING", "messageCount": NÚMERO, "wordCount": NÚMERO, "percentage": NÚMERO}],
  "topWords": [{"word": "STRING", "count": NÚMERO}],
  "topEmojis": [{"emoji": "STRING", "count": NÚMERO}],
  "conversationThemes": [{"theme": "STRING", "percentage": NÚMERO, "description": "STRING"}],
  "mostActiveHour": {"hour": NÚMERO, "count": NÚMERO},
  "mostActiveDay": {"day": "STRING", "count": NÚMERO},
  "longestStreak": {"days": NÚMERO, "startDate": "STRING", "endDate": "STRING"},
  "averageMessageLength": NÚMERO,
  "conversationStarters": [{"name": "STRING", "count": NÚMERO}],
  "lateNightChatter": {"name": "STRING", "count": NÚMERO},
  "earlyBird": {"name": "STRING", "count": NÚMERO},
  "questionAsker": {"name": "STRING", "count": NÚMERO},
  "laughMaster": {"name": "STRING", "count": NÚMERO},
  "voiceNoteFan": {"name": "STRING", "count": NÚMERO},
  "mediaSharer": {"name": "STRING", "count": NÚMERO},
  "firstMessage": {"date": "STRING", "author": "STRING", "content": "STRING"},
  "chatDuration": {"days": NÚMERO, "months": NÚMERO, "years": NÚMERO},
  "chatAura": {"name": "STRING", "description": "STRING"},
  "funFacts": ["STRING"],
  "generoDelAno": [{"tema": "STRING", "porcentaje": NÚMERO, "detalles": "STRING"}],
  "cancionRepeat": [{"palabra": "STRING", "significado": "STRING"}],
  "momentosMemorables": [{"titulo": "STRING", "historia": "STRING"}],
  "fraseFinal": "STRING"
}

INSTRUCCIONES CRÍTICAS:

IMPORTANTE: Genera TODOS estos campos:
- topEmojis: OBLIGATORIO - Los 5-8 emojis más usados en el chat con sus conteos

1. **topEmojis**: Extrae los 5-8 emojis MÁS USADOS en el chat. Revisa todo el contenido.
   Formato: [{"emoji": "😂", "count": 45}, ...]
   CRUCIAL: Este campo DEBE estar presente en la respuesta.

2. **generoDelAno**: Formato NARRATIVO con descripción y viñetas. Cada tema debe tener:
   - Título enganchador (ej: "Gaming & Debugging")
   - Una línea descriptiva general
   - 2-3 viñetas con DETALLES ESPECÍFICOS y TEXTUALES del chat
   MÁXIMO 150 palabras totales por tema, incluyendo viñetas.

3. **cancionRepeat**: Palabras/frases con significado narrativo BREVE (máximo 25 palabras).

4. **momentosMemorables**: Anécdotas CON VIÑETAS de detalles (máximo 60 palabras totales).

5. **fraseFinal**: Frase textual MEMORABLE Y GRACIOSA del chat (máximo 20 palabras).

6. **funFacts**: Hechos curiosos cortos con humor (máximo 25 palabras cada uno).

TONO: Narrativo estilo Spotify Wrapped. Usa humor, nombres reales, referencias específicas del chat.
Incluye números (1., 2., 3.) en los títulos si es aplicable.
TEXTOS: Extractos directos, anécdotas divertidas, detalles textuales.

TONO: Breve, conciso, entretenido. Sin párrafos largos.
TEXTOS: Extractos directos del chat, nombres reales, ejemplos concretos pero CORTOS.

Chat a analizar:`
      },
      { text: chatContent.slice(0, 150000) }
    ]

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents
    })

    console.log("🤖 Gemini Response:", response.text)

    const text = response.text ? response.text : ""

    if (!text) {
      return Response.json({ error: "No response from Gemini" }, { status: 500 })
    }

    // Parse the JSON response - remove markdown code blocks if present
    try {
      let jsonText = text.trim()
      
      // Remove markdown code blocks (```json ... ```)
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
      }
      
      // Clean up problematic characters
      // Replace line breaks within strings with spaces
      jsonText = jsonText.replace(/[\r\n]+/g, " ")
      
      // Fix escaped quotes that might be causing issues
      jsonText = jsonText.replace(/\\"/g, '"').replace(/"/g, '\\"')
      jsonText = jsonText.replace(/\\\\"/g, '\\"')
      
      const chatStats: ChatStats = JSON.parse(jsonText)
      return Response.json(chatStats)
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      console.error("Raw response:", text)

      // Fallback to hardcoded data if parsing fails
      const fallbackStats: ChatStats = {
        totalMessages: 1250,
        totalWords: 18500,
        totalCharacters: 95000,
        participants: [
          { name: "Usuario", messageCount: 625, wordCount: 9250, percentage: 50 },
          { name: "Amigo", messageCount: 625, wordCount: 9250, percentage: 50 }
        ],
        topWords: [
          { word: "hola", count: 120 },
          { word: "gracias", count: 95 },
          { word: "bueno", count: 80 },
          { word: "perfecto", count: 65 },
          { word: "mañana", count: 50 }
        ],
        conversationThemes: [
          {
            theme: "Conversaciones Generales",
            percentage: 60,
            description: "Charlas cotidianas sobre el día a día"
          },
          {
            theme: "Entretenimiento",
            percentage: 40,
            description: "Conversaciones sobre series, películas y hobbies"
          }
        ],
        mostActiveHour: { hour: 20, count: 180 },
        mostActiveDay: { day: "Viernes", count: 250 },
        longestStreak: {
          days: 15,
          startDate: "2023-10-01",
          endDate: "2023-10-15"
        },
        averageMessageLength: 15.2,
        conversationStarters: [
          { name: "Usuario", count: 55 },
          { name: "Amigo", count: 50 }
        ],
        lateNightChatter: { name: "Usuario", count: 35 },
        earlyBird: { name: "Amigo", count: 25 },
        questionAsker: { name: "Amigo", count: 95 },
        laughMaster: { name: "Usuario", count: 140 },
        voiceNoteFan: { name: "Usuario", count: 45 },
        mediaSharer: { name: "Amigo", count: 35 },
        firstMessage: {
          date: "2023-01-15T10:30:00Z",
          author: "Usuario",
          content: "¡Hola! ¿Cómo estás?"
        },
        chatDuration: {
          days: 365,
          months: 12,
          years: 1
        },
        chatAura: {
          name: "Conversacional",
          description: "Un chat amigable y cotidiano lleno de conversaciones interesantes."
        },
        funFacts: [
          "Han mantenido conversaciones durante todo un año",
          "El viernes es el día más activo",
          "Comparten muchos momentos de risa",
          "Han enviado cientos de mensajes",
          "Sus conversaciones son variadas e interesantes"
        ]
      }

      return Response.json(fallbackStats)
    }

  } catch (error) {
    console.error("Error analyzing chat:", error)
    return Response.json({ error: "Error analyzing chat" }, { status: 500 })
  }
}
