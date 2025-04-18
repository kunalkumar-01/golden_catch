import React from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const Bounds: React.FC = () => {
  // Use asphalt texture for the boundaries
  const texture = useTexture("/textures/asphalt.png");
  
  // Set texture repeat for tiling effect
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 1);
  
  return (
    <group>
      {/* North wall */}
      <mesh position={[0, 0.5, -10]} receiveShadow>
        <boxGeometry args={[20, 1, 0.5]} />
        <meshStandardMaterial map={texture} color="gray" />
      </mesh>
      
      {/* South wall */}
      <mesh position={[0, 0.5, 10]} receiveShadow>
        <boxGeometry args={[20, 1, 0.5]} />
        <meshStandardMaterial map={texture} color="gray" />
      </mesh>
      
      {/* East wall */}
      <mesh position={[10, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 1, 0.5]} />
        <meshStandardMaterial map={texture} color="gray" />
      </mesh>
      
      {/* West wall */}
      <mesh position={[-10, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 1, 0.5]} />
        <meshStandardMaterial map={texture} color="gray" />
      </mesh>
    </group>
  );
};

export default Bounds;
