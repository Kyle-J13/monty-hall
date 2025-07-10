import React from 'react';
import './AboutPage.css'; 

export default function AboutPage() {
  return (
    <div className="about-container">
      <h1>About the Monty Hall Learning Platform</h1>
      <p>
        This interactive sandbox lets you explore the famous Monty Hall problem and its variations.
        Your gameplay data helps drive cognitive science research at RPI by analyzing decision strategies.
      </p>
      <h2>What We Do</h2>
      <ul>
        <li>Simulate classic and custom Monty behaviors (Standard, Evil, Secretive…)</li>
        <li>Collect anonymized user choices for research in probability and decision making</li>
        <li>Provide an educational experience on counterintuitive probability puzzles</li>
      </ul>
      <h2>Contributors</h2>
      <ul>
        <li>Professor Bram (Project Lead)</li>
        <li>Kyle-J13 (Developer)</li>
      </ul>
      <p className="about-footer">
        Data is stored securely; we never collect personal identifiers. For more info, see our <a href="https://github.com/Kyle-J13/monty-hall" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </div>
  );
}