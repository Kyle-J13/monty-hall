// src/pages/EducationPage.tsx
import React from 'react';
import './EducationPage.css';

export default function EducationPage() {
  return (
    <div className="education-container">
      <h1>Education</h1>
      <p>This section provides an intuitive and mathematical explanation of the Monty Hall problem, plus interactive visualizations coming soon.</p>
      <h2>Why Switch?</h2>
      <p>Switching doors doubles your chance of winning from 1/3 to 2/3. Here’s why:</p>
      <ol>
        <li>You pick a door (1/3 chance).</li>
        <li>Monty opens a goat door.</li>
        <li>Switch gives you the remaining 2/3 probability bucket.</li>
      </ol>
    </div>
  );
}