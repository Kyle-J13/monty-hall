import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import SandboxPage from './pages/SandboxPage';
import SandboxPlayPage from './pages/SandboxPlayPage';

/**
 * Main application component with routing for:
 * - HomePage at "/"
 * - PlayPage (data collection) at "/play"
 * - Sandbox chooser at "/sandbox"
 * - Sandbox play instance at "/sandbox/play"
 */
export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/play"    element={<PlayPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="/sandbox/play" element={<SandboxPlayPage />} />
      </Routes>
    </Router>
  );
}
