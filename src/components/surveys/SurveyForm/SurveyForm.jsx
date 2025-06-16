import React from 'react';
import PropTypes from 'prop-types';
import './SurveyForm.css';

const SurveyForm = ({ 
  surveyData, 
  values = {}, 
  onValueChange, 
  isEditing = false, 
  isSaving = false 
}) => {
  const handleInputChange = (e, questionType) => {
    if (!onValueChange) return;

    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (questionType === 'checkbox') {
      const currentValues = values[name] || [];
      newValue = checked
        ? [...currentValues, value]
        : currentValues.filter(item => item !== value);
    } else if (questionType === 'radio') {
      newValue = value;
    }

    onValueChange({
      ...values,
      [name]: newValue
    });
  };

  if (!surveyData) {
    return <div className="loading-message">Loading survey form...</div>;
  }

  return (
    <div className="survey-form-container">
      <h2 className="survey-title">{surveyData.title}</h2>
      {surveyData.description && (
        <p className="survey-description">{surveyData.description}</p>
      )}
      
      {isEditing && isSaving && (
        <p className="saving-indicator">Saving changes...</p>
      )}

      <form className="survey-questions">
        {surveyData.questions?.map((question, index) => {
          if (!question) return null;
          
          const safeQuestion = {
            id: question.id || `q-${index}`,
            type: question.type || 'text',
            label: question.label || `Question ${index + 1}`,
            options: question.options || []
          };

          return (
            <div key={safeQuestion.id} className="question-group">
              <label className="question-label">{safeQuestion.label}</label>
              
              {safeQuestion.type === 'text' && (
                <input
                  type="text"
                  name={safeQuestion.id}
                  value={values[safeQuestion.id] || ''}
                  onChange={(e) => handleInputChange(e, safeQuestion.type)}
                  className="form-input"
                  readOnly={!isEditing}
                />
              )}

              {safeQuestion.type === 'textarea' && (
                <textarea
                  name={safeQuestion.id}
                  value={values[safeQuestion.id] || ''}
                  onChange={(e) => handleInputChange(e, safeQuestion.type)}
                  className="form-textarea"
                  readOnly={!isEditing}
                  rows={4}
                />
              )}

              {safeQuestion.type === 'radio' && safeQuestion.options.map(option => (
                <div key={option} className="radio-option">
                  <input
                    type="radio"
                    name={safeQuestion.id}
                    value={option}
                    checked={values[safeQuestion.id] === option}
                    onChange={(e) => handleInputChange(e, safeQuestion.type)}
                    disabled={!isEditing}
                  />
                  <label>{option}</label>
                </div>
              ))}

              {safeQuestion.type === 'checkbox' && safeQuestion.options.map(option => (
                <div key={option} className="checkbox-option">
                  <input
                    type="checkbox"
                    name={safeQuestion.id}
                    value={option}
                    checked={values[safeQuestion.id]?.includes(option) || false}
                    onChange={(e) => handleInputChange(e, safeQuestion.type)}
                    disabled={!isEditing}
                  />
                  <label>{option}</label>
                </div>
              ))}

              {safeQuestion.type === 'number' && (
                <input
                  type="number"
                  name={safeQuestion.id}
                  value={values[safeQuestion.id] || ''}
                  onChange={(e) => handleInputChange(e, safeQuestion.type)}
                  className="form-input"
                  readOnly={!isEditing}
                />
              )}

              {safeQuestion.type === 'date' && (
                <input
                  type="date"
                  name={safeQuestion.id}
                  value={values[safeQuestion.id] || ''}
                  onChange={(e) => handleInputChange(e, safeQuestion.type)}
                  className="form-input"
                  readOnly={!isEditing}
                />
              )}
            </div>
          );
        })}
      </form>
    </div>
  );
};

SurveyForm.propTypes = {
  surveyData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      label: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string)
    }))
  }),
  values: PropTypes.object,
  onValueChange: PropTypes.func,
  isEditing: PropTypes.bool,
  isSaving: PropTypes.bool
};

SurveyForm.defaultProps = {
  surveyData: {
    title: 'Untitled Survey',
    description: '',
    questions: []
  },
  values: {},
  isEditing: false,
  isSaving: false
};

export default SurveyForm;