# 🎤 Voice Chess Pro

> **The future of chess is here** - Play chess with your voice using cutting-edge speech recognition technology!

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Voice_Chess_Pro-brightgreen?style=for-the-badge)](https://play-voice-chess.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## ✨ Features

### 🎙️ **Revolutionary Voice Control**
- **Natural Language Processing**: Say "pawn to e4", "knight to f3", or "castle king side"
- **Smart Move Recognition**: Understands both casual speech and algebraic notation
- **Real-time Audio Feedback**: Announces moves, checks, and game status
- **Multi-language Support**: Works with modern browsers' speech recognition

### 🎨 **Stunning Visual Experience**
- **Chess.com-Inspired Design**: Professional color palette with modern aesthetics
- **Smooth Animations**: Subtle hover effects, floating elements, and transitions
- **Glassmorphism UI**: Beautiful frosted glass panels with backdrop blur
- **Dynamic Backgrounds**: Animated floating orbs that respond to user interaction

### 📱 **Mobile-First Responsive Design**
- **Perfect Mobile Experience**: Optimized for iPhone, Android, and tablet screens
- **Touch + Voice**: Seamlessly switch between drag-and-drop and voice commands
- **Adaptive Board Sizing**: Automatically adjusts to any screen size
- **Gesture-Friendly**: Large buttons and intuitive touch targets

### ♟️ **Advanced Chess Engine**
- **Complete Rule Validation**: Legal move checking, castling, en passant, promotion
- **Game State Detection**: Automatic check, checkmate, stalemate, and draw recognition
- **Move History Tracking**: Beautiful scrollable move log with algebraic notation
- **Interactive Feedback**: Clear error messages for invalid moves

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with Web Speech API support (Chrome, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/teddexter0/play-voice-chess
cd play-voice-chess

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build
```bash
npm run build
npm run start
```

## 🎮 How to Play

### Voice Commands
- **Basic Moves**: "Pawn to e4", "Knight to f3", "Bishop to c4"
- **Castling**: "Castle king side" or "Castle queen side"
- **Direct Notation**: Simply say "e4", "Nf3", "O-O"
- **Natural Speech**: "Move the pawn to e4", "Knight takes on f7"

### Touch/Mouse Controls
- **Drag & Drop**: Click and drag pieces to move them
- **Visual Feedback**: Invalid moves are highlighted with error messages
- **Responsive**: Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with SSR | 15.4.1 |
| **TypeScript** | Type-safe development | 5.0+ |
| **Tailwind CSS** | Utility-first styling | 4.1.11 |
| **chess.js** | Chess game logic & validation | 1.4.0 |
| **react-chessboard** | Interactive chessboard component | 5.2.0 |
| **Web Speech API** | Browser-native voice recognition | Native |

## 🎨 Design Philosophy

Voice Chess Pro combines the classic elegance of chess with cutting-edge web technologies:

- **Minimalist Interface**: Clean, distraction-free design that focuses on gameplay
- **Accessibility First**: Voice control makes chess accessible to users with mobility limitations
- **Performance Optimized**: Smooth 60fps animations with hardware acceleration
- **Professional Aesthetics**: Inspired by chess.com's visual language with modern enhancements

## 📁 Project Structure

```
voice-chess-pro/
├── app/
│   ├── page.tsx          # Main chess game component
│   ├── layout.tsx        # App layout and metadata
│   └── globals.css       # Global styles and animations
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # You are here!
```

## 🌟 Key Components

### VoiceChessGame (`app/page.tsx`)
- Speech recognition integration
- Chess game state management
- Voice command parsing and execution
- Real-time game status updates

### Enhanced Styling (`app/globals.css`)
- Custom animations and transitions
- Responsive design utilities
- Glassmorphism effects
- Chess.com-inspired color palette

## 🔧 Browser Compatibility

| Browser | Voice Support | Touch Support | Recommended |
|---------|---------------|---------------|-------------|
| Chrome 70+ | ✅ Full | ✅ Full | ⭐ Best |
| Safari 14+ | ✅ Full | ✅ Full | ⭐ Best |
| Edge 79+ | ✅ Full | ✅ Full | ✅ Good |
| Firefox | ❌ Limited | ✅ Full | ⚠️ Touch Only |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Test voice commands across different browsers
- Keep animations smooth and purposeful

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[chess.js](https://github.com/jhlywa/chess.js)** - Robust chess game logic
- **[react-chessboard](https://github.com/Clariity/react-chessboard)** - Beautiful React chessboard component
- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **Chess.com** - Design inspiration for the visual aesthetics

## 🔗 Links

- 🌐 **[Live Demo](https://play-voice-chess.vercel.app/)**
- 📚 **[Documentation](https://github.com/teddexter0/play-voice-chess/wiki)**
- 🐛 **[Report Bug](https://github.com/teddexter0/play-voice-chess/issues)**
- 💡 **[Request Feature](https://github.com/teddexter0/play-voice-chess/issues)**

---

<div align="center">

**Built with ❤️ and ☕ by chess enthusiasts, for chess enthusiasts**

[⭐ Star this repo](https://github.com/teddexter0/play-voice-chess) • [🐦 Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20Voice%20Chess%20Pro%20-%20play%20chess%20with%20your%20voice!%20https://play-voice-chess.vercel.app/)

</div>
