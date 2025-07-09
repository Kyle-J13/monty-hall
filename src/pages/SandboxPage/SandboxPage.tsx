import React from 'react';
import { useNavigate } from 'react-router-dom';
import { montyTypes } from '../../logic/montyEngine';
import type { MontyType } from '../../logic/types';

/**
 * Sandbox landing page where user selects a specific Monty behavior.
 * Each button navigates to the sandbox game route with a query param.
 */
export default function SandboxPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Sandbox: Choose Monty</h2>

      {/* Render a button for each MontyType */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {montyTypes.map((mt: MontyType) => (
          <button
            key={mt}
            onClick={() => navigate(`/sandbox/play?monty=${mt}`)}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {mt}
          </button>
        ))}
      </div>
    </div>
  );
}
