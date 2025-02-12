import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography } from '@mui/material';
import bridgeImage from '../assets/bridge.png';

const Bridge = ({ id, name, onPinConnection }) => {
  const [connectedComponents, setConnectedComponents] = useState({});

  const handlePinChange = (componentId, pin) => {
    setConnectedComponents((prev) => ({
      ...prev,
      [componentId]: pin,
    }));
    onPinConnection(componentId, pin);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', top: `${id * 100}px`, left: `${id * 100}px` }}
    >
      <Card sx={{ width: 250, backgroundColor: '#e3f2fd' }}>
        <CardContent>
          <img src={bridgeImage} alt="Bridge" style={{ width: '100%', height: 'auto' }} />
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bridge ID: {id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: Connected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connected Components:
          </Typography>
          {Object.entries(connectedComponents).map(([componentId, pin]) => (
            <Typography key={componentId} variant="body2" color="text.secondary">
              Component {componentId} → {pin}
            </Typography>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Bridge;