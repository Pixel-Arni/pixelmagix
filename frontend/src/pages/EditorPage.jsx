import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GrapesEditor from '../editor/GrapesEditor';

const EditorPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        console.log('📄 Lade Seite mit ID:', pageId);
        const response = await axios.get(`http://localhost:8000/api/pages/${pageId}`);
        console.log('✅ Seitendaten geladen:', response.data);
        setPageData(response.data);
      } catch (err) {
        console.error('❌ Fehler beim Laden der Seite:', err);
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
    console.log('💾 Speichere Seite...', editorContent);
    
    try {
      const updatedPageData = {
        ...pageData,
        ...editorContent
      };

      let response;
      if (pageId && pageId !== 'new') {
        // Bestehende Seite aktualisieren
        response = await axios.put(`http://localhost:8000/api/pages/${pageId}`, updatedPageData);
      } else {
        // Neue Seite erstellen
        response = await axios.post('http://localhost:8000/api/pages/', updatedPageData);
        // Nach dem Erstellen zur Bearbeitungsseite der neuen Seite navigieren
        navigate(`/editor/${response.data.id}`, { replace: true });
      }

      setPageData(response.data);
      setSaveStatus('saved');
      console.log('✅ Seite gespeichert');
      
      // Status nach 3 Sekunden zurücksetzen
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('❌ Fehler beim Speichern der Seite:', err);
      setSaveStatus('error');
      setError(err.response?.data?.detail || err.message || 'Seite konnte nicht gespeichert werden');
      
      // Fehlerstatus nach 3 Sekunden zurücksetzen
      setTimeout(() => setSaveStatus(null), 3000);
    }
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
            onClick={() => navigate('/pages')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Zurück
          </button>
        </div>
      </header>
      
      {/* GrapesJS-Editor */}
      <div className="flex-grow">
        <GrapesEditor 
          pageData={pageData} 
          onSave={handleSave} 
        />
      </div>
    </div>
  );
};

export default EditorPage;