import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { registerComponentBlueprint } from '@/store/registrySlice';

const BaseHardware = ({ type, name, category, children }) => {
  const elementRef = useRef(null);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      const el = elementRef.current;
      // Once Wokwi is ready, it populates pinInfo
      if (el && el.pinInfo && el.pinInfo.length > 0) {
        dispatch(registerComponentBlueprint({
          type,
          name,
          category,
          pins: el.pinInfo, // Captures actual coordinates from Wokwi
          svg: el.innerHTML // Captures the real SVG for the Navbar preview
        }));
        clearInterval(interval);
      }
      if (attempts++ > 20) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [type, name, category, dispatch]);

  return <div ref={elementRef}>{children}</div>;
};