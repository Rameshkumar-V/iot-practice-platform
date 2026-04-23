import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Handle,
  useUpdateNodeInternals,
} from "@xyflow/react";

import { useDispatch } from "react-redux";
import { registerComponentBlueprint } from "@/store/registrySlice";
import { updatePinSignal } from "@/store/workspaceSlice";

// testing

import { setOn, setOff } from "@/store/testSlice";

import "@wokwi/elements";

const WokwiButton = ({ id, data, isPreview = false }) => {
  const dispatch = useDispatch();
  const updateNodeInternals = useUpdateNodeInternals();

  const btnRef = useRef(null);
  const [pins, setPins] = useState([]);

  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    let tries = 0;

    const poll = setInterval(() => {
      if (
        el.pinInfo &&
        el.pinInfo.length > 0 &&
        el.offsetWidth > 0
      ) {
        const offsetX = el.offsetLeft;
        const offsetY = el.offsetTop;

        const correctedPins = el.pinInfo.map((pin) => ({
          ...pin,
          x: offsetX + pin.x,
          y: offsetY + pin.y,
        }));

        setPins(correctedPins);
        updateNodeInternals(id);

        if (!isPreview) {
          dispatch(
            registerComponentBlueprint({
              type: "hardwareButton",
              tagName: "wokwi-pushbutton",
              name: "Push Button",
              category: "INPUT",
              pins: correctedPins,
            })
          );
        }

        clearInterval(poll);
      }

      if (tries++ > 50) clearInterval(poll);
    }, 100);

    return () => clearInterval(poll);
  }, [dispatch, id, isPreview, updateNodeInternals]);

  const handleAction = (value) => {
    if (isPreview) return;

    dispatch(
      updatePinSignal({
        nodeId: id,
        pinName: "1",
        signalValue: value,
      })
    );
  };

  const pinStyle = (x, y, color, hidden = false) => ({
    position: "absolute",
    left: x,
    top: y,
    width: 12,
    height: 12,
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    background: hidden ? "transparent" : color,
    border: hidden ? "none" : "2px solid white",
    opacity: hidden ? 0 : 1,
    zIndex: 999,
    cursor: "crosshair",
  });

  return (
    <div className="relative">
      <div
        className="relative inline-block"
        style={{ width: 100, height: 100 }}
      >
        <wokwi-pushbutton
          ref={btnRef}
          color={data?.color || "green"}
          onMouseDown={() => handleAction(5)}
          onPointerDown={() => {
            // alert("hi"); 
            dispatch(setOn());
            
          }}
onMouseUp={() => {
  // alert("hi");
  dispatch(setOn());
  
}}
onMouseLeave={() => {
  // alert("end");
  dispatch(setOff());
  
}}
onTouchStart={() => {
  // alert("hi");
  dispatch(setOn());
  
}}
onTouchEnd={() => {
  // alert("end");
  dispatch(setOff());
  
}}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
  
        {!isPreview &&
          pins.map((pin) => (
            <React.Fragment key={pin.name}>
              <Handle
                id={`${pin.name}-out`}
                type="source"
                isConnectable
                style={pinStyle(pin.x, pin.y, "#ef4444")}
              />
  
              <Handle
                id={`${pin.name}-in`}
                type="target"
                isConnectable
                style={pinStyle(pin.x, pin.y, "#ef4444", true)}
              />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default WokwiButton;