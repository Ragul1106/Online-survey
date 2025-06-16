import { useState, useEffect, useCallback, useRef } from 'react';

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
          initialValues[q.id] = q.type === 'checkbox' ? [] : '';
        });
        setFormData(initialValues);
      }
    }, [surveyData]);

    const debouncedSave = useCallback((data) => {
      clearTimeout(saveTimerRef.current);
      setIsSaving(true);
      saveTimerRef.current = setTimeout(() => {
        onSave?.(data);
        setIsSaving(false);
      }, 1000);
    }, [onSave]);

    const handleValueChange = useCallback((newValues) => {
      setFormData(newValues);
      parentOnFormChange?.(newValues);
      debouncedSave(newValues);
    }, [parentOnFormChange, debouncedSave]);

    useEffect(() => {
      return () => clearTimeout(saveTimerRef.current);
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

export default withAutoSave;