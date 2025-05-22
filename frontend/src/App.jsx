import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from './pages/EditorPage';

// Platzhalter-Komponenten für weitere Seiten
const PagesListPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Meine Landingpages</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600 mb-4">Hier werden deine Landingpages angezeigt.</p>
      <div className="flex justify-end">
        <a 
          href="/editor/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Neue Landingpage
        </a>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Einstellungen</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Hier kannst du die Einstellungen des CMS anpassen.</p>
    </div>
  </div>
);

const PluginsPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Plugins</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Hier kannst du Plugins verwalten und konfigurieren.</p>
    </div>
  </div>
);

const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <a href="/" className="text-xl font-bold">PixelMagix</a>
      <div className="space-x-4">
        <a href="/pages" className="hover:text-blue-300">Landingpages</a>
        <a href="/plugins" className="hover:text-blue-300">Plugins</a>
        <a href="/settings" className="hover:text-blue-300">Einstellungen</a>
      </div>
    </div>
  </nav>
);

const Layout = ({ children, hideNavbar = false }) => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    {!hideNavbar && <Navbar />}
    <main className="flex-grow">{children}</main>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Editor-Seite ohne Navbar */}
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
        
        <Route path="/plugins" element={
          <Layout>
            <PluginsPage />
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