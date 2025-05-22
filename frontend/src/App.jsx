import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import axios from 'axios';

// Seiten-Übersicht Komponente mit verbessertem Design
const PagesListPage = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/pages/');
      setPages(response.data);
    } catch (err) {
      console.error('Fehler beim Laden der Seiten:', err);
      setError('Fehler beim Laden der Seiten');
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (pageId) => {
    if (!window.confirm('Möchten Sie diese Seite wirklich löschen?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/pages/${pageId}`);
      await fetchPages(); // Seiten neu laden
    } catch (err) {
      console.error('Fehler beim Löschen der Seite:', err);
      alert('Fehler beim Löschen der Seite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-lg font-medium text-gray-700">Lade Seiten...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Meine Landingpages</h1>
            <p className="text-gray-600">Erstelle und verwalte deine Landing Pages mit KI-Unterstützung</p>
          </div>
          <Link 
            to="/editor/new" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Neue Landingpage
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {pages.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Noch keine Landingpages erstellt</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Beginne jetzt mit der Erstellung deiner ersten professionellen Landing Page mit unserem visuellen Editor und KI-Unterstützung.
              </p>
              <Link 
                to="/editor/new" 
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Erste Landingpage erstellen
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seite
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Erstellt
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{page.title}</div>
                            {page.description && (
                              <div className="text-sm text-gray-500">{page.description.substring(0, 100)}...</div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">/{page.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          page.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            page.is_published ? 'bg-green-400' : 'bg-yellow-400'
                          }`}></span>
                          {page.is_published ? 'Veröffentlicht' : 'Entwurf'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(page.created_at).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <Link
                          to={`/editor/${page.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium hover:underline transition-colors duration-150"
                        >
                          Bearbeiten
                        </Link>
                        <button
                          onClick={() => deletePage(page.id)}
                          className="text-red-600 hover:text-red-900 font-medium hover:underline transition-colors duration-150"
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {pages.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{pages.length}</div>
                <div className="text-gray-600">Gesamt Seiten</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {pages.filter(p => p.is_published).length}
                </div>
                <div className="text-gray-600">Veröffentlicht</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {pages.filter(p => !p.is_published).length}
                </div>
                <div className="text-gray-600">Entwürfe</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Einstellungen Seite mit Design
const SettingsPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Einstellungen</h1>
        
        <div className="grid gap-6">
          {/* Allgemeine Einstellungen */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Allgemeine Einstellungen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website-Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="PixelMagix" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Standard-Sprache</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Deutsch</option>
                  <option>Englisch</option>
                </select>
              </div>
            </div>
          </div>

          {/* KI-Einstellungen */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">KI-Einstellungen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KI-Modell</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Fallback (Offline)</option>
                  <option>GPT-4 (API erforderlich)</option>
                  <option>Claude (API erforderlich)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span className="ml-2 text-sm text-gray-700">KI-Inhalte automatisch optimieren</span>
                </label>
              </div>
            </div>
          </div>

          {/* Export-Einstellungen */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Export-Einstellungen</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">CSS minifizieren</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">SEO-Meta-Tags automatisch hinzufügen</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            Einstellungen speichern
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Navigation mit verbessertem Design
const Navbar = () => (
  <nav className="bg-white shadow-lg border-b border-gray-200">
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center py-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PixelMagix
          </span>
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link 
            to="/pages" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Landingpages</span>
          </Link>
          
          <Link 
            to="/settings" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Einstellungen</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link 
              to="/editor/new"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Neue Seite</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// Layout-Komponente
const Layout = ({ children, hideNavbar = false }) => (
  <div className="min-h-screen bg-gray-50">
    {!hideNavbar && <Navbar />}
    <main className="flex-grow">{children}</main>
  </div>
);

// Hauptanwendung
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Editor-Seite ohne Navbar für Vollbild-Erlebnis */}
        <Route path="/editor/:pageId" element={
          <Layout hideNavbar={true}>
            <EditorPage />
          </Layout>
        } />
        
        {/* Seiten mit Navbar */}
        <Route path="/pages" element={
          <Layout>
            <PagesListPage />
          </Layout>
        } />
        
        <Route path="/settings" element={
          <Layout>
            <SettingsPage />
          </Layout>
        } />
        
        {/* Standardumleitung zur Seitenübersicht */}
        <Route path="/" element={<Navigate to="/pages" replace />} />
        <Route path="*" element={<Navigate to="/pages" replace />} />
      </Routes>
    </Router>
  );
};

export default App;