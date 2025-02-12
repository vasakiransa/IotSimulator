import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { motion } from "framer-motion";
import PinConnection from "./PinConnection";

// Pin configuration for each component type
const pinConfigurations = {
  bridge: {
    left: Array.from({ length: 12 }, (_, i) => ({ name: `left-${i + 1}`, x: 0, y: (10 + i * 8) * 2 })),
    right: Array.from({ length: 12 }, (_, i) => ({ name: `right-${i + 1}`, x: 100 * 2, y: (10 + i * 8) * 2 })),
  },
  led: {
    left: [{ name: "left-1", x: 0, y: 50 * 2 }],
    right: [{ name: "right-1", x: 100 * 2, y: 50 * 2 }],
  },
  buzzer: {
    left: [{ name: "left-1", x: 0, y: 60 * 2 }],
    right: [{ name: "right-1", x: 100 * 2, y: 60 * 2 }],
  },
  motor: {
    left: [{ name: "left-1", x: 0, y: 70 * 2 }],
    right: [
      { name: "right-1", x: 100 * 2, y: 70 * 2 },
      { name: "right-2", x: 100 * 2, y: 78 * 2 },
      { name: "right-3", x: 100 * 2, y: 86 * 2 },
    ],
  },
  joystick: {
    left: [{ name: "left-1", x: 0, y: 80 * 2 }],
    right: [
      { name: "right-1", x: 100 * 2, y: 80 * 2 },
      { name: "right-2", x: 100 * 2, y: 88 * 2 },
    ],
  },
  smartLightLED: {
    left: [{ name: "left-1", x: 0, y: 90 * 2 }],
    right: [
      { name: "right-1", x: 100 * 2, y: 90 * 2 },
      { name: "right-2", x: 100 * 2, y: 98 * 2 },
    ],
  },
  SevenSegmentDisplay: {
    left: [{ name: "left-1", x: 0, y: 100 * 2 }],
    right: [
      { name: "right-1", x: 100 * 2, y: 100 * 2 },
      { name: "right-2", x: 100 * 2, y: 108 * 2 },
      { name: "right-3", x: 100 * 2, y: 116 * 2 },
      { name: "right-4", x: 100 * 2, y: 124 * 2 },
    ],
  },
  Sensor: {
    left: [{ name: "left-1", x: 0, y: 110 * 2 }],
    right: [{ name: "right-1", x: 100 * 2, y: 110 * 2 }],
  },
};




const Workspace = ({ components }) => {
  const [placedComponents, setPlacedComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [draggingWire, setDraggingWire] = useState(null);
  const workspaceRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (item) => {
    const { type } = item;
    const pins = pinConfigurations[type] || { left: [], right: [] };
    setPlacedComponents((prev) => [
      ...prev,
      {
        ...item,
        id: `${item.id}-${Date.now()}`,
        x: Math.random() * 500,
        y: Math.random() * 500,
        type,
        pins: [...pins.left, ...pins.right],
      },
    ]);
  };

  const getPinPosition = (component, pin) => {
    const pinPos = component.pins.find((p) => p.name === pin.name);
    return pinPos ? { x: component.x + pinPos.x, y: component.y + pinPos.y } : { x: 50, y: 50 };
  };

  const handleStartWire = (componentId, pin, event) => {
    const sourceComponent = placedComponents.find((comp) => comp.id === componentId);
    if (!sourceComponent) return;

    const { x, y } = getPinPosition(sourceComponent, pin);
    setDraggingWire({ sourceId: componentId, sourcePin: pin, x1: x, y1: y, x2: x, y2: y });
  };

  const handleMoveWire = (event) => {
    if (draggingWire) {
      setDraggingWire((prev) => ({
        ...prev,
        x2: event.clientX,
        y2: event.clientY,
      }));
    }
  };

  const findOverlappingPin = (x, y) => {
    for (const component of placedComponents) {
      for (const pin of component.pins) {
        const pinPos = getPinPosition(component, pin);
        const distance = Math.sqrt((pinPos.x - x) ** 2 + (pinPos.y - y) ** 2);

        if (distance < 15 && !pin.connectedTo) {
          return { componentId: component.id, pin: pin.name };
        }
      }
    }
    return null;
  };

  const handleEndWire = () => {
    if (!draggingWire) return;

    const overlappingPin = findOverlappingPin(draggingWire.x2, draggingWire.y2);

    if (overlappingPin) {
      const { componentId: targetId, pin: targetPin } = overlappingPin;

      if (wires.some((wire) =>
        (wire.sourceId === draggingWire.sourceId && wire.targetId === targetId) ||
        (wire.sourceId === targetId && wire.targetId === draggingWire.sourceId)
      )) {
        setDraggingWire(null);
        return;
      }

      const targetComponent = placedComponents.find((comp) => comp.id === targetId);
      const targetPos = getPinPosition(targetComponent, targetPin);

      setWires((prev) => [
        ...prev,
        {
          sourceId: draggingWire.sourceId,
          sourcePin: draggingWire.sourcePin,
          targetId,
          targetPin,
          x1: draggingWire.x1,
          y1: draggingWire.y1,
          x2: targetPos.x,
          y2: targetPos.y,
        },
      ]);

      setPlacedComponents((prev) =>
        prev.map((comp) =>
          comp.id === draggingWire.sourceId || comp.id === targetId
            ? {
                ...comp,
                pins: comp.pins.map((pin) =>
                  pin.name === draggingWire.sourcePin || pin.name === targetPin
                    ? { ...pin, connectedTo: targetId }
                    : pin
                ),
              }
            : comp
        )
      );
    }

    setDraggingWire(null);
  };

  const getBezierCurve = (source, target) => {
    const controlPoint1 = { x: source.x + 50, y: source.y };
    const controlPoint2 = { x: target.x - 50, y: target.y };
    return `M${source.x},${source.y} C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${target.x},${target.y}`;
  };

  

  return (
    <div
      ref={(node) => {
        drop(node);
        workspaceRef.current = node;
      }}
      onMouseMove={handleMoveWire}
      onMouseUp={handleEndWire}
      style={{
        flex: 1,
        position: "relative",
        border: "1px dashed #ccc",
        height: "100%",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Render components */}
      {placedComponents.map((comp) => (
        <motion.div
          key={comp.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            top: `${comp.y}px`,
            left: `${comp.x}px`,
            width: "200px",
            height: "200px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            cursor: "grab",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)" }}
        >
          <img src={comp.image} alt={comp.name} style={{ width: "100%", height: "100%", borderRadius: "8px" }} />
          <h4 style={{ margin: "8px 0", textAlign: "center", color: "#333" }}>{comp.name}</h4>
          {/* Render Pins */}
          {comp.pins.map((pin) => (
            <div
              key={pin.name}
              style={{
                position: "absolute",
                top: `${pin.y}px`,
                left: `${pin.x}px`,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: pin.name.startsWith("left") ? "#2196f3" : "#f44336", // Blue for left, red for right
                border: "2px solid #fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition: "background-color 0.2s, transform 0.2s",
              }}
              onMouseDown={(e) => handleStartWire(comp.id, pin, e)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </motion.div>
      ))}

      {/* Render permanent wires (Bezier curves) */}
      {wires.map((wire, index) => (
        <svg key={index} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <path
            d={getBezierCurve({ x: wire.x1, y: wire.y1 }, { x: wire.x2, y: wire.y2 })}
            stroke="url(#wire-gradient)"
            strokeWidth="3"
            fill="transparent"
          />
          <defs>
            <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#4caf50", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#2196f3", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      ))}

      {/* Render temporary flexible wire */}
      {draggingWire && (
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <path
            d={getBezierCurve({ x: draggingWire.x1, y: draggingWire.y1 }, { x: draggingWire.x2, y: draggingWire.y2 })}
            stroke="#ff5722"
            strokeWidth="3"
            strokeDasharray="5,5"
            fill="transparent"
          />
        </svg>
      )}
    </div>
  );
};

export default Workspace;