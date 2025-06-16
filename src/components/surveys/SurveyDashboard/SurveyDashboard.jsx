import React, { useState, useEffect } from 'react';
import { fetchAllSurveys } from '../../../services/surveyService';
import './SurveyDashboard.css';

const SurveyDashboard = ({ onEditSurvey, onViewSurvey }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurveys = async () => {
      const data = await fetchAllSurveys();
      setSurveys(data);
      setLoading(false);
    };
    loadSurveys();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading surveys...</div>;
  }

  return (
    <div className="survey-dashboard">
      <h2 className="dashboard-title">Available Surveys</h2>
      <div className="survey-grid">
        {surveys.map((survey) => (
          <div key={survey.id} className="survey-card">
            <h3 className="survey-card-title">{survey.title}</h3>
            <p className="survey-card-description">{survey.description}</p>
            <div className="survey-card-actions">
              <button 
                className="edit-btn"
                onClick={() => onEditSurvey(survey.id)}
              >
                Edit
              </button>
              <button 
                className="view-btn"
                onClick={() => onViewSurvey(survey.id)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyDashboard;