import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import EditorPage from './pages/EditorPage';

// Dashboard-Komponente
const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Willkommen bei PixelMagix</h1>
              <p className="text-xl opacity-90">Erstellen Sie professionelle Landingpages mit KI-Unterstützung</p>
            </div>
            <div className="hidden md:block">
              <svg className="w-24 h-24 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">3</h3>
                <p className="text-gray-600">Landingpages</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">1</h3>
                <p className="text-gray-600">Veröffentlicht</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">2</h3>
                <p className="text-gray-600">Aktive Plugins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Schnellstart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                to="/editor/new" 
                className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Neue Landingpage</h3>
                  <p className="text-sm text-gray-600">Mit dem Editor starten</p>
                </div>
              </Link>

              <Link 
                to="/pages" 
                className="group flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-2 bg-green-500 rounded-lg text-white group-hover:bg-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Seiten verwalten</h3>
                  <p className="text-sm text-gray-600">Alle Landingpages anzeigen</p>
                </div>
              </Link>

              <Link 
                to="/ai" 
                className="group flex items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-2 bg-purple-500 rounded-lg text-white group-hover:bg-purple-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">KI-Assistent</h3>
                  <p className="text-sm text-gray-600">Mit KI Inhalte generieren</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Letzte Aktivitäten</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="ml-3 text-gray-700">Willkommen bei PixelMagix!</span>
                <span className="ml-auto text-sm text-gray-500">gerade eben</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="ml-3 text-gray-700">System erfolgreich gestartet</span>
                <span className="ml-auto text-sm text-gray-500">vor 1 Minute</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Weitere Seiten-Komponenten
const PagesListPage = () => (
  <div className="max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Meine Landingpages</h1>
      <Link 
        to="/editor/new" 
        className="btn btn-primary flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Neue Landingpage
      </Link>
    </div>
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className="text-gray-600 mb-4">Hier werden deine Landingpages angezeigt.</p>
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 mb-4">Noch keine Landingpages erstellt</p>
        <Link to="/editor/new" className="btn btn-primary">
          Erste Landingpage erstellen
        </Link>
      </div>
    </div>
  </div>
);

const AIPage = () => (
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">KI-Assistent</h1>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">KI-gestützte Inhaltserstellung</h2>
        <p className="text-gray-600 mb-4">Generiere automatisch Inhalte für deine Landingpages mit künstlicher Intelligenz.</p>
        <Link to="/editor/new" className="btn btn-primary">
          Mit KI-Unterstützung starten
        </Link>
      </div>
    </div>
  </div>
);

const PluginsPage = () => (
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Plugins</h1>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Plugin-Verwaltung</h2>
        <p className="text-gray-600 mb-4">Erweitere PixelMagix mit zusätzlichen Funktionen durch Plugins.</p>
        <button className="btn btn-secondary">Plugins durchsuchen</button>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Einstellungen</h1>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">System-Einstellungen</h2>
        <p className="text-gray-600 mb-4">Konfiguriere PixelMagix nach deinen Wünschen.</p>
        <button className="btn btn-secondary">Einstellungen öffnen</button>
      </div>
    </div>
  </div>
);

// Sidebar Navigation Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Landingpages', href: '/pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'KI-Assistent', href: '/ai', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Plugins', href: '/plugins', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    { name: 'Einstellungen', href: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <h1 className="text-xl font-bold text-white">PixelMagix</h1>
      </div>
      
      {/* Navigation */}
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group border-l-4 px-3 py-2 flex items-center text-sm font-medium transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className={`${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// Main Layout Component
const Layout = ({ children, hideNavbar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (hideNavbar) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main content */}
      <div className="flex-1 lg:pl-0">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white shadow-sm">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">PixelMagix</h1>
            <div className="w-6"></div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Main App Component
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
        
        {/* Dashboard */}
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        
        {/* Seiten mit Navbar */}
        <Route path="/pages" element={
          <Layout>
            <PagesListPage />
          </Layout>
        } />
        
        <Route path="/ai" element={
          <Layout>
            <AIPage />
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
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;