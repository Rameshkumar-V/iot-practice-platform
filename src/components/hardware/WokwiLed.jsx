import React, { useEffect, useRef, useState } from "react";
import {
  Handle,
  useUpdateNodeInternals,
} from "@xyflow/react";

import { useDispatch, useSelector } from "react-redux";
import { registerComponentBlueprint } from "@/store/registrySlice";

import "@wokwi/elements";
const EMPTY_OBJ = {};

const WokwiLed = ({ id, data, isPreview = false }) => {
  const dispatch = useDispatch();
  const updateNodeInternals = useUpdateNodeInternals();
// testing
const isLedOn = useSelector((state) => state.test.isLedOn);

  const ledRef = useRef(null);
  const [pins, setPins] = useState([]);

   const signals = useSelector(
    (state) => state.workspace.nodes[id]?.data?.signals ?? EMPTY_OBJ
  );

  useEffect(() => {
    const el = ledRef.current;
    if (!el) return;

    let tries = 0;

    const poll = setInterval(() => {
      if (el.pinInfo && el.pinInfo.length > 0) {
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
              type: "hardwareLed",
              tagName: "wokwi-led",
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
        style={{ width: 80, height: 100 }}
      >
        <wokwi-led
  ref={ledRef}
  color={data?.color || "red"}
  value={isLedOn
  }
/>
{/* <pre>{JSON.stringify(signals, null, 2)}</pre> */}
<pre>{isLedOn}</pre>
  
  
        {!isPreview &&
          pins.map((pin) => (
            <React.Fragment key={pin.name}>
              <Handle
                id={`${pin.name}-out`}
                type="source"
                isConnectable
                style={pinStyle(pin.x, pin.y, "#3b82f6")}
              />
  
              <Handle
                id={`${pin.name}-in`}
                type="target"
                isConnectable
                style={pinStyle(pin.x, pin.y, "#3b82f6", true)}
              />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default WokwiLed;