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
        opacity: isDragging ? 0.5 : 1,
        padding: '16px',
        margin: '8px',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)')}
      onClick={() => onAddComponent(id, name, type, image)}
    >
      <img
        src={image}
        alt={name}
        style={{
          width: '40px',
          height: '40px',
          marginRight: '12px',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>{name}</h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{type}</p>
      </div>
      <div
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: '#e0e0e0',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d0d0d0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
      >
        <span style={{ fontSize: '12px', color: '#333' }}>+</span>
      </div>
    </div>
  );
};

export default DraggableComponent;