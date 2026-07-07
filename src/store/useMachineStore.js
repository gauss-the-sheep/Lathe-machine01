import { create } from 'zustand';

// Generate an initial cylinder profile for the workpiece
// LatheGeometry uses points (Vector2) starting from the bottom (y=0 or negative) to top
const initialRadius = 2.5;
const workpieceLength = 10;
const numSegments = 50;
const initialProfile = [];

for (let i = 0; i <= numSegments; i++) {
  const z = (i / numSegments) * workpieceLength - workpieceLength / 2;
  initialProfile.push({ x: initialRadius, y: z }); 
  // In LatheGeometry, the 'y' coordinate is usually along the axis of rotation
  // so here our z is actually the y for LatheGeometry
}

export const useMachineStore = create((set) => ({
  isRunning: false,
  rpm: 500,
  feedRate: 1,
  carriageZ: 0, // 0 is middle, goes from -workpieceLength/2 to +workpieceLength/2
  carriageX: 0, // 0 is resting, positive moves towards the center (cutting)
  
  workpieceProfile: initialProfile,
  workpieceLength,
  initialRadius,
  
  toolType: 'sharp',
  coolantOn: false,
  lightOn: true,
  
  setToolType: (toolType) => set({ toolType }),
  toggleCoolant: () => set((state) => ({ coolantOn: !state.coolantOn })),
  toggleLight: () => set((state) => ({ lightOn: !state.lightOn })),
  
  toggleMachine: () => set((state) => ({ isRunning: !state.isRunning })),
  setRpm: (rpm) => set({ rpm }),
  setFeedRate: (feedRate) => set({ feedRate }),
  setCarriageZ: (carriageZ) => set({ carriageZ }),
  setCarriageX: (carriageX) => set({ carriageX }),
  
  // Method to perform the cut
  cutMaterial: (toolZ, toolDepth) => set((state) => {
    let hasChanged = false;
    const newProfile = state.workpieceProfile.map((pt) => {
      const zDiff = Math.abs(pt.y - toolZ);
      const toolRadius = state.initialRadius - toolDepth; 
      
      let cutWidth = 0.3; // Default
      let effectiveToolRadius = toolRadius;

      if (state.toolType === 'round') {
        cutWidth = 0.6;
        if (zDiff < cutWidth) {
          effectiveToolRadius = toolRadius + (zDiff * zDiff) * 0.5;
        }
      } else if (state.toolType === 'square') {
        cutWidth = 0.5;
      } else { // 'sharp'
        cutWidth = 0.15;
        if (zDiff < cutWidth) {
          effectiveToolRadius = toolRadius + (zDiff * 1.5);
        }
      }
      
      if (zDiff < cutWidth && effectiveToolRadius < pt.x) {
        hasChanged = true;
        return { ...pt, x: Math.max(0.2, effectiveToolRadius) };
      }
      return pt;
    });
    
    if (!hasChanged) return state; // Return original state if nothing changed
    return { workpieceProfile: newProfile };
  }),
}));
