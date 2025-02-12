import React from 'react';

const PinConnection = ({ componentId, pins, onStartWire, onEndWire }) => {
  const handleMouseDown = (pin, event) => {
    // Only start dragging if the pin is not connected
    if (!pin.connected) {
      onStartWire(componentId, pin, event);
    }
  };

  const handleMouseUp = (pin, event) => {
    // Only end dragging if the pin is not connected
    if (!pin.connected) {
      onEndWire(componentId, pin, event);
    }
  };

  // Determine the pin color based on its name (left or right)
  const getPinColor = (pinName) => {
    if (pinName.startsWith('left')) {
      return '#1976d2'; // Blue for left pins
    } else if (pinName.startsWith('right')) {
      return '#d32f2f'; // Red for right pins
    }
    return '#1976d2'; // Default color
  };

  return (
    <div className="pins" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      {pins.map((pin) => (
        <div key={pin.name} className="pin" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onMouseDown={(e) => handleMouseDown(pin, e)} // Start wire on mouse down
            onMouseUp={(e) => handleMouseUp(pin, e)}     // End wire on mouse up
            style={{
              padding: '5px 10px',
              backgroundColor: pin.connected ? 'green' : getPinColor(pin.name), // Use dynamic color
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: pin.connected ? 'not-allowed' : 'pointer',  // Disable cursor if pin connected
            }}
            disabled={pin.connected} // Disable the button if pin is connected
          >
            {pin.name} {/* Render pin name */}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PinConnection;