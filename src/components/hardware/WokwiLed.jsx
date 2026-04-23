import React, { useLayoutEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { registerComponentBlueprint } from '@/store/registrySlice';
import '@wokwi/elements';

const WokwiLed = ({ id, data, isPreview = false }) => {
  const dispatch = useDispatch();
  const ledRef = useRef(null);
  const [pins, setPins] = useState([]);
  const signals = useSelector(state => state.workspace.nodes[id]?.data?.signals || {});

  useLayoutEffect(() => {
    const el = ledRef.current;
    if (!el) return;
    
    let attempts = 0;
    const poll = setInterval(() => {
      if (el.pinInfo && el.pinInfo.length > 0 && el.pinInfo[0].x !== 0) {
        setPins([...el.pinInfo]);
        if (!isPreview) {
          dispatch(registerComponentBlueprint({
            type: 'hardwareLed',
            tagName: 'wokwi-led',
            pins: el.pinInfo
          }));
        }
        clearInterval(poll);
      }
      if (attempts++ > 40) clearInterval(poll);
    }, 100);
    return () => clearInterval(poll);
  }, [dispatch, isPreview]);

  return (
    <div className={isPreview ? "" : "p-4 bg-zinc-900 border border-zinc-800 rounded-xl"}>
      <div className="relative inline-block">
        <wokwi-led ref={ledRef} color={data?.color || 'red'} value={signals['anode'] ? 1 : 0} />
        {!isPreview && pins.map(p => (
          <Handle 
            key={p.name} id={p.name} type="bidirectional" position={Position.Top} 
            style={{ position: 'absolute', left: p.x, top: p.y, background: '#3b82f6', width: 8, height: 8 }} 
          />
        ))}
      </div>
    </div>
  );
};

export default WokwiLed;