import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMachineStore } from '../store/useMachineStore';
import Carriage from './Carriage';
import Workpiece from './Workpiece';

const LatheMachine = () => {
  const { isRunning, rpm, lightOn } = useMachineStore();
  const chuckRef = useRef();

  useFrame((state, delta) => {
    if (isRunning && chuckRef.current) {
      // Rotate chuck based on RPM (Revolutions Per Minute)
      // Math.PI * 2 rads per rev.  RPM / 60 = Revs per sec.
      const rps = rpm / 60;
      chuckRef.current.rotation.x -= (rps * Math.PI * 2 * delta);
    }
  });

  // Materials
  const metalMaterial = <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />;
  const darkMetalMaterial = <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />;
  const highlightMaterial = <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.4} />;

  return (
    <group>
      {lightOn && (
        <spotLight 
          position={[0, 8, 5]} 
          angle={Math.PI / 4} 
          penumbra={0.5} 
          intensity={50} 
          castShadow 
          color="#fbbf24"
          distance={20}
        />
      )}
      
      {/* Machine Bed */}
      <mesh position={[0, -1, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 2, 6]} />
        {metalMaterial}
      </mesh>

      {/* Headstock (Left) */}
      <mesh position={[-9, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 6, 6]} />
        {darkMetalMaterial}
      </mesh>

      {/* Headstock Highlight/Detail */}
      <mesh position={[-9, 5.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.5, 5.8]} />
        {highlightMaterial}
      </mesh>

      {/* Tailstock (Right) */}
      <mesh position={[9, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 5, 4]} />
        {darkMetalMaterial}
      </mesh>
      
      {/* Tailstock Spindle */}
      <mesh position={[7.5, 2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        {metalMaterial}
      </mesh>
      {/* Tailstock Center (Cone) */}
      <mesh position={[6, 2.5, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
        <coneGeometry args={[0.5, 1, 16]} />
        {metalMaterial}
      </mesh>

      {/* Chuck (Attached to Headstock) */}
      <group position={[-6.5, 2.5, 0]} ref={chuckRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2, 1.5, 32]} />
          {metalMaterial}
        </mesh>
        {/* Chuck Jaws */}
        {[0, Math.PI * 2/3, Math.PI * 4/3].map((angle, i) => (
          <mesh key={i} position={[0, Math.sin(angle)*1.5, Math.cos(angle)*1.5]} castShadow>
            <boxGeometry args={[1.6, 0.8, 0.8]} />
            {darkMetalMaterial}
          </mesh>
        ))}
      </group>

      {/* The workpiece itself */}
      <Workpiece />

      {/* The moving carriage holding the cutting tool */}
      <Carriage />

    </group>
  );
};

export default LatheMachine;
