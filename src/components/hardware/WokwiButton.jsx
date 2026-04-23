import React, { useLayoutEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { registerComponentBlueprint } from '@/store/registrySlice';
import { updatePinSignal } from '@/store/workspaceSlice';
import '@wokwi/elements';

const WokwiButton = ({ id, data, isPreview = false }) => {
  const dispatch = useDispatch();
  const btnRef = useRef(null);
  const [pins, setPins] = useState([]);

  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    let attempts = 0;
    const poll = setInterval(() => {
      // Logic: Wait until pins are defined and the button has a real width in the DOM
      if (el.pinInfo && el.pinInfo.length > 0 && el.offsetWidth > 0) {
        setPins([...el.pinInfo]);
        
        if (!isPreview) {
          dispatch(registerComponentBlueprint({
            type: 'hardwareButton',
            tagName: 'wokwi-pushbutton',
            name: 'Push Button',
            category: 'INPUT',
            pins: el.pinInfo // Capture exact X/Y for this specific element
          }));
        }
        clearInterval(poll);
      }
      if (attempts++ > 40) clearInterval(poll);
    }, 100);

    return () => clearInterval(poll);
  }, [dispatch, isPreview]);

  // Handle Signal Emission
  const handleAction = (val) => {
    if (isPreview) return;
    // Pin '1' is typically the output pin for Wokwi buttons
    dispatch(updatePinSignal({ 
      nodeId: id, 
      pinName: '1', 
      signalValue: val 
    }));
  };

  return (
    <div className={`relative ${isPreview ? '' : 'p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl'}`}>
      <div className="relative inline-block">
        <wokwi-pushbutton 
          ref={btnRef} 
          color={data?.color || 'green'}
          onMouseDown={() => handleAction(1)}
          onMouseUp={() => handleAction(0)}
          onTouchStart={() => handleAction(1)}
          onTouchEnd={() => handleAction(0)}
        />

        {!isPreview && pins.map((p) => (
          <Handle
            key={p.name}
            id={p.name}
            type="bidirectional"
            position={Position.Top}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              background: '#ef4444', // Red for input/button pins
              width: 10,
              height: 10,
              transform: 'translate(-50%, -50%)',
              border: '2px solid white',
              zIndex: 100
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WokwiButton;