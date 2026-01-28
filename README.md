# Wrapped Chat  

![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red) ![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![GitHub Stars](https://img.shields.io/github/stars?style=social)  

**Wrapped Chat** is an AI-powered chat analyzer inspired by Spotify Wrapped that transforms your WhatsApp, Telegram, or messaging conversations into beautiful animated statistics and insights.  

Discover conversation trends, emoji usage, most active participants, memorable moments, and much more through an engaging, interactive presentation.  

---

## 🚀 Technologies  

- **Frontend:** ![Next.js 16](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
- **Styling:** ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radixui&logoColor=white)  
- **AI Model:** ![Google Gemini](https://img.shields.io/badge/Google%20Gemini%202.5--Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)  
- **Animation:** ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)  

---

## 📌 Features  

✨ **13 Animated Slides** - Beautiful carousel presentation of chat statistics  
📊 **Comprehensive Analytics** - Messages, words, emojis, active hours, streaks, and more  
🎯 **AI-Generated Insights** - Smart analysis of conversation themes, memorable moments, and fun facts  
🎨 **Spotify Wrapped Style** - Engaging animations and modern design with gradient borders  
⚡ **Real-time Processing** - Upload a chat export and get instant analysis  
🎭 **Personality Analysis** - Chat aura detection and participant personality traits  
🔄 **Interactive Navigation** - Arrow keys, click navigation, and progress indicator  

---

## 📦 Installation and Setup  

### Prerequisites  

Make sure you have installed:  

- **Node.js 18+** and **npm**  
- A **Google Gemini API Key** (get one free at [https://ai.google.dev](https://ai.google.dev))  

### Quick Start  

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/yourusername/wrapped-chat.git
   cd wrapped-chat
   ```

2. **Install dependencies:**  
   ```bash
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env.local` file in the root directory:  
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**  
   ```bash
   npm run dev
   ```

5. **Open in your browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🎮 How to Use  

1. **Export your chat** - Export your WhatsApp, Telegram, or messaging conversation as a text file  
2. **Upload the file** - Use the file upload form on the homepage  
3. **Let AI analyze** - Gemini processes your chat and extracts insights  
4. **Enjoy your results** - Navigate through 13 slides of beautiful statistics and insights  
5. **Share & Save** - Screenshot or save your results  

---

## 📊 Slide Overview  

| Slide | Content |
|-------|---------|
| 1️⃣ **Intro** | Welcome screen with year information |
| 2️⃣ **Total Messages** | Overall message count and statistics |
| 3️⃣ **Top Chatter** | Most active participant |
| 4️⃣ **Top Words** | Cloud of most-used words |
| 5️⃣ **Top Emojis** | Most-used emoji with count |
| 6️⃣ **Conversation Themes** | Main topics discussed |
| 7️⃣ **Memorable Moments** | Narrative of special chat moments |
| 8️⃣ **Chat Aura** | Overall conversation personality |
| 9️⃣ **Active Hours** | When the chat is most active |
| 🔟 **Streak** | Longest message streak |
| 1️⃣1️⃣ **Personalities** | Individual participant traits |
| 1️⃣2️⃣ **Fun Facts** | Interesting chat discoveries |
| 1️⃣3️⃣ **Final Message** | Memorable closing thought |

---

## 🏗️ Project Structure  

```
wrapped-chat/
├── app/
│   ├── api/analyze/         # AI analysis endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── *-slide.tsx          # Individual slide components
│   ├── wrapped-slides.tsx   # Carousel controller
│   ├── file-upload.tsx      # Upload form
│   └── ui/                  # Radix UI components
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── .env.local               # Environment variables (not tracked)
└── package.json             # Dependencies
```

---

## 🔧 Environment Variables  

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key (required) |

---

## 📝 API Endpoint  

**POST** `/api/analyze`

### Request
```json
{
  "chatContent": "Your exported chat text content..."
}
```

### Response
```json
{
  "totalMessages": 1234,
  "topWords": [{"word": "hello", "count": 45}],
  "topEmojis": [{"emoji": "😂", "count": 23}],
  ...
}
```

---

## 🎨 Customization  

### Colors
Edit CSS variables in `app/globals.css`:
```css
--wrapped-pink: #ff006e;
--wrapped-purple: #8338ec;
--wrapped-cyan: #3a86ff;
--wrapped-yellow: #fb5607;
--wrapped-orange: #ffbe0b;
```

### Animation Speed
Modify GSAP animation durations in individual slide components

### Chat Format
Supports exported chats from:
- WhatsApp
- Telegram
- Discord
- Any text-based chat export

---

## 🚀 Performance  

- **Optimized** with Next.js 16 and lazy loading  
- **Smooth animations** powered by GSAP  
- **Responsive design** for all screen sizes  
- **Fast API** responses with Gemini 2.5-Flash  

---

## 📄 License  

This project is **Proprietary**. All rights reserved.

---

## 🤝 Contributing  

Contributions are welcome! Feel free to open issues and pull requests.

---

## 📧 Support  

For issues, questions, or suggestions, please open a GitHub issue or contact the development team.

---

**Made with ❤️ by the development team**
