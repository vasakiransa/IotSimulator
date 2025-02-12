import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DraggableComponent from './components/DraggableComponent';
import Workspace from './components/Workspace';
import bridgeImage from './assets/bridge.png';
import sensorImage from './assets/sensor.png';
import ledImage from './assets/led.png';
import motorImage from './assets/motor.png';
import buzzerImage from './assets/buzzer.png';
import joystickImage from './assets/joystick.png';
import smartLightImage from './assets/smartlightled.png';
import sevenSegmentImage from './assets/sevensegmentdisplay.png';
import panTiltImage from './assets/panandtilt.png';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const IoTSimulator = () => {
  const [components, setComponents] = useState([]);

  // Handle adding components to the workspace
  const handleAddComponent = (id, name, type, image) => {
    setComponents((prev) => [
      ...prev,
      { id, name, type, image, x: 100, y: 100, pins: ['pin1', 'pin2', 'pin3'], isDragging: false },
    ]);
  };

  const componentsList = [
    { id: 1, name: 'IoT Bridge', type: 'bridge', image: bridgeImage },
    { id: 2, name: 'RGB LED', type: 'led', image: ledImage },
    { id: 3, name: 'Temperature Sensor', type: 'sensor', image: sensorImage },
    { id: 4, name: 'DC Motor', type: 'motor', image: motorImage },
    { id: 5, name: 'Buzzer', type: 'buzzer', image: buzzerImage },
    { id: 6, name: 'Joystick', type: 'joystick', image: joystickImage },
    { id: 7, name: 'Smart Light LED', type: 'smartlight', image: smartLightImage },
    { id: 8, name: 'Seven Segment Display', type: 'sevensegment', image: sevenSegmentImage },
    { id: 9, name: 'Pan & Tilt', type: 'pantilt', image: panTiltImage },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', height: '100vh' }}>
          <div style={{ width: '20%', padding: '10px', backgroundColor: '#f4f4f4' }}>
            <h2>Sheshgyan Stimulator</h2>
            {componentsList.map((comp) => (
              <DraggableComponent
                key={comp.id}
                id={comp.id}
                name={comp.name}
                type={comp.type}
                image={comp.image}
                onAddComponent={handleAddComponent}
              />
            ))}
          </div>
          <Workspace components={components} />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
};

export default IoTSimulator;