import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GrapesEditor from '../editor/GrapesEditor';
import AIContentGenerator from '../components/AIContentGenerator';

const EditorPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Seite laden
  useEffect(() => {
    const fetchPage = async () => {
      if (!pageId || pageId === 'new') {
        // Neue Seite erstellen
        setPageData({
          title: 'Neue Seite',
          slug: `page-${Date.now()}`,
          description: '',
          html_content: '',
          css_content: '',
          js_content: '',
          is_published: false
        });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/pages/${pageId}`);
        setPageData(response.data);
      } catch (err) {
        console.error('Fehler beim Laden der Seite:', err);
        setError(err.response?.data?.detail || err.message || 'Seite konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  // Seite speichern
  const handleSave = async (editorContent) => {
    setSaveStatus('saving');
    
    try {
      const updatedPageData = {
        ...pageData,
        ...editorContent
      };

      let response;
      if (pageId && pageId !== 'new') {
        // Bestehende Seite aktualisieren
        response = await axios.put(`/api/pages/${pageId}`, updatedPageData);
      } else {
        // Neue Seite erstellen
        response = await axios.post('/api/pages/', updatedPageData);
        // Nach dem Erstellen zur Bearbeitungsseite der neuen Seite navigieren
        navigate(`/editor/${response.data.id}`, { replace: true });
      }

      setPageData(response.data);
      setSaveStatus('saved');
      
      // Status nach 3 Sekunden zurücksetzen
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Fehler beim Speichern der Seite:', err);
      setSaveStatus('error');
      setError(err.response?.data?.detail || err.message || 'Seite konnte nicht gespeichert werden');
      
      // Fehlerstatus nach 3 Sekunden zurücksetzen
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Seite exportieren
  const handleExport = async () => {
    if (!pageId || pageId === 'new') {
      alert('Bitte speichern Sie die Seite zuerst, bevor Sie sie exportieren.');
      return;
    }

    try {
      const response = await axios.post(`/api/pages/${pageId}/export`, { create_zip: true });
      
      // Download-Link erstellen und klicken
      window.location.href = `/api/pages/${pageId}/download`;
    } catch (err) {
      console.error('Fehler beim Exportieren der Seite:', err);
      alert('Fehler beim Exportieren: ' + (err.response?.data?.detail || err.message));
    }
  };

  // KI-generierte Inhalte in den Editor laden
  const handleContentGenerated = (content) => {
    // Diese Funktion wird an den GrapesEditor weitergegeben
    // und dort implementiert, um die generierten Inhalte zu laden
    if (window.editor) {
      window.editor.loadAiContent(content);
    }
    
    // KI-Panel nach erfolgreicher Generierung schließen
    setShowAiPanel(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Lade Editor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <h3 className="font-bold">Fehler</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/pages')} 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page-container h-screen flex flex-col">
      {/* Header-Leiste */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            {pageData?.title || 'Neue Seite'}
          </h1>
          {saveStatus === 'saving' && (
            <span className="ml-4 text-yellow-300 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Speichern...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="ml-4 text-green-400">✓ Gespeichert</span>
          )}
          {saveStatus === 'error' && (
            <span className="ml-4 text-red-400">Fehler beim Speichern</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-2">KI-Inhalte</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-2">Exportieren</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => navigate('/pages')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Zurück
          </button>
        </div>
      </header>
      
      {/* Hauptbereich mit Editor und optionalem KI-Panel */}
      <div className="flex-grow flex relative overflow-hidden">
        {/* GrapesJS-Editor */}
        <div className="flex-grow">
          <GrapesEditor 
            pageData={pageData} 
            onSave={handleSave} 
          />
        </div>
        
        {/* KI-Panel (einblendbar) */}
        {showAiPanel && (
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg z-10 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">KI-Inhaltsgenerierung</h2>
              <button 
                onClick={() => setShowAiPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <AIContentGenerator onContentGenerated={handleContentGenerated} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;