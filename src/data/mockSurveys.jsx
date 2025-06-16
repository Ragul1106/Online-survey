export const mockSurveys = [
  {
    id: 'survey-1',
    title: 'Customer Feedback Survey',
    description: 'Help us improve our services!',
    questions: [
      { id: 'q1', type: 'text', label: 'Your Name', required: true },
      { id: 'q2', type: 'textarea', label: 'Any suggestions for improvement?', placeholder: 'Enter your feedback here...' },
      { id: 'q3', type: 'radio', label: 'How satisfied are you?', 
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
        required: true
      },
      { id: 'q4', type: 'rating', label: 'Rate your overall experience', 
        scale: 5,
        labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      }
    ]
  },
  {
    id: 'survey-2',
    title: 'Product Interest Survey',
    description: 'Tell us about your preferences.',
    questions: [
      { id: 'q1', type: 'checkbox', label: 'Which features are you interested in?', 
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'],
        required: true
      },
      { id: 'q2', type: 'number', label: 'How many times per week do you use our product?', 
        min: 0, max: 100
      },
      { id: 'q3', type: 'dropdown', label: 'Which age group do you belong to?',
        options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+']
      },
      { id: 'q4', type: 'date', label: 'When did you first use our product?' }
    ]
  },
  {
    id: 'survey-3',
    title: 'Employee Satisfaction Survey',
    description: 'Confidential feedback about your workplace.',
    questions: [
      { id: 'q1', type: 'radio', label: 'How would you rate your work-life balance?',
        options: ['Excellent', 'Good', 'Neutral', 'Poor', 'Terrible'],
        required: true
      },
      { id: 'q2', type: 'checkbox', label: 'What would improve your job satisfaction?',
        options: ['Better pay', 'More flexibility', 'Career growth', 'Better management', 'Team activities']
      },
      { id: 'q3', type: 'text', label: 'What do you enjoy most about your job?' },
      { id: 'q4', type: 'textarea', label: 'Additional comments or concerns' }
    ]
  },
  {
    id: 'survey-4',
    title: 'Health and Wellness Check',
    description: 'Anonymous health assessment',
    questions: [
      { id: 'q1', type: 'radio', label: 'How often do you exercise?',
        options: ['Daily', '3-5 times/week', '1-2 times/week', 'Rarely', 'Never']
      },
      { id: 'q2', type: 'number', label: 'Average hours of sleep per night', min: 0, max: 24 },
      { id: 'q3', type: 'checkbox', label: 'Dietary preferences',
        options: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto', 'Paleo']
      },
      { id: 'q4', type: 'slider', label: 'Stress level (1-10)', min: 1, max: 10 }
    ]
  },
  {
    id: 'survey-5',
    title: 'Event Feedback',
    description: 'Tell us about your experience at our event',
    questions: [
      { id: 'q1', type: 'radio', label: 'How did you hear about this event?',
        options: ['Social Media', 'Email', 'Friend', 'Website', 'Other']
      },
      { id: 'q2', type: 'rating', label: 'Rate the event organization', scale: 5 },
      { id: 'q3', type: 'checkbox', label: 'Which sessions did you attend?',
        options: ['Keynote', 'Workshop A', 'Workshop B', 'Networking', 'Closing']
      },
      { id: 'q4', type: 'textarea', label: 'Suggestions for future events' },
      { id: 'q5', type: 'radio', label: 'Would you attend again?',
        options: ['Definitely', 'Probably', 'Maybe', 'Probably not', 'Definitely not']
      }
    ]
  },
  {
    id: 'survey-6',
    title: 'Technology Usage Survey',
    description: 'Understanding your tech habits',
    questions: [
      { id: 'q1', type: 'dropdown', label: 'Primary device used',
        options: ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Other']
      },
      { id: 'q2', type: 'checkbox', label: 'Which social platforms do you use daily?',
        options: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Reddit']
      },
      { id: 'q3', type: 'number', label: 'Hours spent on devices daily', min: 0, max: 24 },
      { id: 'q4', type: 'radio', label: 'How tech-savvy do you consider yourself?',
        options: ['Expert', 'Advanced', 'Intermediate', 'Beginner', 'Novice']
      }
    ]
  }
];