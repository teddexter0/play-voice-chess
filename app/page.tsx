'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

// Voice recognition interface
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [lastMove, setLastMove] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsVoiceSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.language = 'en-US';
        
        synthRef.current = window.speechSynthesis;
      }
    }
  }, []);

  // Speech synthesis function
  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    }
  }, []);

  // Parse voice commands to chess notation
  const parseVoiceMove = useCallback((command: string): string | null => {
    const cleanCommand = command.toLowerCase().trim();
    
    // Handle castling
    if (cleanCommand.includes('castle king') || cleanCommand.includes('short castle')) {
      return 'O-O';
    }
    if (cleanCommand.includes('castle queen') || cleanCommand.includes('long castle')) {
      return 'O-O-O';
    }
    
    // Convert spoken notation to algebraic notation
    const pieceMap: { [key: string]: string } = {
      'king': 'K',
      'queen': 'Q',
      'rook': 'R',
      'bishop': 'B',
      'knight': 'N',
      'pawn': ''
    };
    
    // Handle moves like "pawn to e4", "knight to f3", etc.
    const movePattern = /(?:(king|queen|rook|bishop|knight|pawn)\s+)?(?:to\s+)?([a-h][1-8])/i;
    const match = cleanCommand.match(movePattern);
    
    if (match) {
      const piece = match[1] ? pieceMap[match[1]] || '' : '';
      const square = match[2];
      return piece + square;
    }
    
    // Direct algebraic notation (e.g., "e4", "Nf3")
    const directPattern = /^([KQRBN]?[a-h][1-8]|O-O(-O)?)$/i;
    if (directPattern.test(cleanCommand)) {
      return cleanCommand;
    }
    
    return null;
  }, []);

  // Make move function
  const makeMove = useCallback((moveString: string) => {
    try {
      const newGame = new Chess(fen);
      const move = newGame.move(moveString);
      
      if (move) {
        setGame(newGame);
        setFen(newGame.fen());
        setMoveHistory(prev => [...prev, move.san]);
        setCurrentTurn(newGame.turn() === 'w' ? 'white' : 'black');
        setLastMove(move.san);
        setError('');
        
        // Announce the move
        speak(`${move.san}`);
        
        // Check game status
        if (newGame.isCheckmate()) {
          setGameStatus('checkmate');
          speak(`Checkmate! ${currentTurn} wins!`);
        } else if (newGame.isCheck()) {
          setGameStatus('check');
          speak('Check!');
        } else if (newGame.isStalemate()) {
          setGameStatus('stalemate');
          speak('Stalemate! The game is a draw.');
        } else if (newGame.isDraw()) {
          setGameStatus('draw');
          speak('The game is a draw.');
        } else {
          setGameStatus('playing');
        }
      } else {
        setError('Invalid move. Please try again.');
        speak('Invalid move. Please try again.');
      }
    } catch {
      setError('Invalid move format. Please try again.');
      speak('Invalid move. Please try again.');
    }
  }, [fen, currentTurn, speak, parseVoiceMove]);

  // Handle voice recognition
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setIsListening(true);
    setError('');
    recognitionRef.current.onerror = () => {
  setIsListening(false);
};
recognitionRef.current.onend = () => {
  setIsListening(false);
};

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
  const spokenWords = event.results[event.resultIndex][0].transcript;
  setTranscript(spokenWords);

  const moveString = parseVoiceMove(spokenWords);
  if (!moveString) {
    setError('Could not understand move. Please try again.');
    speak('Could not understand move. Please try again.');
    recognitionRef.current?.stop();           // ✅ STOP here
    setIsListening(false);                    // ✅ and stop flag
    return;
  }

  try {
    const newGame = new Chess(fen);
    const move = newGame.move(moveString);

    if (move) {
      setGame(newGame);
      setFen(newGame.fen());
      setMoveHistory(prev => [...prev, move.san]);
      setCurrentTurn(newGame.turn() === 'w' ? 'white' : 'black');
      setLastMove(move.san);
      setError('');
      speak(`${move.san}`);

      if (newGame.isCheckmate()) {
        setGameStatus('checkmate');
        speak(`Checkmate! ${currentTurn === 'white' ? 'Black' : 'White'} wins!`);
      } else if (newGame.isCheck()) {
        setGameStatus('check');
        speak('Check!');
      } else if (newGame.isStalemate()) {
        setGameStatus('stalemate');
        speak('Stalemate! The game is a draw.');
      } else if (newGame.isDraw()) {
        setGameStatus('draw');
        speak('The game is a draw.');
      } else {
        setGameStatus('playing');
      }
    } else {
      setError('Invalid move. Please try again.');
      speak('Invalid move. Please try again.');
    }
  } catch {
    setError('Invalid move format. Please try again.');
    speak('Invalid move. Please try again.');
  }

  recognitionRef.current?.stop();         // ✅ STOP AFTER everything
  setIsListening(false);                  // ✅ Update flag
};

// ✅ Only start listening here
recognitionRef.current.start();
  }, [fen, currentTurn, speak]);

  // Handle piece drop for touch/mouse interaction (using your original API)
  function onDrop(sourceSquare: string, targetSquare: string) {
    const newGame = new Chess(fen);
    const move = newGame.move({ 
      from: sourceSquare, 
      to: targetSquare, 
      promotion: "q" 
    });
    
    if (move) {
      setGame(newGame);
      setFen(newGame.fen());
      setMoveHistory(prev => [...prev, move.san]);
      setCurrentTurn(newGame.turn() === 'w' ? 'white' : 'black');
      setLastMove(move.san);
      setError('');
      
      // Check game status
      if (newGame.isCheckmate()) {
        setGameStatus('checkmate');
        speak(`Checkmate! ${currentTurn === 'white' ? 'Black' : 'White'} wins!`);
      } else if (newGame.isCheck()) {
        setGameStatus('check');
        speak('Check!');
      } else if (newGame.isStalemate()) {
        setGameStatus('stalemate');
        speak('Stalemate!');
      } else if (newGame.isDraw()) {
        setGameStatus('draw');
        speak('Draw!');
      } else {
        setGameStatus('playing');
      }
      
      return true;
    } else {
      setError("Invalid move! It's not your turn or that move is illegal.");
      return false;
    }
  }

  // Reset game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setCurrentTurn('white');
    setGameStatus('playing');
    setLastMove('');
    setError('');
    setTranscript('');
    speak('New game started. White to move.');
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'check': return 'text-red-500';
      case 'checkmate': return 'text-red-600';
      case 'stalemate':
      case 'draw': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'check': return `${currentTurn} is in check!`;
      case 'checkmate': return `Checkmate! ${currentTurn === 'white' ? 'Black' : 'White'} wins!`;
      case 'stalemate': return 'Stalemate - Draw!';
      case 'draw': return 'Draw!';
      default: return `${currentTurn}'s turn`;
    }
  };

  // Chessboard options object (matching your original structure)
  const chessboardOptions = {
    position: fen,
    onPieceDrop: onDrop,
    boardWidth: Math.min(400, typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, window.innerHeight - 200) : 400),
    customBoardStyle: {
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(16, 185, 129, 0.2)',
    },
    customDarkSquareStyle: { backgroundColor: '#769656' },
    customLightSquareStyle: { backgroundColor: '#eeeed2' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-2 sm:p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-400/3 rounded-full blur-3xl animate-drift"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent mb-4 animate-gradient bg-size-200">
            Voice Chess Pro
          </h1>
          <p className="text-slate-300 text-base sm:text-lg animate-fade-in-up">
            Play chess with your voice - just speak your moves!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Chess Board */}
          <div className="lg:col-span-3 order-1">
            <div className="board-container bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-3 sm:p-6 shadow-2xl border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-500 animate-fade-in">
              <div className="flex justify-center items-center">
                <div className="chess-board-wrapper relative">
                  <Chessboard {...chessboardOptions} />
                  {/* Subtle glow effect around board */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl -z-10 animate-pulse-glow"></div>
                </div>
              </div>
              
              {/* Game Status */}
              <div className="mt-4 sm:mt-6 text-center animate-slide-up">
                <div className={`text-xl sm:text-2xl font-bold ${getStatusColor()} mb-2 transition-all duration-300`}>
                  {getStatusMessage()}
                </div>
                {lastMove && (
                  <div className="text-slate-300 animate-fade-in">
                    Last move: <span className="font-mono text-emerald-400 bg-slate-800/50 px-2 py-1 rounded-lg">{lastMove}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10 order-2">
            {/* Voice Control */}
            <div className="control-panel bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-500/20 hover:border-teal-400/30 transition-all duration-500 animate-fade-in-right mb-4">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl animate-bounce-subtle">🎤</span>
                Voice Control
              </h3>
              
              {!isVoiceSupported ? (
                <div className="text-red-300 text-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                  Voice recognition not supported in your browser
                </div>
              ) : (
                <>
                  <button
                    onClick={startListening}
                    disabled={isListening || gameStatus === 'checkmate'}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-500 transform ${
                      isListening
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse-red scale-105 shadow-red-500/25'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 hover:scale-105 shadow-emerald-500/25'
                    } text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:shadow-2xl`}
                  >
                    {isListening ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
                        Listening...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        🎙️ Speak Your Move
                      </span>
                    )}
                  </button>
                  
                  {transcript && (
                    <div className="mt-4 p-3 bg-slate-800/70 rounded-xl border border-slate-700/50 animate-slide-up">
                      <div className="text-slate-400 text-xs sm:text-sm">You said:</div>
                      <div className="text-white font-mono text-sm sm:text-base">{transcript}</div>
                    </div>
                  )}
                </>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm animate-shake">
                  {error}
                </div>
              )}
              
            </div>
 
            {/* Game Controls */}
            <div className="control-panel bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl px-7 py-8 shadow-2xl border border-amber-500/20 hover:border-amber-400/30 transition-all duration-500 animate-fade-in-right animation-delay-200 flex flex-col items-center space-y-6 mb-4">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3 w-full justify-center">
                <span className="text-2xl animate-spin-slow">⚙️</span>
                Controls
              </h3>
              <div className="mt-6 text-slate-300 text-sm sm:text-base">
                <div className="font-bold mb-3 text-teal-400">Voice Commands:</div>
                <div className="space-y-2 font-serif">
                  <div>• &quot;Pawn to e4&quot;</div>
                  <div>• &quot;Knight to f3&quot;</div>
                  <div>• &quot;Castle king side&quot;</div>
                  <div>• Or just say: &quot;e4&quot;</div>
                </div>
              </div>
              <button
                onClick={resetGame}
                className="w-full max-w-xs py-5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin-slow">🔄</span>
                  New Game
                </span>
              </button>
            </div>

            {/* Move History */}
            {/* Divider for mobile clarity */}
            <div className="block sm:hidden w-full h-2 my-2 bg-gradient-to-r from-emerald-500/10 via-slate-500/10 to-amber-500/10 rounded-full"></div>
            <div className="control-panel bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-500/20 hover:border-slate-400/30 transition-all duration-500 animate-fade-in-right animation-delay-400">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📜</span>
                Move History
              </h3>
              <div className="max-h-32 sm:max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                {moveHistory.length === 0 ? (
                  <div className="text-slate-400 text-center py-4 text-sm">No moves yet</div>
                ) : (
                  moveHistory.map((move, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-slate-800/40 rounded-lg hover:bg-slate-700/40 transition-all duration-300 animate-slide-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-slate-400 text-xs sm:text-sm">
                        {Math.floor(index / 2) + 1}.{index % 2 === 0 ? '' : '..'}
                      </span>
                      <span className="font-mono text-emerald-400 text-sm">{move}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
