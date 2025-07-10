import React from 'react';
import { useNavigate } from 'react-router-dom';
import { montyTypes } from '../../logic/montyEngine';
import type { MontyType } from '../../logic/types';
import './SandboxPage.css';

/**
 * Sandbox landing page where user selects a specific Monty behavior.
 * Each button navigates to the sandbox game route with a query param.
 */
export default function SandboxPage() {
  const navigate = useNavigate();

  return (
    <div className="sandbox-container">
      <h2>Sandbox: Choose Monty</h2>

      {/* Render a button for each MontyType */}
      <div className="sandbox-buttons">
        {montyTypes.map((mt: MontyType) => (
          <button
            key={mt}
            onClick={() => navigate(`/sandbox/play?monty=${mt}`)}
            className="sandbox-button"
          >
            {mt}
          </button>
        ))}
      </div>
    </div>
  );
}