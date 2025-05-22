import React, { useState } from 'react';
import axios from 'axios';

const AIContentGenerator = ({ onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    target_audience: '',
    industry: '',
    page_goal: '',
    additional_info: ''
  });

  // Formularänderungen verarbeiten
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="ai-content-generator bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">KI-Inhaltsgenerierung</h2>
      <p className="mb-4 text-gray-600">
        Generiere komplette Landingpage-Inhalte basierend auf deinen Eingaben.
        Beschreibe deine Zielgruppe, Branche und das Ziel deiner Seite, um maßgeschneiderte Inhalte zu erhalten.
      </p>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-1">
            Zielgruppe
          </label>
          <input
            type="text"
            id="target_audience"
            name="target_audience"
            value={formData.target_audience}
            onChange={handleChange}
            required
            placeholder="z.B. Kleine Unternehmen, Freelancer, Sportbegeisterte"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Branche / Thema
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            placeholder="z.B. IT-Dienstleistungen, Fitness, Handwerk"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="page_goal" className="block text-sm font-medium text-gray-700 mb-1">
            Ziel der Seite
          </label>
          <select
            id="page_goal"
            name="page_goal"
            value={formData.page_goal}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Bitte wählen...</option>
            <option value="lead_generation">Lead-Generierung</option>
            <option value="sales">Verkauf / Conversion</option>
            <option value="information">Information / Aufklärung</option>
            <option value="newsletter">Newsletter-Anmeldungen</option>
            <option value="event">Event-Anmeldungen</option>
            <option value="download">Download-Angebote</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-1">
            Zusätzliche Informationen (optional)
          </label>
          <textarea
            id="additional_info"
            name="additional_info"
            value={formData.additional_info}
            onChange={handleChange}
            rows="4"
            placeholder="Weitere Details, spezifische Anforderungen oder Schlüsselbotschaften"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
          >
            {loading ? 'Generiere Inhalte...' : 'Inhalte generieren'}
          </button>
        </div>
      </form>
      
      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">KI generiert Inhalte... Dies kann einen Moment dauern.</p>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;