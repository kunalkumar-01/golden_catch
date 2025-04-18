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
    if (forward || backward || leftward ||
