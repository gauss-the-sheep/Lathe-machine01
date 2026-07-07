import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMachineStore } from '../store/useMachineStore';

const Workpiece = () => {
  const { workpieceProfile, isRunning, rpm } = useMachineStore();
  const meshRef = useRef();

  // Convert profile array of {x, y} to THREE.Vector2 array required by LatheGeometry
  const points = useMemo(() => {
    return workpieceProfile.map(pt => new THREE.Vector2(pt.x, pt.y));
  }, [workpieceProfile]);

  useFrame((state, delta) => {
    if (isRunning && meshRef.current) {
      const rps = rpm / 60;
      // Rotate around X axis because the LatheGeometry generates around Y by default, 
      // but we will rotate the mesh to align with our machine's X axis (between chuck and tailstock)
      meshRef.current.rotation.x -= (rps * Math.PI * 2 * delta);
    }
  });

  return (
    // Positioned at center (0, 2.5, 0), rotated to lay horizontally along X axis
    // LatheGeometry by default revolves around the local Y axis.
    // Our points have y going from -5 to 5. So we rotate Z by -PI/2 to align local Y with global X.
    <mesh 
      ref={meshRef} 
      position={[0, 2.5, 0]} 
      rotation={[0, 0, -Math.PI / 2]} 
      castShadow 
      receiveShadow
    >
      <latheGeometry args={[points, 64]} />
      <meshStandardMaterial 
        color="#e2e8f0" 
        metalness={0.4} 
        roughness={0.6} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
};

export default Workpiece;
