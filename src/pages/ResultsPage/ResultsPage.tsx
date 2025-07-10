// src/pages/ResultsPage.tsx
import React from 'react';
import './ResultsPage.css';

export default function ResultsPage() {
  return (
    <div className="results-container">
      <h1>Results & Statistics</h1>
      <p>
        Once enough data is collected, you’ll see aggregated win/loss rates and user strategy breakdowns here.
      </p>
      <p>
        Data collection is powered by Supabase; all entries are anonymized for research at RPI.
      </p>
    </div>
  );
}