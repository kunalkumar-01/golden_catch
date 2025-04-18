import React from "react";
import { useScore } from "@/lib/stores/useScore";
import { useGame } from "@/lib/stores/useGame";
import { Button } from "@/components/ui/button";

const GameOver: React.FC = () => {
  const { score, highScore } = useScore();
  const { restart } = useGame();
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 text-white p-8 rounded-lg text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Game Over</h1>
        <div className="mb-6">
          <p className="text-2xl mb-2">Score: {score}</p>
          <p className="text-xl">High Score: {highScore}</p>
        </div>
        <Button 
          onClick={restart}
          className="pointer-events-auto"
          size="lg"
        >
          Play Again
        </Button>
        <p className="mt-4 text-gray-400">Press 'R' to restart</p>
      </div>
    </div>
  );
};

export default GameOver;
