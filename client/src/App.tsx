import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useGame } from "./lib/stores/useGame";
import "@fontsource/inter";

// Import game components
import Player from "./game/Player";
import Ground from "./game/Ground";
import Lights from "./game/Lights";
import Environment from "./game/Environment";
import GameUI from "./game/GameUI";
import Bounds from "./game/Bounds";
import SoundManager from "./game/SoundManager";
import GameOver from "./game/GameOver";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "restart", keys: ["KeyR"] },
];

// Main App component
function App() {
  const { phase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Load audio assets
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    setBackgroundMusic(bgMusic);

    const hit = new Audio("/sounds/hit.mp3");
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    setSuccessSound(success);

    setShowCanvas(true);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          <Canvas
            shadows
            camera={{
              position: [0, 5, 10],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#87CEEB"]} />

            {/* Lighting */}
            <Lights />

            <Suspense fallback={null}>
              {/* Ground and environment elements */}
              <Ground />
              <Environment />
              <Bounds />

              {/* Player only appears in playing state */}
              {phase === "playing" && <Player />}
            </Suspense>
          </Canvas>

          {/* Game UI overlays */}
          <GameUI />
          {phase === "ended" && <GameOver />}
          
          {/* Audio Manager */}
          <SoundManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
