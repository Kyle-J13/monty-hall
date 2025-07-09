// src/pages/ResultsPage.tsx
import React from 'react';

export default function ResultsPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>Results & Statistics</h1>
      <p>Once enough data is collected, you’ll see aggregated win/loss rates and user strategy breakdowns here.</p>
      <p>Data collection is powered by Supabase; all entries are anonymized for research at RPI.</p>
    </div>
  );
}
