import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';
import { registerComponentBlueprint } from '@/store/registrySlice';

const GenericHardware = ({ id, type, data }) => {
  const dispatch = useDispatch();
  const elementRef = useRef(null);
  const [pins, setPins] = useState([]);
  
  const catalog = useSelector(state => state.registry.catalog);
  const signals = useSelector(state => state.workspace.nodes[id]?.data?.signals || {});

  // Find the blueprint for the buzzer or any dynamic element
  const blueprint = useMemo(() => {
    return catalog[type] || Object.values(catalog).find(item => item.type === type);
  }, [catalog, type]);

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let attempts = 0;
    const poll = setInterval(() => {
      if (el.pinInfo && el.pinInfo.length > 0 && el.pinInfo[0].x !== 0) {
        setPins([...el.pinInfo]);
        dispatch(registerComponentBlueprint({ type, pins: el.pinInfo }));
        clearInterval(poll);
      }
      if (attempts++ > 40) clearInterval(poll);
    }, 100);
    return () => clearInterval(poll);
  }, [dispatch, type]);

  if (!blueprint) return null;

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="relative inline-block">
        {React.createElement(blueprint.tagName, {
          ref: elementRef,
          // Buzzer logic: typically uses 'value' to sound
          value: signals['1'] || signals['SIG'] || 0,
          ...data
        })}

        {pins.map((p) => (
          <Handle
            key={p.name}
            id={p.name}
            type="bidirectional"
            position={Position.Top}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              background: '#3b82f6',
              width: 8, height: 8,
              transform: 'translate(-50%, -50%)',
              border: '2px solid white'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// CRITICAL FIX: Ensure this line exists!
export default GenericHardware;