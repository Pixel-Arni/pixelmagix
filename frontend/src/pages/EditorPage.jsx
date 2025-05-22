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
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Seite laden
  useEffect(() => {
    const fetchPage = async () => {
      if (!pageId || pageId === 'new') {
        // Neue Seite erstellen
        setPageData({
          title: 'Neue Landingpage',
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

  // Seite veröffentlichen/unveröffentlichen
  const togglePublish = async () => {
    try {
      const updatedData = { ...pageData, is_published: !pageData.is_published };
      const response = await axios.put(`/api/pages/${pageId}`, updatedData);
      setPageData(response.data);
    } catch (err) {
      console.error('Fehler beim Veröffentlichen:', err);
      setError('Fehler beim Veröffentlichen der Seite');
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

  // KI-generierte Inhalte laden
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
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Editor wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Fehler</h3>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => navigate('/pages')} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Zurück zur Übersicht
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page-container h-screen flex flex-col bg-gray-50">
      {/* Moderne Header-Leiste */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Linke Seite - Titel und Status */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/pages')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück
            </button>
            
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {pageData?.title || 'Neue Seite'}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pageData?.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {pageData?.is_published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
                
                {saveStatus && (
                  <div className="flex items-center text-sm">
                    {saveStatus === 'saving' && (
                      <span className="text-yellow-600 flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Speichern...
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span className="text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Gespeichert
                      </span>
                    )}
                    {saveStatus === 'error' && (
                      <span className="text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Fehler beim Speichern
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Rechte Seite - Aktionen */}
          <div className="flex items-center space-x-3">
            {/* View Controls */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  !showPreview ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bearbeiten
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  showPreview ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Vorschau
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                KI-Assistent
              </button>
              
              <button 
                onClick={togglePublish}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 ${
                  pageData?.is_published 
                    ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' 
                    : 'bg-green-100 hover:bg-green-200 text-green-800'
                }`}
              >
                {pageData?.is_published ? 'Unveröffentlichen' : 'Veröffentlichen'}
              </button>
              
              <button 
                onClick={handleExport}
                className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportieren
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hauptbereich mit Editor und optionalem KI-Panel */}
      <div className="flex-grow flex relative overflow-hidden">
        {/* GrapesJS-Editor */}
        <div className="flex-grow relative">
          <GrapesEditor 
            pageData={pageData} 
            onSave={handleSave}
            showPreview={showPreview}
          />
        </div>
        
        {/* KI-Panel (Slide-in von rechts) */}
        <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          showAiPanel ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">KI-Assistent</h2>
                <p className="text-sm text-gray-600 mt-1">Generieren Sie Inhalte mit KI</p>
              </div>
              <button 
                onClick={() => setShowAiPanel(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AIContentGenerator onContentGenerated={handleContentGenerated} />
            </div>
          </div>
        </div>

        {/* Overlay für KI-Panel (Mobile) */}
        {showAiPanel && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowAiPanel(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;