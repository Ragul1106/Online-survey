import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurveyData } from '../services/surveyService';
import SurveyForm from '../components/surveys/SurveyForm/SurveyForm';
import withAutoSave from '../hoc/withAutoSave';
import SurveyPreviewPortal from '../components/common/SurveyPreviewPortal';
import './SurveyBuilderPage.css';

const AutoSaveSurveyForm = withAutoSave(SurveyForm);

const SurveyBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState({});

  useEffect(() => {
    const loadSurvey = async () => {
      const data = await fetchSurveyData(id);
      setSurveyData(data);

      if (data) {
        const initialData = {};
        data.questions.forEach(q => {
          initialData[q.id] = q.type === 'checkbox' ? [] : '';
        });
        setCurrentFormData(initialData);
      }
    };
    loadSurvey();
  }, [id]);

  const handleSave = (data) => {
    console.log('Auto-saving survey data:', data);

  };

  return (
    <div className="survey-builder-page">
      <div className="builder-header">
        <h1>Edit Survey: {surveyData?.title || 'Loading...'}</h1>
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>

      {surveyData && (
        <>
          <AutoSaveSurveyForm
            surveyData={surveyData}
            onFormChange={setCurrentFormData}
            onSave={handleSave}
            isEditing={true}
          />

          <div className="preview-section">
            <button
              className="preview-btn"
              onClick={() => setIsPreviewOpen(true)}
            >
              Open Live Preview
            </button>
          </div>

          <SurveyPreviewPortal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)}
          >
            <SurveyForm 
              surveyData={surveyData} 
              values={currentFormData} 
              isEditing={false} 
            />
          </SurveyPreviewPortal>
        </>
      )}
    </div>
  );
};

export default SurveyBuilderPage;