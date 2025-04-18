import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useCollisions } from "./useCollisions";

const Player = () => {
  const playerRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const position = useRef(new THREE.Vector3(0, 0.5, 0));
  const { end } = useGame();
  const { playHit } = useAudio();
  const { checkCollisions } = useCollisions();

  // Get keyboard controls
  const [, getKeys] = useKeyboardControls();

  // Player movement speed
  const SPEED = 5;
  
  // Keep track of movement for debugging
  useEffect(() => {
    console.log("Player component mounted");
    return () => console.log("Player component unmounted");
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Get current keyboard state
    const { forward, backward, leftward, rightward } = getKeys();
    
    // Log controls for debugging
    if (forward || backward || leftward || rightward) {
      console.log("Controls:", { forward, backward, leftward, rightward });
    }

    // Calculate movement direction
    const direction = new THREE.Vector3();
    
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (leftward) direction.x -= 1;
    if (rightward) direction.x += 1;
    
    // Normalize direction vector to ensure consistent speed in all directions
    if (direction.length() > 0) {
      direction.normalize();
    }
    
    // Apply movement
    velocity.current.x = direction.x * SPEED * delta;
    velocity.current.z = direction.z * SPEED * delta;
    
    // Update position
    position.current.x += velocity.current.x;
    position.current.z += velocity.current.z;
    
    // Clamp position to bounds (play area is -5 to 5 on both x and z axes)
    position.current.x = Math.max(-5, Math.min(5, position.current.x));
    position.current.z = Math.max(-5, Math.min(5, position.current.z));
    
    // Apply position to mesh
    playerRef.current.position.copy(position.current);
    
    // Check collisions
    const collision = checkCollisions(position.current);
    
    if (collision) {
      if (collision.type === 'obstacle') {
        // Hit obstacle
        playHit();
        end();
      } else if (collision.type === 'collectible') {
        // Collectible is handled in useCollisions
      }
    }
  });

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="dodgerblue" />
    </mesh>
  );
};

export default Player;
