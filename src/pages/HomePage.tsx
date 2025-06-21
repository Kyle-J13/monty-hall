// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'relative',
      textAlign: 'center',
      paddingTop: '5rem',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Monty Hall</h1>
      <button
        onClick={() => navigate('/play')}
        style={{
          fontSize: '1.5rem',
          padding: '0.75rem 2rem',
          marginRight: '1rem',
          cursor: 'pointer'
        }}
      >
        Play
      </button>
      <button
        onClick={() => navigate('/research')}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Research
      </button>
    </div>
  );
}
