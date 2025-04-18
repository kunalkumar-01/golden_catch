import React from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const Ground: React.FC = () => {
  // Use grass texture for the ground
  const texture = useTexture("/textures/grass.png");
  
  // Set texture repeat for tiling effect
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        map={texture} 
        color="green"
        roughness={0.8}
      />
    </mesh>
  );
};

export default Ground;
