import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface ObstacleProps {
  position: [number, number, number];
  speed?: number;
  index: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ position, speed = 1, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useRef(new THREE.Vector3(...position));
  
  // Use wood texture for obstacles
  const texture = useTexture("/textures/wood.jpg");
  
  // Make sure texture is properly set
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  
  // Movement pattern based on index to create variety
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Different movement patterns based on obstacle index
    if (index % 3 === 0) {
      // Side to side movement
      meshRef.current.position.x = initialPosition.current.x + 
        Math.sin(state.clock.elapsedTime * speed) * 3;
    } else if (index % 3 === 1) {
      // Forward and backward movement
      meshRef.current.position.z = initialPosition.current.z + 
        Math.sin(state.clock.elapsedTime * speed) * 3;
    } else {
      // Circular movement
      meshRef.current.position.x = initialPosition.current.x + 
        Math.sin(state.clock.elapsedTime * speed) * 2;
      meshRef.current.position.z = initialPosition.current.z + 
        Math.cos(state.clock.elapsedTime * speed) * 2;
    }
    
    // Make obstacles rotate to look more interesting
    meshRef.current.rotation.y += delta * speed;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} color="#8B4513" />
    </mesh>
  );
};

export default Obstacle;
