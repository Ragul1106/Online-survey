import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyDashboard from './components/surveys/SurveyDashboard/SurveyDashboard';
import SurveyBuilderPage from './pages/SurveyBuilderPage';
import SurveyViewerPage from './pages/SurveyViewerPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <SurveyDashboard 
              onEditSurvey={(id) => window.location.href = `/surveys/${id}/edit`}
              onViewSurvey={(id) => window.location.href = `/surveys/${id}/view`}
            />} 
          />
          <Route path="/surveys/:id/edit" element={<SurveyBuilderPage />} />
          <Route path="/surveys/:id/view" element={<SurveyViewerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;