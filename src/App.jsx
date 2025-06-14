import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

const mockSurveys = [
  {
    id: 'survey-1',
    title: 'Customer Feedback Survey',
    description: 'Help us improve our services!',
    questions: [
      { id: 'q1', type: 'text', label: 'Your Name' },
      { id: 'q2', type: 'textarea', label: 'Any suggestions for improvement?' },
      { id: 'q3', type: 'radio', label: 'How satisfied are you?', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] }
    ]
  },
  {
    id: 'survey-2',
    title: 'Product Interest Survey',
    description: 'Tell us about your preferences.',
    questions: [
      { id: 'q4', type: 'checkbox', label: 'Which features are you interested in?', options: ['Feature A', 'Feature B', 'Feature C'] },
      { id: 'q5', type: 'number', label: 'How many times per week do you use our product?' }
    ]
  },
  {
    id: 'survey-3',
    title: 'Event Registration Form',
    description: 'Register for our upcoming event!',
    questions: [
      { id: 'q6', type: 'text', label: 'Full Name' },
      { id: 'q7', type: 'text', label: 'Email Address' },
      { id: 'q8', type: 'date', label: 'Preferred Event Date' }
    ]
  }
];

const fetchSurveyData = async (surveyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const survey = mockSurveys.find(s => s.id === surveyId);
      resolve(survey ? { ...survey } : null);
    }, 500);
  });
};

const withAutoSave = (WrappedComponent) => {
  return function AutoSaveWrapper(props) {
    const { onFormChange: parentOnFormChange, onSave, surveyData, ...restProps } = props;
    const saveTimerRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
      if (surveyData) {
        const initialValues = {};
        surveyData.questions.forEach(q => {
          if (q.type === 'checkbox') {
            initialValues[q.id] = [];
          } else {
            initialValues[q.id] = '';
          }
        });
        setFormData(initialValues);
      }
    }, [surveyData]);

    const debouncedSave = useCallback((data) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      setIsSaving(true);
      saveTimerRef.current = setTimeout(() => {
        console.log('Auto-saving data:', data);
        if (onSave) {
          onSave(data);
        }
        setIsSaving(false);
      }, 1000);
    }, [onSave]);

    const handleValueChange = useCallback((newValues) => {
      setFormData(newValues);
      if (parentOnFormChange) {
        parentOnFormChange(newValues);
      }
      debouncedSave(newValues);
    }, [parentOnFormChange, debouncedSave]);

    useEffect(() => {
      return () => {
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current);
        }
      };
    }, []);

    return (
      <WrappedComponent
        {...restProps}
        surveyData={surveyData}
        values={formData}
        onValueChange={handleValueChange}
        isSaving={isSaving}
      />
    );
  };
};

const SurveyForm = ({ surveyData, values, onValueChange, isEditing = false, isSaving = false }) => {
  if (!surveyData) {
    return <div className="text-secondary fs-5">Loading survey...</div>;
  }

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

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h2 className="fs-3 fw-semibold text-dark mb-3">{surveyData.title}</h2>
      <p className="text-secondary mb-4">{surveyData.description}</p>
      {isEditing && isSaving && (
        <p className="text-success small mb-2 pulse-animation">Saving changes...</p>
      )}
      <form>
        {surveyData.questions.map((question) => (
          <div key={question.id} className="mb-4">
            <label htmlFor={question.id} className="form-label fs-5 text-dark mb-2">
              {question.label}
            </label>
            {question.type === 'text' && (
              <input
                type="text"
                id={question.id}
                name={question.id}
                value={values[question.id] || ''}
                onChange={(e) => handleInputChange(e, question.type)}
                className="form-control"
                readOnly={!isEditing}
              />
            )}
            {question.type === 'textarea' && (
              <textarea
                id={question.id}
                name={question.id}
                value={values[question.id] || ''}
                onChange={(e) => handleInputChange(e, question.type)}
                rows="4"
                className="form-control"
                readOnly={!isEditing}
              ></textarea>
            )}
            {question.type === 'radio' && (
              <div className="d-flex flex-column">
                {question.options.map(option => (
                  <div key={option} className="form-check">
                    <input
                      type="radio"
                      name={question.id}
                      id={`${question.id}-${option}`}
                      value={option}
                      checked={values[question.id] === option}
                      onChange={(e) => handleInputChange(e, question.type)}
                      className="form-check-input"
                      disabled={!isEditing}
                    />
                    <label className="form-check-label text-dark" htmlFor={`${question.id}-${option}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {question.type === 'checkbox' && (
              <div className="d-flex flex-column">
                {question.options.map(option => (
                  <div key={option} className="form-check">
                    <input
                      type="checkbox"
                      name={question.id}
                      id={`${question.id}-${option}`}
                      value={option}
                      checked={values[question.id]?.includes(option) || false}
                      onChange={(e) => handleInputChange(e, question.type)}
                      className="form-check-input"
                      disabled={!isEditing}
                    />
                    <label className="form-check-label text-dark" htmlFor={`${question.id}-${option}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {question.type === 'number' && (
              <input
                type="number"
                id={question.id}
                name={question.id}
                value={values[question.id] || ''}
                onChange={(e) => handleInputChange(e, question.type)}
                className="form-control"
                readOnly={!isEditing}
              />
            )}
            {question.type === 'date' && (
              <input
                type="date"
                id={question.id}
                name={question.id}
                value={values[question.id] || ''}
                onChange={(e) => handleInputChange(e, question.type)}
                className="form-control"
                readOnly={!isEditing}
              />
            )}
          </div>
        ))}
        {!isEditing && (
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-pill shadow-sm"
            >
              Submit Survey
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const AutoSaveSurveyForm = withAutoSave(SurveyForm);

const SurveyPreviewPortal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header border-bottom-0 pb-3">
            <h5 className="modal-title text-dark">Live Survey Preview</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const SurveyDashboard = ({ onEditSurvey, onViewSurvey }) => {
  return (
    <div className="container">
      <h2 className="fs-2 fw-bold text-white mb-5 text-center text-shadow">
        Available Surveys
      </h2>
      <div className="row g-4 justify-content-center">
        {mockSurveys.map((survey) => (
          <div key={survey.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 rounded-3 shadow-lg hover-scale">
              <div className="card-body p-4">
                <h3 className="card-title fs-4 fw-semibold text-dark mb-2">{survey.title}</h3>
                <p className="card-text text-secondary small mb-4">{survey.description}</p>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    onClick={() => onEditSurvey(survey.id)}
                    className="btn btn-sm btn-primary rounded-pill shadow-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onViewSurvey(survey.id)}
                    className="btn btn-sm btn-outline-secondary rounded-pill shadow-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SurveyEditor = ({ surveyId, onBack }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState({});

  useEffect(() => {
    const loadSurvey = async () => {
      const data = await fetchSurveyData(surveyId);
      setSurveyData(data);
      if (data) {
        const initialData = {};
        data.questions.forEach(q => {
          if (q.type === 'checkbox') {
            initialData[q.id] = [];
          } else {
            initialData[q.id] = '';
          }
        });
        setCurrentFormData(initialData);
      }
    };
    loadSurvey();
  }, [surveyId]);

  const handleSave = (data) => {
    console.log('Survey data saved to backend:', data);
  };

  const handleFormChangeForPreview = (data) => {
    setCurrentFormData(data);
  };

  if (!surveyData) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-lg text-dark mx-auto" style={{ maxWidth: '500px' }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading survey for editing...</p>
        <button
          onClick={onBack}
          className="btn btn-secondary mt-3 rounded-pill shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container bg-white rounded-4 shadow-lg p-4 p-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h1 className="fs-3 fw-bold text-dark">Edit Survey: {surveyData.title}</h1>
        <button
          onClick={onBack}
          className="btn btn-secondary rounded-pill shadow-sm"
        >
          Back
        </button>
      </div>

      <AutoSaveSurveyForm
        surveyData={surveyData}
        onFormChange={handleFormChangeForPreview}
        onSave={handleSave}
        isEditing={true}
      />

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="btn btn-info btn-lg rounded-pill shadow-sm text-white"
        >
          Live Preview (Portal)
        </button>
      </div>

      <SurveyPreviewPortal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <SurveyForm surveyData={surveyData} isEditing={false} values={currentFormData} />
      </SurveyPreviewPortal>
    </div>
  );
};

const SurveyViewer = ({ surveyId, onBack }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [initialViewerData, setInitialViewerData] = useState({});

  useEffect(() => {
    const loadSurvey = async () => {
      const data = await fetchSurveyData(surveyId);
      setSurveyData(data);
      if (data) {
        const viewerInitialData = {};
        data.questions.forEach(q => {
          if (q.type === 'checkbox') {
            viewerInitialData[q.id] = [];
          } else {
            viewerInitialData[q.id] = '';
          }
        });
        setInitialViewerData(viewerInitialData);
      }
    };
    loadSurvey();
  }, [surveyId]);

  if (!surveyData) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-lg text-dark mx-auto" style={{ maxWidth: '500px' }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading survey for viewing...</p>
        <button
          onClick={onBack}
          className="btn btn-secondary mt-3 rounded-pill shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container bg-white rounded-4 shadow-lg p-4 p-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h1 className="fs-3 fw-bold text-dark">View Survey: {surveyData.title}</h1>
        <button
          onClick={onBack}
          className="btn btn-secondary rounded-pill shadow-sm"
        >
          Back
        </button>
      </div>
      <SurveyForm surveyData={surveyData} isEditing={false} values={initialViewerData} />
    </div>
  );
};

function App() {
  useEffect(() => {
    const bootstrapCssLink = document.createElement('link');
    bootstrapCssLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    bootstrapCssLink.rel = 'stylesheet';
    bootstrapCssLink.integrity = 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH';
    bootstrapCssLink.crossOrigin = 'anonymous';
    document.head.appendChild(bootstrapCssLink);

    const bootstrapJsScript = document.createElement('script');
    bootstrapJsScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    bootstrapJsScript.integrity = 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz';
    bootstrapJsScript.crossOrigin = 'anonymous';
    document.body.appendChild(bootstrapJsScript);

    return () => {
      document.head.removeChild(bootstrapCssLink);
      document.body.removeChild(bootstrapJsScript);
    };
  }, []);

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNavigate = (page, surveyId = null) => {
    setCurrentPage(page);
    setSelectedSurveyId(surveyId);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <SurveyDashboard
            onEditSurvey={(id) => handleNavigate('edit', id)}
            onViewSurvey={(id) => handleNavigate('view', id)}
          />
        );
      case 'edit':
        return (
          <SurveyEditor
            surveyId={selectedSurveyId}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      case 'view':
        return (
          <SurveyViewer
            surveyId={selectedSurveyId}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      default:
        return (
          <div className="text-white text-center fs-4">404: Page Not Found</div>
        );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-gradient-custom justify-content-center align-items-center p-3">
      <div
        className={`w-100 d-flex justify-content-center transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {renderContent()}
      </div>

      <style>{`
        .bg-gradient-custom {
          background: linear-gradient(to bottom right, #770111, #11349a); 
        }
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .hover-scale {
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .hover-scale:hover {
          transform: scale(1.03);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .transition-opacity {
          transition: opacity 1s ease-out;
        }
        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
      `}</style>
    </div>
  );
}

export default App;