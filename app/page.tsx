'use client';

import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());

  function onDrop({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) {
    if (!targetSquare) return false;
    const newGame = new Chess(fen);
    const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (move) {
      setGame(newGame);
      setFen(newGame.fen());
    }
    return !!move;
  }
  
  const chessboardOptions = {
    position: fen,
    onPieceDrop: onDrop,
    boardWidth: 400,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Hello Chess Voice!</h1>
      <Chessboard options={chessboardOptions} />
    </div>
  );
}
