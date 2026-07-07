import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMachineStore } from '../store/useMachineStore';

const Carriage = () => {
  const { carriageZ, carriageX, isRunning, cutMaterial, toolType, coolantOn } = useMachineStore();
  const carriageRef = useRef();
  const toolRef = useRef();

  useFrame(() => {
    // Perform cutting if machine is running
    if (isRunning) {
      // The tool depth is represented by carriageX. 
      // X=0 means resting, far from the workpiece.
      // The workpiece initial radius is 2.5. 
      // We will map carriageX to the tool's actual cutting depth.
      cutMaterial(carriageZ, carriageX);
    }
  });

  const metalMaterial = <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.5} />;
  const toolMaterial = <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />; // Golden carbide insert

  // Base position of carriage on the bed (Y=0.5)
  // X axis of lathe is Z axis in our 3D space, and Z axis of lathe is X axis in 3D space.
  // Wait, let's keep it simple: 
  // Lathe bed runs along X axis? In LatheMachine I made it:
  // Headstock [-9, 2, 0], Tailstock [9, 1.5, 0].
  // So the bed runs along the X axis. 
  // Thus, carriageZ (left/right) is actually movement along X axis in 3D space.
  // And carriageX (depth) is movement along Z axis in 3D space (towards the workpiece).
  // Let's adjust mapping:

  return (
    <group position={[carriageZ, 0.5, 0]} ref={carriageRef}>
      {/* Main Carriage Base */}
      <mesh position={[0, 0, 2]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 6]} />
        {metalMaterial}
      </mesh>

      {/* Cross Slide (Moves based on carriageX) */}
      <group position={[0, 1, 2 - carriageX]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 1, 4]} />
          {metalMaterial}
        </mesh>
        
        {/* Tool Post */}
        <mesh position={[0, 1, -1]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 2, 1.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Cutting Tool */}
        <mesh position={[0, 1.5, -2]} ref={toolRef} castShadow rotation={toolType !== 'square' ? [Math.PI/2, 0, 0] : [0,0,0]}>
          {toolType === 'sharp' ? (
             <coneGeometry args={[0.15, 1, 4]} />
          ) : toolType === 'round' ? (
             <cylinderGeometry args={[0.15, 0.2, 1, 16]} />
          ) : (
             <boxGeometry args={[0.3, 0.2, 1]} />
          )}
          {toolMaterial}
        </mesh>

        {/* Coolant Visual */}
        {coolantOn && isRunning && (
           <mesh position={[0, 1.6, -2.5]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
           </mesh>
        )}
      </group>
    </group>
  );
};

export default Carriage;
