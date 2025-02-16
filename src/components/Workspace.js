import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { motion } from "framer-motion";

// Pin configurations (as provided in the original code)
const pinConfigurations = {
    bridge: {
        left: Array.from({ length: 12 }, (_, i) => ({
            name: `left-${i + 1}`,
            x: 0,
            y: (10 + i * 8) * 2,
        })),
        right: Array.from({ length: 12 }, (_, i) => ({
            name: `right-${i + 1}`,
            x: 100 * 2,
            y: (10 + i * 8) * 2,
        })),
    },
    oled: {
        left: [{ name: "left-1", x: 0, y: 50 * 2 }],
        right: [{ name: "right-1", x: 100 * 2, y: 50 * 2 }],
    },
    audioplayer: {
        left: [{ name: "left-1", x: 0, y: 50 * 2 }],
        right: [{ name: "right-1", x: 100 * 2, y: 50 * 2 }],
    },
    led: {
        left: [{ name: "left-1", x: 0, y: 50 * 2 }],
        right: [{ name: "right-1", x: 100 * 2, y: 50 * 2 }],
    },
    buzzer: {
        left: [{ name: "left-1", x: 0, y: 50 * 2 }],
        right: [{ name: "right-1", x: 100 * 2, y: 50 * 2 }],
    },
    motor: {
        left: [{ name: "left-1", x: 0, y: 50 * 2 }],
        right: [
            { name: "right-1", x: 100 * 2, y: 50 * 2 },
            { name: "right-2", x: 100 * 2, y: 60 * 2 },
            { name: "right-3", x: 100 * 2, y: 70 * 2 },
        ],
    },
    joystick: {
        left: [{ name: "left-1", x: 0, y: 40 * 2 }],
        right: [
            { name: "right-1", x: 100 * 2, y: 40 * 2 },
            { name: "right-2", x: 100 * 2, y: 60 * 2 },
        ],
    },
    smartlightled: {
        left: [{ name: "left-1", x: 0, y: 60 * 2 }],
        right: [
            { name: "right-1", x: 100 * 2, y: 60 * 2 },
            { name: "right-2", x: 100 * 2, y: 78 * 2 },
        ],
    },
    sevensegmentdisplay: {
        left: [{ name: "left-1", x: 0, y: 50 * 2 }],
        right: [
            { name: "right-1", x: 100 * 2, y: 50 * 2 },
            { name: "right-2", x: 100 * 2, y: 65 * 2 },
            { name: "right-3", x: 100 * 2, y: 80 * 2 },
            { name: "right-4", x: 100 * 2, y: 90 * 2 },
        ],
    },
    sensor: {
        left: [{ name: "left-1", x: 0, y: 50 * 2 }],
        right: [{ name: "right-1", x: 100 * 2, y: 50 * 2 }],
    },
};

const Workspace = ({ components }) => {
    const [placedComponents, setPlacedComponents] = useState([]);
    const [wires, setWires] = useState([]);
    const [draggingWire, setDraggingWire] = useState(null);
    const workspaceRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedComponentId, setDraggedComponentId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

    const getPinPosition = (component, pinName) => {
        const pin = component.pins.find((p) => p.name === pinName);
        if (!pin) return { x: 0, y: 0 };
        return { x: component.x + pin.x, y: component.y + pin.y };
    };

    const handleStartWire = (componentId, pinName, event) => {
        event.stopPropagation(); // Prevent dragging the component when starting a wire

        // Check if the source pin is already in use as a source or target
        if (wires.some(wire => wire.sourceId === componentId && wire.sourcePin === pinName) ||
            wires.some(wire => wire.targetId === componentId && wire.targetPin === pinName)) {
            return;  // Prevent starting a new wire
        }

        const sourceComponent = placedComponents.find((comp) => comp.id === componentId);
        if (!sourceComponent) return;
        const pinPosition = getPinPosition(sourceComponent, pinName);
        const workspaceRect = workspaceRef.current.getBoundingClientRect();
        setDraggingWire({
            sourceId: componentId,
            sourcePin: pinName,
            x1: pinPosition.x,
            y1: pinPosition.y,
            x2: event.clientX - workspaceRect.left,
            y2: event.clientY - workspaceRect.top,
        });
    };

    const handleMoveWire = (event) => {
        if (draggingWire) {
            const workspaceRect = workspaceRef.current.getBoundingClientRect();
            setDraggingWire((prev) => ({
                ...prev,
                x2: event.clientX - workspaceRect.left,
                y2: event.clientY - workspaceRect.top,
            }));
        }
    };

    const findOverlappingPin = (x, y, excludePin = null, excludeComponentId = null) => {
        for (const component of placedComponents) {
            if (component.id === excludeComponentId) continue;

            for (const pin of component.pins) {
                if (pin.name === excludePin) continue;

                const pinPos = getPinPosition(component, pin.name);
                const distance = Math.sqrt((pinPos.x - x) ** 2 + (pinPos.y - y) ** 2);

                if (distance < 15) {
                    return { componentId: component.id, pin: pin.name };
                }
            }
        }
        return null;
    };

    const handleEndWire = () => {
        if (!draggingWire) return;

        const overlappingPin = findOverlappingPin(
            draggingWire.x2,
            draggingWire.y2,
            draggingWire.sourcePin,
            draggingWire.sourceId
        );

        if (overlappingPin) {
            const { componentId: targetId, pin: targetPin } = overlappingPin;

            // Prevent connecting a pin to itself
            if (draggingWire.sourceId === targetId) {
                setDraggingWire(null);
                return;
            }

             // Check if the target pin is already in use as a source or target
            if (wires.some(wire => wire.sourceId === targetId && wire.sourcePin === targetPin) ||
                wires.some(wire => wire.targetId === targetId && wire.targetPin === targetPin)) {
                setDraggingWire(null);
                return;  // Prevent creating the wire
            }

            const targetComponent = placedComponents.find((c) => c.id === targetId);
            if (!targetComponent) return;

            const sourceComponent = placedComponents.find((c) => c.id === draggingWire.sourceId);
            if (!sourceComponent) return;

            const targetPinPosition = getPinPosition(targetComponent, targetPin);
            const sourcePinPosition = getPinPosition(sourceComponent, draggingWire.sourcePin);

            setWires((prev) => [
                ...prev,
                {
                    sourceId: draggingWire.sourceId,
                    sourcePin: draggingWire.sourcePin,
                    targetId: targetId,
                    targetPin: targetPin,
                    x1: sourcePinPosition.x,
                    y1: sourcePinPosition.y,
                    x2: targetPinPosition.x,
                    y2: targetPinPosition.y,
                },
            ]);
        }
        setDraggingWire(null);
    };

    const handleRemoveComponent = (componentId) => {
        setPlacedComponents((prev) =>
            prev.filter((comp) => comp.id !== componentId)
        );
        // Only remove wires associated with the removed component
        setWires((prevWires) =>
            prevWires.filter(
                (wire) => wire.sourceId !== componentId && wire.targetId !== componentId
            )
        );
    };

    const getBezierCurve = (source, target) => {
        const controlPoint1 = { x: source.x + 50, y: source.y };
        const controlPoint2 = { x: target.x - 50, y: target.y };
        return `M${source.x},${source.y} C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${target.x},${target.y}`;
    };

    const wiresToRender = wires.filter(
        (wire) =>
            placedComponents.some((comp) => comp.id === wire.sourceId) &&
            placedComponents.some((comp) => comp.id === wire.targetId)
    );

    const handleComponentMouseDown = (event, componentId) => {
        setIsDragging(true);
        setDraggedComponentId(componentId);
        const component = placedComponents.find((comp) => comp.id === componentId);
        if (component) {
            setDragOffset({
                x: event.clientX - component.x,
                y: event.clientY - component.y,
            });
        }
    };

    const handleComponentMouseUp = () => {
        setIsDragging(false);
        setDraggedComponentId(null);
    };

    const handleMouseMove = (event) => {
        if (!isDragging || !draggedComponentId) return;

        setPlacedComponents((prev) =>
            prev.map((comp) => {
                if (comp.id === draggedComponentId) {
                    const newX = event.clientX - dragOffset.x;
                    const newY = event.clientY - dragOffset.y;
                    return {
                        ...comp,
                        x: newX,
                        y: newY,
                    };
                }
                return comp;
            })
        );
        setWires((prevWires) =>
            prevWires.map((wire) => {
                if (
                    wire.sourceId === draggedComponentId ||
                    wire.targetId === draggedComponentId
                ) {
                    const sourceComponent = placedComponents.find((c) => c.id === wire.sourceId);
                    const targetComponent = placedComponents.find((c) => c.id === wire.targetId);

                    if (!sourceComponent || !targetComponent) {
                        return wire;
                    }

                    const sourcePinPosition = getPinPosition(sourceComponent, wire.sourcePin);
                    const targetPinPosition = getPinPosition(targetComponent, wire.targetPin);

                    return {
                        ...wire,
                        x1: sourcePinPosition.x,
                        y1: sourcePinPosition.y,
                        x2: targetPinPosition.x,
                        y2: targetPinPosition.y,
                    };
                }
                return wire;
            })
        );
    };

    // Function to remove a specific wire
    const handleRemoveWire = (sourceId, sourcePin, targetId, targetPin) => {
        setWires((prevWires) =>
            prevWires.filter(
                (wire) =>
                    wire.sourceId !== sourceId ||
                    wire.sourcePin !== sourcePin ||
                    wire.targetId !== targetId ||
                    wire.targetPin !== targetPin
            )
        );
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
                userSelect: "none", // Prevent text selection during drag
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
                    onMouseDown={(e) => {
                        handleComponentMouseDown(e, comp.id);
                    }}
                    onMouseUp={handleComponentMouseUp}
                    onMouseMove={
                        isDragging && draggedComponentId === comp.id ? handleMouseMove : null
                    }
                >
                    <img
                        src={comp.image}
                        alt={comp.name}
                        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                    />
                    <h4 style={{ margin: "8px 0", textAlign: "center", color: "#333" }}>
                        {comp.name}
                    </h4>
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
                                backgroundColor: pin.name.startsWith("left") ? "#2196f3" : "#f44336",
                                border: "2px solid #fff",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                cursor: "pointer",
                                transition: "background-color 0.2s, transform 0.2s",
                            }}
                            onMouseDown={(e) => handleStartWire(comp.id, pin.name, e)}
                            whileHover={{ scale: 1.2 }}
                        />
                    ))}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Stop event from propagating to parent div
                            handleRemoveComponent(comp.id);
                        }}
                        style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            padding: "5px 10px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                        }}
                    >
                        Remove
                    </button>
                </motion.div>
            ))}
            {/* Render permanent wires (Bezier curves) */}
            {wiresToRender.map((wire, index) => (
                <svg
                    key={index}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none", // Ensure the SVG doesn't block mouse events
                    }}
                >
                    <path
                        d={getBezierCurve(
                            { x: wire.x1, y: wire.y1 },
                            { x: wire.x2, y: wire.y2 }
                        )}
                        stroke="black"
                        strokeWidth="2"
                        fill="transparent"
                    />
                    {/* Button to remove the wire */}
                    <g>
                        <circle
                            cx={(wire.x1 + wire.x2) / 2}
                            cy={(wire.y1 + wire.y2) / 2}
                            r="8"
                            fill="red"
                            style={{ cursor: 'pointer', pointerEvents: 'auto' }} // Ensure the circle captures mouse events
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveWire(wire.sourceId, wire.sourcePin, wire.targetId, wire.targetPin);
                            }}
                        />
                        <text
                            x={(wire.x1 + wire.x2) / 2}
                            y={(wire.y1 + wire.y2) / 2 + 5}
                            textAnchor="middle"
                            fill="white"
                            style={{
                                fontSize: '0.6rem',
                                pointerEvents: 'none',
                                userSelect: 'none',
                            }}
                        >
                            X
                        </text>
                    </g>
                </svg>
            ))}

            {/* Render wire being dragged */}
            {draggingWire && (
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <path
                        d={getBezierCurve(
                            { x: draggingWire.x1, y: draggingWire.y1 },
                            { x: draggingWire.x2, y: draggingWire.y2 }
                        )}
                        stroke="blue"
                        strokeWidth="2"
                        fill="transparent"
                    />
                </svg>
            )}
        </div>
    );
};

export default Workspace;
