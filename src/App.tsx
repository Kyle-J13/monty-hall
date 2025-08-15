// src/App.tsx
// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import HomePage from './pages/Homepage/HomePage';
import PlayPage from './pages/PlayPage/PlayPage';
import SandboxPage from './pages/SandboxPage/SandboxPage';
import SandboxPlayPage from './pages/SandboxPagePlay/SandboxPlayPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage';
import EducationPage from './pages/EducationPage/EducationPage';
import ResultsPage from './pages/ResultsPage/ResultsPage';
import TechnicalResources from './pages/Technical Resources/TechnicalResources';
import './App.css';

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
        <Route path="/"             element={<HomePage />} />
        <Route path="/about"        element={<AboutPage />} />
        <Route path="/resources"    element={<ResourcesPage />} />
        <Route path="/education"    element={<EducationPage />} />
        <Route path="/results"      element={<ResultsPage />} />
        <Route path="/play"         element={<PlayPage />} />
        <Route path="/sandbox"      element={<SandboxPage />} />
        <Route path="/sandbox/play" element={<SandboxPlayPage />} />
        <Route path="/technicalResources" element={<TechnicalResources />} />
      </Routes>
    </Router>
  );
}