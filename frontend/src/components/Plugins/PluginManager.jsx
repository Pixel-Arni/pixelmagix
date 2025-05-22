import React, { useState, useEffect } from 'react';
import './PluginManager.css';

const PluginManager = () => {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [configValues, setConfigValues] = useState({});

  // Plugins beim Laden der Komponente abrufen
  useEffect(() => {
    fetchPlugins();
  }, []);

  // Alle Plugins abrufen
  const fetchPlugins = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plugins/');
      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Plugins: ${response.statusText}`);
      }
      const data = await response.json();
      setPlugins(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Laden der Plugins:', err);
    } finally {
      setLoading(false);
    }
  };

  // Plugin aktivieren
  const activatePlugin = async (pluginSlug) => {
    try {
      const response = await fetch(`/api/plugins/${pluginSlug}/activate`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error(`Fehler beim Aktivieren des Plugins: ${response.statusText}`);
      }
      await fetchPlugins(); // Plugins neu laden
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Aktivieren des Plugins:', err);
    }
  };

  // Plugin deaktivieren
  const deactivatePlugin = async (pluginSlug) => {
    try {
      const response = await fetch(`/api/plugins/${pluginSlug}/deactivate`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error(`Fehler beim Deaktivieren des Plugins: ${response.statusText}`);
      }
      await fetchPlugins(); // Plugins neu laden
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Deaktivieren des Plugins:', err);
    }
  };

  // Plugin deinstallieren
  const uninstallPlugin = async (pluginSlug) => {
    if (!window.confirm(`Möchten Sie das Plugin "${pluginSlug}" wirklich deinstallieren?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/plugins/${pluginSlug}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Fehler beim Deinstallieren des Plugins: ${response.statusText}`);
      }
      await fetchPlugins(); // Plugins neu laden
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Deinstallieren des Plugins:', err);
    }
  };

  // Plugin-Konfiguration aktualisieren
  const updatePluginConfig = async (pluginSlug, config) => {
    try {
      const response = await fetch(`/api/plugins/${pluginSlug}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren der Plugin-Konfiguration: ${response.statusText}`);
      }
      await fetchPlugins(); // Plugins neu laden
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Aktualisieren der Plugin-Konfiguration:', err);
      return false;
    }
  };

  // Plugin-Datei hochladen
  const uploadPlugin = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setError('Bitte wählen Sie eine Plugin-Datei aus.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch('/api/plugins/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Fehler beim Hochladen des Plugins: ${response.statusText}`);
      }

      setUploadFile(null);
      setError(null);
      await fetchPlugins(); // Plugins neu laden
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Hochladen des Plugins:', err);
    } finally {
      setUploading(false);
    }
  };

  // Plugin für die Konfiguration auswählen
  const selectPluginForConfig = (plugin) => {
    setSelectedPlugin(plugin);
    setConfigValues(plugin.config || {});
  };

  // Konfigurationswert ändern
  const handleConfigChange = (key, value) => {
    setConfigValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Konfiguration speichern
  const saveConfig = async () => {
    if (!selectedPlugin) return;

    const success = await updatePluginConfig(selectedPlugin.slug, configValues);
    if (success) {
      setSelectedPlugin(null);
    }
  };

  // Konfigurationsformular rendern
  const renderConfigForm = () => {
    if (!selectedPlugin) return null;

    return (
      <div className="plugin-config-panel">
        <div className="plugin-config-header">
          <h3>Konfiguration: {selectedPlugin.name}</h3>
          <button className="close-btn" onClick={() => setSelectedPlugin(null)}>×</button>
        </div>
        <div className="plugin-config-content">
          {Object.keys(configValues).length === 0 ? (
            <p>Dieses Plugin hat keine konfigurierbaren Einstellungen.</p>
          ) : (
            <div className="config-form">
              {Object.entries(configValues).map(([key, value]) => (
                <div key={key} className="form-group">
                  <label htmlFor={`config-${key}`}>{key}:</label>
                  {typeof value === 'boolean' ? (
                    <input
                      type="checkbox"
                      id={`config-${key}`}
                      checked={value}
                      onChange={(e) => handleConfigChange(key, e.target.checked)}
                    />
                  ) : typeof value === 'number' ? (
                    <input
                      type="number"
                      id={`config-${key}`}
                      value={value}
                      onChange={(e) => handleConfigChange(key, Number(e.target.value))}
                    />
                  ) : (
                    <input
                      type="text"
                      id={`config-${key}`}
                      value={value}
                      onChange={(e) => handleConfigChange(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="config-actions">
            <button className="btn primary" onClick={saveConfig}>Speichern</button>
            <button className="btn" onClick={() => setSelectedPlugin(null)}>Abbrechen</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="plugin-manager">
      <h2>Plugin-Verwaltung</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Plugin hochladen */}
      <div className="upload-section">
        <h3>Neues Plugin installieren</h3>
        <form onSubmit={uploadPlugin} className="upload-form">
          <div className="form-group">
            <label htmlFor="plugin-file">Plugin-Datei (.zip):</label>
            <input
              type="file"
              id="plugin-file"
              accept=".zip"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
          </div>
          <button 
            type="submit" 
            className="btn primary" 
            disabled={!uploadFile || uploading}
          >
            {uploading ? 'Wird hochgeladen...' : 'Plugin installieren'}
          </button>
        </form>
      </div>

      {/* Plugin-Liste */}
      <div className="plugins-list">
        <h3>Installierte Plugins</h3>
        {loading ? (
          <p>Plugins werden geladen...</p>
        ) : plugins.length === 0 ? (
          <p>Keine Plugins installiert.</p>
        ) : (
          <div className="plugins-grid">
            {plugins.map(plugin => (
              <div key={plugin.slug} className={`plugin-card ${plugin.is_active ? 'active' : 'inactive'}`}>
                <div className="plugin-header">
                  <h4>{plugin.name}</h4>
                  <span className="plugin-version">v{plugin.version}</span>
                </div>
                <p className="plugin-description">{plugin.description || 'Keine Beschreibung verfügbar.'}</p>
                <div className="plugin-meta">
                  <span>Autor: {plugin.author || 'Unbekannt'}</span>
                </div>
                <div className="plugin-actions">
                  {plugin.is_active ? (
                    <button 
                      className="btn" 
                      onClick={() => deactivatePlugin(plugin.slug)}
                    >
                      Deaktivieren
                    </button>
                  ) : (
                    <button 
                      className="btn primary" 
                      onClick={() => activatePlugin(plugin.slug)}
                    >
                      Aktivieren
                    </button>
                  )}
                  <button 
                    className="btn" 
                    onClick={() => selectPluginForConfig(plugin)}
                  >
                    Konfigurieren
                  </button>
                  <button 
                    className="btn danger" 
                    onClick={() => uninstallPlugin(plugin.slug)}
                  >
                    Deinstallieren
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Konfigurationsformular */}
      {renderConfigForm()}
    </div>
  );
};

export default PluginManager;