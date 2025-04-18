import { create } from "zustand";
import { getLocalStorage, setLocalStorage } from "../utils";

interface ScoreState {
  score: number;
  highScore: number;
  addScore: (points: number) => void;
  resetScore: () => void;
}

export const useScore = create<ScoreState>((set, get) => ({
  score: 0,
  highScore: getLocalStorage("highScore") || 0,
  
  addScore: (points) => {
    set((state) => {
      const newScore = state.score + points;
      const newHighScore = Math.max(newScore, state.highScore);
      
      // Update high score in local storage if needed
      if (newHighScore > state.highScore) {
        setLocalStorage("highScore", newHighScore);
      }
      
      return { 
        score: newScore,
        highScore: newHighScore
      };
    });
  },
  
  resetScore: () => {
    set((state) => {
      // Keep high score, just reset current score
      return { score: 0 };
    });
  },
}));
