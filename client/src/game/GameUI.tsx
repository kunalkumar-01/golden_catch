import React, { useEffect } from "react";
import { useGame } from "@/lib/stores/useGame";
import { useScore } from "@/lib/stores/useScore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GameUI: React.FC = () => {
  const { phase, start, restart } = useGame();
  const { score, highScore } = useScore();

  // Handle game restart with 'R' key 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyR' && phase === 'ended') {
        restart();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, restart]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center p-4">
      {/* Score display (always visible) */}
      <div className="bg-black/70 text-white px-4 py-2 rounded-md mb-4">
        <div className="text-xl font-bold">Score: {score}</div>
        <div className="text-sm">High Score: {highScore}</div>
      </div>
      
      {/* Start screen */}
      {phase === "ready" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-black/80 text-white p-6 rounded-lg text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">Collector Challenge</h1>
            <p className="mb-8">Collect gold orbs while avoiding the moving obstacles. Use WASD or arrow keys to move.</p>
            <Button 
              onClick={start}
              className="pointer-events-auto"
              size="lg"
            >
              Start Game
            </Button>
          </div>
        </div>
      )}
      
      {/* Game instructions (during gameplay) */}
      {phase === "playing" && (
        <div className="mt-auto">
          <div className="bg-black/70 text-white p-3 rounded-md text-sm">
            <p>Move: WASD or Arrow Keys | Collect gold orbs | Avoid wooden obstacles</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
