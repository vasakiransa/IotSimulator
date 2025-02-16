import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableComponent = ({ id, name, type, image, onAddComponent }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { id, name, type, image },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.9 : 1,
        width: '180px', // Fixed width for a compact box
        padding: '16px',
        margin: '8px',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0', // Subtle border for definition
        borderRadius: '12px', // Rounded corners for a softer look
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: isDragging
          ? '0 8px 16px rgba(0, 0, 0, 0.15)'
          : '0 4px 8px rgba(0, 0, 0, 0.1)', // Enhanced shadow effect
        transition: 'all 0.3s ease-in-out',
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        ':hover': {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)', // Lift effect on hover
        },
      }}
      onClick={() => onAddComponent(id, name, type, image)}
    >
      <div
        style={{
          width: '60px', // Slightly larger image size for prominence
          height: '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '10px', // Space below the image
          transition: 'transform 0.2s ease-in-out',
          ':hover': {
            transform: 'scale(1.1)', // Zoom effect on hover
          },
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.2s ease-in-out', // Smooth image transition
            ':hover': {
              transform: 'scale(1.05)', // Slight zoom on image hover
            },
          }}
        />
      </div>

      <h4 style={{ 
          margin: 0,
          fontSize: '1rem', 
          fontWeight: 600,
          color: '#333', 
          textAlign: 'center', 
          lineHeight: '1.2' 
        }}>
        {name}
      </h4>
      <p style={{ 
          marginTop: '4px', 
          fontSize: '0.8rem', 
          color: '#777', 
          textAlign: 'center' 
        }}>
        {type}
      </p>

      <button
        style={{
          backgroundColor: '#5a67d8', // Vibrant button color
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px', // Rounded button corners
          width: '100%',
          padding: '8px',
          marginTop: '10px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
          transition:
            'background-color 0.3s ease-in-out, transform 0.3s ease-in-out',
          ':hover': {
            backgroundColor: '#434190', // Darker shade on hover
            transform: 'scale(1.02)', // Slight zoom effect on hover
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          onAddComponent(id, name, type, image);
        }}
      >
        Add +
      </button>
    </div>
  );
};

export default DraggableComponent;
