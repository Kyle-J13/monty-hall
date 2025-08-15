// src/pages/EducationPage.tsx
import React from 'react';
import MontyTreeTabs from '../../components/MontyTreeTabs/MontyTreeTabs';
import './TechnicalResources.css';

export default function EducationPage() {
  return (
    <>
      <div className="education-container">
        <div className='resourcesDiv'>
          <h1 id='resourcesTitle'>Technical Resources</h1>
          <p>This section provides links to resources that are helpful for understanding the stack that was used for creating this website.</p>

          <a href='https://reactjs.org/docs/getting-started.html'>
            <h3>React Docs</h3>
          </a>

          <a href='https://supabase.com/docs'>
            <h3>Supabase Documentation</h3>
          </a>
        </div>
      </div>
    </>
  );
}