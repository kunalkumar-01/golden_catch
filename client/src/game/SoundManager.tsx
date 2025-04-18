import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useGame } from "@/lib/stores/useGame";

const SoundManager = () => {
  const { backgroundMusic, toggleMute, isMuted } = useAudio();
  const { phase } = useGame();
  
  // Start or stop background music based on game phase
  useEffect(() => {
    if (!backgroundMusic) return;
    
    if (phase === "playing") {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    } else {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    
    return () => {
      backgroundMusic.pause();
    };
  }, [phase, backgroundMusic]);
  
  // Add keyboard shortcut for toggling mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') {
        toggleMute();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute]);
  
  // Add mute button to page
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={toggleMute}
        className="bg-black/70 text-white p-2 rounded-md text-sm"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
};

export default SoundManager;
