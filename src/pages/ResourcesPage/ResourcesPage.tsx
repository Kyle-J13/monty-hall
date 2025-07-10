// src/pages/ResourcesPage.tsx
import React from 'react';
import './ResourcesPage.css'; 

export default function ResourcesPage() {
  return (
    <div className="resources-container">
      <h1>Resources</h1>
      <p>
        Here you’ll find links to documentation, tutorials, and related materials for the Monty Hall Learning Platform.
      </p>
      <ul>
        <li>
          <a
            href="https://en.wikipedia.org/wiki/Monty_Hall_problem"
            target="_blank"
            rel="noopener noreferrer"
          >
            Monty Hall on Wikipedia
          </a>
        </li>
        <li>
          <a
            href="https://reactjs.org/docs/getting-started.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Docs
          </a>
        </li>
        <li>
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
