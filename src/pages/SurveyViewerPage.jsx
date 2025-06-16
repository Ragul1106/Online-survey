import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurveyData } from '../services/surveyService';
import SurveyForm from '../components/surveys/SurveyForm/SurveyForm';
import './SurveyViewerPage.css';

const SurveyViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSurveyData(id);
        
        console.log("API Response:", data); 

        if (!data || !Array.isArray(data.questions)) {
          throw new Error("Invalid survey data structure");
        }

        const normalizedData = {
          id: data.id || id,
          title: data.title || "Untitled Survey",
          description: data.description || "",
          questions: data.questions.map((question, index) => ({
            id: question.id || `q-${index}`,
            type: question.type || 'text',
            label: question.label || question.q4 || question.questionText || `Question ${index + 1}`,
            options: question.options || question.choices || []
          }))
        };

        setSurveyData(normalizedData);
      } catch (err) {
        console.error("Survey loading error:", err);
        setError(err.message || "Failed to load survey");
      } finally {
        setLoading(false);
      }
    };
    
    loadSurvey();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-viewer">
        <div className="spinner"></div>
        <p>Loading survey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-viewer">
        <h2>Error loading survey</h2>
        <p>{error}</p>
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="survey-viewer-page">
      <div className="viewer-header">
        <h1>{surveyData.title}</h1>
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>
      
      <SurveyForm 
        surveyData={surveyData} 
        isEditing={false} 
      />
    </div>
  );
};

export default SurveyViewerPage;