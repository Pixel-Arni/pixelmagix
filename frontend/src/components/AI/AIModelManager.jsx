import React, { useState } from 'react';
import axios from 'axios';

const AIContentGenerator = ({ onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    target_audience: '',
    industry: '',
    page_goal: '',
    additional_info: '',
    company_name: '',
    brand_colors: '',
    tone: 'professional'
  });

  const steps = [
    {
      id: 1,
      title: 'Grundlagen',
      description: 'Zielgruppe und Branche definieren'
    },
    {
      id: 2,
      title: 'Ziele',
      description: 'Seitenziel und Tonalität festlegen'
    },
    {
      id: 3,
      title: 'Details',
      description: 'Zusätzliche Informationen'
    }
  ];

  const industries = [
    'Technologie & IT',
    'E-Commerce & Handel',
    'Gesundheit & Medizin',
    'Bildung & Training',
    'Finanzdienstleistungen',
    'Immobilien',
    'Restaurant & Gastronomie',
    'Fitness & Sport',
    'Handwerk & Dienstleistungen',
    'Beratung & Coaching',
    'Kreativ & Design',
    'Automotive',
    'Tourismus & Reisen',
    'Non-Profit',
    'Sonstiges'
  ];

  const pageGoals = [
    { value: 'lead_generation', label: 'Lead-Generierung', description: 'Kontaktdaten sammeln' },
    { value: 'sales', label: 'Verkauf', description: 'Produkte oder Services verkaufen' },
    { value: 'information', label: 'Information', description: 'Über Unternehmen informieren' },
    { value: 'newsletter', label: 'Newsletter', description: 'Newsletter-Anmeldungen' },
    { value: 'event', label: 'Event', description: 'Event-Anmeldungen' },
    { value: 'download', label: 'Download', description: 'Download-Angebote' },
    { value: 'booking', label: 'Buchung', description: 'Termine oder Services buchen' }
  ];

  const tones = [
    { value: 'professional', label: 'Professionell', description: 'Seriös und vertrauenswürdig' },
    { value: 'friendly', label: 'Freundlich', description: 'Warm und einladend' },
    { value: 'creative', label: 'Kreativ', description: 'Innovativ und inspirierend' },
    { value: 'authoritative', label: 'Autoritativ', description: 'Kompetent und überzeugend' },
    { value: 'casual', label: 'Locker', description: 'Entspannt und zugänglich' }
  ];

  // Formularänderungen verarbeiten
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Nächster Schritt
  const nextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  // Vorheriger Schritt
  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Validierung für aktuellen Schritt
  const isStepValid = () => {
    switch (activeStep) {
      case 1:
        return formData.target_audience && formData.industry;
      case 2:
        return formData.page_goal && formData.tone;
      case 3:
        return true; // Optionale Felder
      default:
        return false;
    }
  };

  // Formular absenden und Inhalte generieren
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/ai/generate-landing-page', formData);
      
      if (response.data && response.data.content) {
        // Generierte Inhalte an die übergeordnete Komponente weitergeben
        if (onContentGenerated) {
          onContentGenerated(response.data.content);
        }
      } else {
        throw new Error('Keine Inhalte in der Antwort gefunden');
      }
    } catch (err) {
      console.error('Fehler bei der Inhaltsgenerierung:', err);
      setError(err.response?.data?.detail || err.message || 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  // Schritt-Inhalt rendern
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="target_audience" className="form-label">
                Zielgruppe *
              </label>
              <input
                type="text"
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                placeholder="z.B. Kleine Unternehmen, Startups, Freelancer"
                className="form-input"
                required
              />
              <p className="form-help">
                Beschreiben Sie Ihre Zielgruppe so spezifisch wie möglich.
              </p>
            </div>
            
            <div>
              <label htmlFor="industry" className="form-label">
                Branche *
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Branche auswählen...</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="company_name" className="form-label">
                Unternehmensname
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Name Ihres Unternehmens"
                className="form-input"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">Ziel der Landingpage *</label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {pageGoals.map(goal => (
                  <label key={goal.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="page_goal"
                      value={goal.value}
                      checked={formData.page_goal === goal.value}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{goal.label}</div>
                      <div className="text-sm text-gray-600">{goal.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Tonalität *</label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {tones.map(tone => (
                  <label key={tone.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="tone"
                      value={tone.value}
                      checked={formData.tone === tone.value}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{tone.label}</div>
                      <div className="text-sm text-gray-600">{tone.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="additional_info" className="form-label">
                Zusätzliche Informationen
              </label>
              <textarea
                id="additional_info"
                name="additional_info"
                value={formData.additional_info}
                onChange={handleChange}
                rows="4"
                placeholder="Besondere Merkmale, USPs, wichtige Botschaften..."
                className="form-textarea"
              />
              <p className="form-help">
                Teilen Sie zusätzliche Details mit, die für Ihre Landingpage wichtig sind.
              </p>
            </div>

            <div>
              <label htmlFor="brand_colors" className="form-label">
                Markenfarben
              </label>
              <input
                type="text"
                id="brand_colors"
                name="brand_colors"
                value={formData.brand_colors}
                onChange={handleChange}
                placeholder="z.B. Blau, Weiß, #3B82F6"
                className="form-input"
              />
              <p className="form-help">
                Geben Sie Ihre Markenfarben an (optional).
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Bereit für die Generierung</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Ihre Eingaben werden verwendet, um eine maßgeschneiderte Landingpage zu erstellen.
                    Der Vorgang kann 30-60 Sekunden dauern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">KI-Inhaltsgenerierung</h2>
        <p className="text-purple-100 mt-1">
          Erstellen Sie professionelle Landingpages in wenigen Schritten
        </p>
      </div>

      {/* Schritt-Anzeige */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                activeStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {activeStep > step.id ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  activeStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  activeStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fehleranzeige */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-900">Fehler bei der Generierung</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formular-Inhalt */}
      <form onSubmit={handleSubmit} className="p-6">
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={activeStep === 1}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück
          </button>

          {activeStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Weiter
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !isStepValid()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inhalte werden generiert...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Landingpage erstellen
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Loading-Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">KI generiert Ihre Landingpage...</p>
            <p className="text-sm text-gray-500 mt-2">Dies kann einen Moment dauern</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;