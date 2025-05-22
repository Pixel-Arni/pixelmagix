import React, { useState, useEffect } from 'react';
import './AIModelManager.css';

const AIModelManager = () => {
  const [models, setModels] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModelForm, setShowModelForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  
  // Formularstatus für neues Modell
  const [newModel, setNewModel] = useState({
    name: '',
    model_type: 'text',
    provider: 'local',
    model_path: '',
    config: {}
  });
  
  // Formularstatus für neue Vorlage
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    model_id: '',
    template_type: 'page',
    prompt_template: '',
    output_format: {}
  });

  // Daten beim Laden der Komponente abrufen
  useEffect(() => {
    fetchModels();
    fetchTemplates();
  }, []);

  // KI-Modelle abrufen
  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ai/models');
      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der KI-Modelle: ${response.statusText}`);
      }
      const data = await response.json();
      setModels(data);
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Laden der KI-Modelle:', err);
    } finally {
      setLoading(false);
    }
  };

  // KI-Vorlagen abrufen
  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/ai/templates');
      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der KI-Vorlagen: ${response.statusText}`);
      }
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Laden der KI-Vorlagen:', err);
    }
  };

  // Neues KI-Modell erstellen
  const createModel = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ai/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newModel)
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Erstellen des KI-Modells: ${response.statusText}`);
      }

      // Formular zurücksetzen und Modelle neu laden
      setNewModel({
        name: '',
        model_type: 'text',
        provider: 'local',
        model_path: '',
        config: {}
      });
      setShowModelForm(false);
      await fetchModels();
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Erstellen des KI-Modells:', err);
    }
  };

  // Neue KI-Vorlage erstellen
  const createTemplate = async (e) => {
    e.preventDefault();
    try {
      // Ausgabeformat als JSON-Objekt parsen, falls es als String eingegeben wurde
      let outputFormat = newTemplate.output_format;
      if (typeof outputFormat === 'string' && outputFormat.trim() !== '') {
        try {
          outputFormat = JSON.parse(outputFormat);
        } catch (parseError) {
          setError('Ungültiges JSON-Format für das Ausgabeformat');
          return;
        }
      }

      const templateData = {
        ...newTemplate,
        output_format: outputFormat
      };

      const response = await fetch('/api/ai/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Erstellen der KI-Vorlage: ${response.statusText}`);
      }

      // Formular zurücksetzen und Vorlagen neu laden
      setNewTemplate({
        name: '',
        description: '',
        model_id: '',
        template_type: 'page',
        prompt_template: '',
        output_format: {}
      });
      setShowTemplateForm(false);
      await fetchTemplates();
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Erstellen der KI-Vorlage:', err);
    }
  };

  // Eingabeänderungen für das Modellformular verarbeiten
  const handleModelChange = (e) => {
    const { name, value } = e.target;
    setNewModel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Eingabeänderungen für das Vorlagenformular verarbeiten
  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setNewTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Konfigurationsänderungen für das Modell verarbeiten
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setNewModel(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: value
      }
    }));
  };

  // Modellformular rendern
  const renderModelForm = () => {
    if (!showModelForm) return null;

    return (
      <div className="ai-form-panel">
        <div className="ai-form-header">
          <h3>Neues KI-Modell registrieren</h3>
          <button className="close-btn" onClick={() => setShowModelForm(false)}>×</button>
        </div>
        <div className="ai-form-content">
          <form onSubmit={createModel}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newModel.name}
                onChange={handleModelChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model_type">Modelltyp:</label>
              <select
                id="model_type"
                name="model_type"
                value={newModel.model_type}
                onChange={handleModelChange}
                required
              >
                <option value="text">Text</option>
                <option value="image">Bild</option>
                <option value="combined">Kombiniert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="provider">Anbieter:</label>
              <select
                id="provider"
                name="provider"
                value={newModel.provider}
                onChange={handleModelChange}
                required
              >
                <option value="local">Lokal</option>
                <option value="openai">OpenAI</option>
                <option value="huggingface">Hugging Face</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="model_path">Modellpfad:</label>
              <input
                type="text"
                id="model_path"
                name="model_path"
                value={newModel.model_path}
                onChange={handleModelChange}
                placeholder="Pfad zum lokalen Modell oder API-Endpunkt"
              />
            </div>

            <div className="form-group">
              <label>Konfiguration:</label>
              <div className="config-fields">
                <div className="config-field">
                  <input
                    type="text"
                    name="max_length"
                    placeholder="max_length"
                    value={newModel.config.max_length || ''}
                    onChange={handleConfigChange}
                  />
                </div>
                <div className="config-field">
                  <input
                    type="text"
                    name="temperature"
                    placeholder="temperature"
                    value={newModel.config.temperature || ''}
                    onChange={handleConfigChange}
                  />
                </div>
                {/* Weitere Konfigurationsfelder können hier hinzugefügt werden */}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">Modell registrieren</button>
              <button type="button" className="btn" onClick={() => setShowModelForm(false)}>Abbrechen</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Vorlagenformular rendern
  const renderTemplateForm = () => {
    if (!showTemplateForm) return null;

    return (
      <div className="ai-form-panel">
        <div className="ai-form-header">
          <h3>Neue KI-Vorlage erstellen</h3>
          <button className="close-btn" onClick={() => setShowTemplateForm(false)}>×</button>
        </div>
        <div className="ai-form-content">
          <form onSubmit={createTemplate}>
            <div className="form-group">
              <label htmlFor="template-name">Name:</label>
              <input
                type="text"
                id="template-name"
                name="name"
                value={newTemplate.name}
                onChange={handleTemplateChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Beschreibung:</label>
              <textarea
                id="description"
                name="description"
                value={newTemplate.description}
                onChange={handleTemplateChange}
                rows="2"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="model_id">KI-Modell:</label>
              <select
                id="model_id"
                name="model_id"
                value={newTemplate.model_id}
                onChange={handleTemplateChange}
                required
              >
                <option value="">-- Modell auswählen --</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.model_type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="template_type">Vorlagentyp:</label>
              <select
                id="template_type"
                name="template_type"
                value={newTemplate.template_type}
                onChange={handleTemplateChange}
                required
              >
                <option value="page">Seite</option>
                <option value="section">Abschnitt</option>
                <option value="component">Komponente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prompt_template">Prompt-Vorlage:</label>
              <textarea
                id="prompt_template"
                name="prompt_template"
                value={newTemplate.prompt_template}
                onChange={handleTemplateChange}
                rows="6"
                placeholder="Gib hier die Prompt-Vorlage ein. Verwende {variable} für Platzhalter."
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="output_format">Ausgabeformat (JSON-Schema):</label>
              <textarea
                id="output_format"
                name="output_format"
                value={typeof newTemplate.output_format === 'object' ? 
                  JSON.stringify(newTemplate.output_format, null, 2) : 
                  newTemplate.output_format}
                onChange={handleTemplateChange}
                rows="6"
                placeholder="{
  "type": "object",
  "properties": {
    "title": {"type": "string"},
    "content": {"type": "string"}
  }
}"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">Vorlage erstellen</button>
              <button type="button" className="btn" onClick={() => setShowTemplateForm(false)}>Abbrechen</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="ai-model-manager">
      <h2>KI-Modellverwaltung</h2>

      {error && <div className="error-message">{error}</div>}

      {/* KI-Modelle */}
      <div className="ai-section">
        <div className="section-header">
          <h3>KI-Modelle</h3>
          <button className="btn primary" onClick={() => setShowModelForm(true)}>Neues Modell</button>
        </div>

        {loading ? (
          <p>Modelle werden geladen...</p>
        ) : models.length === 0 ? (
          <p>Keine KI-Modelle registriert.</p>
        ) : (
          <div className="ai-cards">
            {models.map(model => (
              <div key={model.id} className={`ai-card ${model.is_active ? 'active' : 'inactive'}`}>
                <div className="ai-card-header">
                  <h4>{model.name}</h4>
                  <span className="ai-card-type">{model.model_type}</span>
                </div>
                <div className="ai-card-content">
                  <p><strong>Anbieter:</strong> {model.provider}</p>
                  {model.model_path && <p><strong>Pfad:</strong> {model.model_path}</p>}
                  {model.config && Object.keys(model.config).length > 0 && (
                    <div className="ai-card-config">
                      <p><strong>Konfiguration:</strong></p>
                      <ul>
                        {Object.entries(model.config).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KI-Vorlagen */}
      <div className="ai-section">
        <div className="section-header">
          <h3>KI-Vorlagen</h3>
          <button 
            className="btn primary" 
            onClick={() => setShowTemplateForm(true)}
            disabled={models.length === 0}
          >
            Neue Vorlage
          </button>
        </div>

        {loading ? (
          <p>Vorlagen werden geladen...</p>
        ) : templates.length === 0 ? (
          <p>Keine KI-Vorlagen erstellt.</p>
        ) : (
          <div className="ai-cards">
            {templates.map(template => {
              const model = models.find(m => m.id === template.model_id);
              return (
                <div key={template.id} className="ai-card template">
                  <div className="ai-card-header">
                    <h4>{template.name}</h4>
                    <span className="ai-card-type">{template.template_type}</span>
                  </div>
                  <div className="ai-card-content">
                    {template.description && <p>{template.description}</p>}
                    <p><strong>Modell:</strong> {model ? model.name : `ID: ${template.model_id}`}</p>
                    <div className="template-preview">
                      <p><strong>Prompt-Vorlage:</strong></p>
                      <pre>{template.prompt_template.length > 100 ? 
                        template.prompt_template.substring(0, 100) + '...' : 
                        template.prompt_template}</pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Formulare */}
      {renderModelForm()}
      {renderTemplateForm()}
    </div>
  );
};

export default AIModelManager;