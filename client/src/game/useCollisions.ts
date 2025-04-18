import { useEffect, useCallback } from "react";
import * as THREE from "three";
import { useScore } from "@/lib/stores/useScore";
import { useAudio } from "@/lib/stores/useAudio";

// Define collision types
type CollisionResult = {
  type: 'obstacle' | 'collectible';
  id?: number;
} | null;

// Custom hook for collision detection
export const useCollisions = () => {
  const { playSuccess } = useAudio();
  const { addScore } = useScore();
  
  // Check collisions between player and obstacles or collectibles
  const checkCollisions = useCallback((playerPosition: THREE.Vector3): CollisionResult => {
    // Player bounding box (assuming player is a 1x1x1 box)
    const playerSize = new THREE.Vector3(0.8, 0.8, 0.8); // Slightly smaller than actual size for better feel
    const playerMin = new THREE.Vector3(
      playerPosition.x - playerSize.x / 2,
      playerPosition.y - playerSize.y / 2,
      playerPosition.z - playerSize.z / 2
    );
    const playerMax = new THREE.Vector3(
      playerPosition.x + playerSize.x / 2,
      playerPosition.y + playerSize.y / 2,
      playerPosition.z + playerSize.z / 2
    );
    
    // Check obstacle collisions
    // @ts-ignore - Access our global game environment
    const obstacles = window.gameEnvironment?.obstacles || [];
    for (const obstacle of obstacles) {
      const obsPos = new THREE.Vector3(...obstacle.position);
      const obsSize = new THREE.Vector3(1, 1, 1);
      
      const obsMin = new THREE.Vector3(
        obsPos.x - obsSize.x / 2,
        obsPos.y - obsSize.y / 2,
        obsPos.z - obsSize.z / 2
      );
      const obsMax = new THREE.Vector3(
        obsPos.x + obsSize.x / 2,
        obsPos.y + obsSize.y / 2,
        obsPos.z + obsSize.z / 2
      );
      
      // AABB collision detection
      if (
        playerMin.x <= obsMax.x && playerMax.x >= obsMin.x &&
        playerMin.y <= obsMax.y && playerMax.y >= obsMin.y &&
        playerMin.z <= obsMax.z && playerMax.z >= obsMin.z
      ) {
        return { type: 'obstacle' };
      }
    }
    
    // Check collectible collisions
    // @ts-ignore - Access our global game environment
    const collectibles = window.gameEnvironment?.collectibles || [];
    for (const collectible of collectibles) {
      const collPos = new THREE.Vector3(...collectible.position);
      const collRadius = 0.3; // Match sphere size in Collectible component
      
      // Distance-based collision for spheres
      const distance = playerPosition.distanceTo(collPos);
      if (distance < (playerSize.x / 2 + collRadius)) {
        // Collectible collision detected
        // @ts-ignore - Access our global game environment
        if (window.gameEnvironment?.markCollected && 
            // @ts-ignore - Check if already collected
            !document.querySelector(`[data-collected-id="${collectible.id}"]`)) {
          // Mark as collected to prevent double collection
          const marker = document.createElement('div');
          marker.setAttribute('data-collected-id', collectible.id.toString());
          marker.style.display = 'none';
          document.body.appendChild(marker);
          
          // @ts-ignore - Mark as collected
          window.gameEnvironment.markCollected(collectible.id);
          
          // Play success sound
          playSuccess();
          
          // Add score
          addScore(10);
          
          return { type: 'collectible', id: collectible.id };
        }
      }
    }
    
    // No collision
    return null;
  }, [playSuccess, addScore]);
  
  // Clean up collision markers when unmounting
  useEffect(() => {
    return () => {
      document.querySelectorAll('[data-collected-id]').forEach(el => el.remove());
    };
  }, []);
  
  return { checkCollisions };
};
