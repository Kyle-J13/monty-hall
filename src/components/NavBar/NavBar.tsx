import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

/**
 * Top navigation bar for the application.
 * Contains links to Play, Sandbox, Resources, Education, Results, and About.
 * Sandbox currently has a dropdown to access the “Choose Monty” screen.
 */
export default function NavBar() {
  // Tracks whether the Sandbox dropdown is open
  const [sandboxOpen, setSandboxOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Direct link to the main Play page (data-collection mode) */}
      <NavLink to="/play" className="nav-link">Play</NavLink>

      {/* Sandbox dropdown trigger */}
      <div className="sandbox-dropdown">
        <span
          className="sandbox-trigger"
          onClick={() => setSandboxOpen(open => !open)}
        >
          Sandbox ▾
        </span>
        {sandboxOpen && (
          <div className="sandbox-menu">
            {/* Link to the Sandbox choose-Monty screen */}
            <NavLink
              to="/sandbox"
              className="sandbox-menu-link"
              onClick={() => setSandboxOpen(false)}
            >
              Choose Monty
            </NavLink>
          </div>
        )}
      </div>

      {/* Placeholder nav items for future sections */}
      <NavLink to="/resources" className="nav-link">Resources</NavLink>
      <NavLink to="/education" className="nav-link">Education</NavLink>
      <NavLink to="/results" className="nav-link">Results</NavLink>

      {/* Updated About link */}
      <NavLink to="/about" className="nav-link">About</NavLink>
    </nav>
  );
}
