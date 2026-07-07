import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import LatheMachine from './LatheMachine';

const Scene = () => {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 8, 20]} fov={45} />
      
      <color attach="background" args={['#0f172a']} />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Environment preset="city" />

      <group position={[0, -2, 0]}>
        <LatheMachine />
        
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={30} 
          blur={2} 
          far={10} 
        />
      </group>

      <OrbitControls 
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={5} 
        maxDistance={30}
      />
    </Canvas>
  );
};

export default Scene;
