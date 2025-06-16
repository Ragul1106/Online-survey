import { mockSurveys } from '../data/mockSurveys';

export const fetchSurveyData = async (surveyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const survey = mockSurveys.find(s => s.id === surveyId);
      resolve(survey ? { ...survey } : null);
    }, 500);
  });
};

export const saveSurveyResponse = async (surveyId, responseData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saved response:', { surveyId, responseData });
      resolve({ success: true });
    }, 800);
  });
};

export const fetchAllSurveys = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockSurveys]), 300);
  });
};