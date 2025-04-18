import React from "react";

const Lights: React.FC = () => {
  return (
    <>
      {/* Key light (main directional light) */}
      <directionalLight
        castShadow
        position={[10, 10, 5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light (softer light from opposite side) */}
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
      {/* Ambient light to provide base illumination */}
      <ambientLight intensity={0.3} />
    </>
  );
};

export default Lights;
