// src/components/NavBar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Top navigation bar for the application.
 * Contains links to Play, Sandbox, Resources, Education, Results, and About.
 * Sandbox currently has a dropdown to access the “Choose Monty” screen.
 */
export default function NavBar() {
  // Tracks whether the Sandbox dropdown is open
  const [sandboxOpen, setSandboxOpen] = useState(false);

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.5rem 1rem',
      background: '#f0f0f0',
      fontFamily: 'sans-serif',
      position: 'relative',
    }}>
      {/* Direct link to the main Play page (data-collection mode) */}
      <Link to="/play" style={{ textDecoration: 'none' }}>Play</Link>

      {/* Sandbox dropdown trigger */}
      <div style={{ position: 'relative' }}>
        <span
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setSandboxOpen(open => !open)}
        >
          Sandbox ▾
        </span>
        {sandboxOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}>
            {/* Link to the Sandbox choose-Monty screen */}
            <Link
              to="/sandbox"
              style={{
                display: 'block',
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                color: '#333',
              }}
              onClick={() => setSandboxOpen(false)}
            >
              Choose Monty
            </Link>
          </div>
        )}
      </div>

      {/* Placeholder nav items for future sections */}
      <Link to="/resources" style={{ textDecoration: 'none', color: 'inherit' }}>Resources</Link>
      <Link to="/education" style={{ textDecoration: 'none', color: 'inherit' }}>Education</Link>
      <Link to="/results" style={{ textDecoration: 'none', color: 'inherit' }}>Results</Link>

      {/* Updated About link */}
      <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
    </nav>
  );
}
