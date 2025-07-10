// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Monty Hall</h1>
      <button
        className="play-button"
        onClick={() => navigate('/play')}
      >
        Play
      </button>
    </div>
  );
}