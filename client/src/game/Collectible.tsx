import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CollectibleProps {
  position: [number, number, number];
  id: number;
  isCollected: boolean;
}

const Collectible: React.FC<CollectibleProps> = ({ position, id, isCollected }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate the collectible
  useFrame((state) => {
    if (!meshRef.current || isCollected) return;
    
    // Hover and rotate effect
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.rotation.y += 0.01;
  });

  // Don't render if collected
  if (isCollected) return null;

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="gold" emissive="orange" emissiveIntensity={0.5} />
    </mesh>
  );
};

export default Collectible;
