import React from 'react';
import Scene from './components/Scene';
import Controls from './components/Controls';
import { useMachineStore } from './store/useMachineStore';
import { Settings, Ruler } from 'lucide-react';
import './index.css';

function App() {
  const { rpm, feedRate, carriageZ, carriageX } = useMachineStore();

  return (
    <div className="app-container">
      {/* 3D Canvas Area */}
      <div className="canvas-container">
        <Scene />
      </div>

      {/* Top Stats Bar */}
      <div className="top-bar glass-panel">
        <div className="stat-item">
          <span className="control-title">Spindle Speed</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--accent-color)" />
            <span className="stat-value">{rpm} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>RPM</span></span>
          </div>
        </div>
        <div className="stat-item">
          <span className="control-title">Feed Rate</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ruler size={20} color="var(--accent-color)" />
            <span className="stat-value">{feedRate.toFixed(1)} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>mm/rev</span></span>
          </div>
        </div>
      </div>

      {/* Main Controls Overlay */}
      <Controls />
    </div>
  );
}

export default App;
