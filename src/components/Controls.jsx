import React from 'react';
import { useMachineStore } from '../store/useMachineStore';
import { Power, Lightbulb, Droplets } from 'lucide-react';

const Controls = () => {
  const {
    isRunning, toggleMachine,
    rpm, setRpm,
    feedRate, setFeedRate,
    carriageZ, setCarriageZ,
    carriageX, setCarriageX,
    workpieceLength,
    toolType, setToolType,
    coolantOn, toggleCoolant,
    lightOn, toggleLight
  } = useMachineStore();

  return (
    <div className="controls-overlay glass-panel">
      {/* Power Section */}
      <div className="control-group">
        <span className="control-title">Main Power</span>
        <button 
          className={`power-btn ${isRunning ? 'on' : 'off'}`}
          onClick={toggleMachine}
        >
          <Power size={24} />
          {isRunning ? 'STOP SPINDLE' : 'START SPINDLE'}
        </button>
      </div>

      {/* Spindle & Feed Controls */}
      <div className="control-group">
        <span className="control-title">Machine Parameters</span>
        
        <div>
          <div className="slider-label">
            <span>Speed (RPM)</span>
            <span>{rpm}</span>
          </div>
          <input 
            type="range" 
            min="100" max="4000" step="50"
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
          />
        </div>

        <div>
          <div className="slider-label">
            <span>Feed Rate</span>
            <span>{feedRate.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="0.1" max="5.0" step="0.1"
            value={feedRate}
            onChange={(e) => setFeedRate(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Axis Controls */}
      <div className="control-group">
        <span className="control-title">Manual Handwheels</span>
        
        <div>
          <div className="slider-label">
            <span>Z-Axis (Carriage Left/Right)</span>
            <div className="dro-display">{carriageZ.toFixed(2)}</div>
          </div>
          <input 
            type="range" 
            min={-workpieceLength/2 - 1} max={workpieceLength/2 + 1} step="0.05"
            value={carriageZ}
            onChange={(e) => setCarriageZ(Number(e.target.value))}
          />
        </div>

        <div>
          <div className="slider-label">
            <span>X-Axis (Cross-Slide Depth)</span>
            <div className="dro-display">{carriageX.toFixed(2)}</div>
          </div>
          <input 
            type="range" 
            min="0" max="2.4" step="0.05"
            value={carriageX}
            onChange={(e) => setCarriageX(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Accessories & Tooling */}
      <div className="control-group">
        <span className="control-title">Accessories & Tooling</span>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`power-btn ${lightOn ? 'on' : ''}`}
            onClick={toggleLight}
            style={{ flex: 1, padding: '0.5rem', backgroundColor: lightOn ? '#fbbf24' : 'transparent', border: '1px solid #fbbf24', color: lightOn ? '#000' : '#fbbf24' }}
          >
            <Lightbulb size={20} />
            Light
          </button>
          
          <button 
            className={`power-btn ${coolantOn ? 'on' : ''}`}
            onClick={toggleCoolant}
            style={{ flex: 1, padding: '0.5rem', backgroundColor: coolantOn ? '#3b82f6' : 'transparent', border: '1px solid #3b82f6', color: coolantOn ? '#fff' : '#3b82f6' }}
          >
            <Droplets size={20} />
            Coolant
          </button>
        </div>
        
        <div>
          <div className="slider-label">
            <span>Cutting Tool Edge</span>
          </div>
          <select 
            value={toolType} 
            onChange={(e) => setToolType(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--panel-bg)', color: 'white', border: '1px solid var(--panel-border)', fontSize: '0.875rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="sharp">Sharp (V-Groove)</option>
            <option value="round">Round Nose</option>
            <option value="square">Square Edge</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Controls;
