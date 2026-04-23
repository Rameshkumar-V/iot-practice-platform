import React, { useState, useLayoutEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import '@wokwi/elements';

const WokwiLed = ({ data }) => {
  const ledRef = useRef(null);
  const [pins, setPins] = useState([]);
  
  // Safe check for React Flow context
  let hasFlowContext = true;
  try { 
    useReactFlow(); 
  } catch (e) { 
    hasFlowContext = false; 
  }

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      if (ledRef.current?.pinInfo?.length > 0) {
        setPins([...ledRef.current.pinInfo]);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hide label if in Navbar preview */}
      {hasFlowContext && (
        <div className="text-[9px] text-zinc-500 font-mono mb-2 uppercase pointer-events-none text-center">
          {data?.label || 'LED'}
        </div>
      )}
      
      <div className="relative flex justify-center pointer-events-none" style={{ width: '40px', height: '50px' }}>
        <wokwi-led 
          ref={ledRef} 
          color={data?.color || 'red'} 
          value={1} 
        />
        
        {/* ONLY render handles if we are inside the actual Canvas */}
        {hasFlowContext && pins.map((pin) => (
          <Handle
            key={pin.name}
            id={pin.name}
            type="bidirectional"
            position={Position.Top}
            style={{
              position: 'absolute',
              left: `${pin.x}px`,
              top: `${pin.y}px`,
              background: '#3b82f6',
              width: 8,
              height: 8,
              transform: 'translate(-50%, -50%)',
              border: '2px solid white',
              zIndex: 100,
              pointerEvents: 'all'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WokwiLed;