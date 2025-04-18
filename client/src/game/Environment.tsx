import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import Obstacle from "./Obstacle";
import Collectible from "./Collectible";

const Environment: React.FC = () => {
  const { phase } = useGame();
  // Store obstacles and collectibles
  const [obstacles, setObstacles] = useState<Array<{ position: [number, number, number]; speed: number; id: number }>>([]);
  const [collectibles, setCollectibles] = useState<Array<{ position: [number, number, number]; id: number }>>([]);
  const [collectedIds, setCollectedIds] = useState<Set<number>>(new Set());
  
  // Generate obstacles and collectibles when game starts
  useEffect(() => {
    if (phase === "playing") {
      generateEnvironment();
    } else if (phase === "ended") {
      // Clear environment when game ends
      setObstacles([]);
      setCollectibles([]);
      setCollectedIds(new Set());
    }
  }, [phase]);

  // Generate random positions for obstacles and collectibles
  const generateEnvironment = () => {
    const newObstacles: Array<{ position: [number, number, number]; speed: number; id: number }> = [];
    const newCollectibles: Array<{ position: [number, number, number]; id: number }> = [];
    
    // Add 5 obstacles
    for (let i = 0; i < 5; i++) {
      // Generate random position, but make sure it's not too close to player start position (0,0,0)
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 10,
        0.5, // Height
        (Math.random() - 0.5) * 10
      ];
      
      // Make sure obstacles aren't too close to the starting position
      if (Math.abs(position[0]) < 2 && Math.abs(position[2]) < 2) {
        position[0] = position[0] < 0 ? -2 - Math.random() : 2 + Math.random();
        position[2] = position[2] < 0 ? -2 - Math.random() : 2 + Math.random();
      }
      
      newObstacles.push({
        position,
        speed: 0.5 + Math.random(),
        id: i
      });
    }
    
    // Add 10 collectibles
    for (let i = 0; i < 10; i++) {
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 10,
        0.5, // Height
        (Math.random() - 0.5) * 10
      ];
      
      newCollectibles.push({
        position,
        id: i
      });
    }
    
    setObstacles(newObstacles);
    setCollectibles(newCollectibles);
    setCollectedIds(new Set());
  };
  
  // Mark collectible as collected (to be called from collision handler)
  const markCollected = (id: number) => {
    setCollectedIds(prev => new Set([...prev, id]));
  };
  
  // Make our game objects available globally for the collision handler
  useEffect(() => {
    // @ts-ignore - Extend window with our game objects
    window.gameEnvironment = {
      obstacles,
      collectibles,
      markCollected
    };
    
    return () => {
      // @ts-ignore - Clean up
      delete window.gameEnvironment;
    };
  }, [obstacles, collectibles]);

  return (
    <>
      {/* Render obstacles */}
      {obstacles.map((obstacle) => (
        <Obstacle 
          key={`obstacle-${obstacle.id}`}
          position={obstacle.position}
          speed={obstacle.speed}
          index={obstacle.id}
        />
      ))}
      
      {/* Render collectibles */}
      {collectibles.map((collectible) => (
        <Collectible 
          key={`collectible-${collectible.id}`}
          position={collectible.position}
          id={collectible.id}
          isCollected={collectedIds.has(collectible.id)}
        />
      ))}
    </>
  );
};

export default Environment;
