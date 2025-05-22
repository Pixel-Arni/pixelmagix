import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import './GrapesJSEditor.css';

const GrapesJSEditor = ({ pageData, onSave }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiTemplates, setAiTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [aiVariables, setAiVariables] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // GrapesJS-Editor initialisieren
  useEffect(() => {
    if (!editorRef.current) return;

    // Editor initialisieren
    const gjsEditor = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      plugins: [gjsPresetWebpage, gjsBlocksBasic],
      pluginsOpts: {
        gjsPresetWebpage: {},
        gjsBlocksBasic: {}
      },
      panels: { defaults: [] },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px' },
          { name: 'Mobile', width: '320px' }
        ]
      },
      styleManager: {
        sectors: [
          { name: 'Dimension', open: false },
          { name: 'Typography', open: false },
          { name: 'Decorations', open: false },
          { name: 'Extra', open: false }
        ]
      }
    });

    // Benutzerdefinierte Panels hinzufügen
    gjsEditor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel-top',
      content: `
        <div class="panel-buttons">
          <button id="show-json" class="btn">JSON anzeigen</button>
          <button id="save-page" class="btn primary">Speichern</button>
          <button id="ai-generate" class="btn ai">KI-Generierung</button>
        </div>
      `
    });

    // Event-Listener für Buttons
    gjsEditor.on('load', () => {
      // JSON anzeigen
      document.getElementById('show-json').addEventListener('click', () => {
        const jsonData = gjsEditor.getComponents();
        console.log(JSON.stringify(jsonData));
      });

      // Seite speichern
      document.getElementById('save-page').addEventListener('click', () => {
        const html = gjsEditor.getHtml();
        const css = gjsEditor.getCss();
        const js = gjsEditor.getJs();
        const components = JSON.stringify(gjsEditor.getComponents());
        const styles = JSON.stringify(gjsEditor.getStyle());

        onSave({
          ...pageData,
          html_content: html,
          css_content: css,
          js_content: js,
          components,
          styles
        });
      });

      // KI-Panel öffnen
      document.getElementById('ai-generate').addEventListener('click', () => {
        setAiPanelOpen(true);
        fetchAiTemplates();
      });
    });

    // Vorhandene Inhalte laden, falls vorhanden
    if (pageData) {
      if (pageData.components) {
        try {
          const components = JSON.parse(pageData.components);
          gjsEditor.setComponents(components);
        } catch (e) {
          console.error('Fehler beim Laden der Komponenten:', e);
        }
      } else if (pageData.html_content) {
        gjsEditor.setComponents(pageData.html_content);
      }

      if (pageData.styles) {
        try {
          const styles = JSON.parse(pageData.styles);
          gjsEditor.setStyle(styles);
        } catch (e) {
          console.error('Fehler beim Laden der Stile:', e);
        }
      } else if (pageData.css_content) {
        gjsEditor.setStyle(pageData.css_content);
      }

      if (pageData.js_content) {
        gjsEditor.setJs(pageData.js_content);
      }
    }

    setEditor(gjsEditor);

    // Cleanup beim Unmount
    return () => {
      gjsEditor.destroy();
    };
  }, [pageData]);

  // KI-Vorlagen abrufen
  const fetchAiTemplates = async () => {
    try {
      const response = await fetch('/api/ai/templates');
      if (response.ok) {
        const templates = await response.json();
        setAiTemplates(templates.filter(t => t.template_type === 'page' || t.template_type === 'section'));
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der KI-Vorlagen:', error);
    }
  };

  // Inhalt mit KI generieren
  const generateContent = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          variables: aiVariables
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (selectedTemplate.template_type === 'page') {
          // Generierte Seite in den Editor laden
          if (result.sections) {
            // Komponenten für jede Sektion erstellen
            let html = '';
            result.sections.forEach(section => {
              html += createSectionHtml(section);
            });
            editor.setComponents(html);
          }
        } else if (selectedTemplate.template_type === 'section') {
          // Generierte Sektion zum Editor hinzufügen
          const sectionHtml = createSectionHtml({
            type: aiVariables.section_type || 'custom',
            content: result.content
          });
          editor.getComponents().add(sectionHtml);
        }

        setAiPanelOpen(false);
      }
    } catch (error) {
      console.error('Fehler bei der KI-Generierung:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // HTML für eine Sektion erstellen
  const createSectionHtml = (section) => {
    switch (section.type) {
      case 'hero':
        return `
          <section class="hero-section" data-gjs-type="section" data-section-type="hero">
            <div class="container">
              <h1>${section.content?.heading || 'Hauptüberschrift'}</h1>
              <p>${section.content?.subheading || 'Unterüberschrift'}</p>
              ${section.content?.cta_text ? `<a href="${section.content?.cta_url || '#'}" class="cta-button">${section.content.cta_text}</a>` : ''}
            </div>
          </section>
        `;
      case 'features':
        return `
          <section class="features-section" data-gjs-type="section" data-section-type="features">
            <div class="container">
              <h2>${section.content?.heading || 'Features'}</h2>
              <div class="features-grid">
                ${(section.content?.items || []).map(item => `
                  <div class="feature-item">
                    <div class="feature-icon">${item.icon ? `<i class="${item.icon}"></i>` : ''}</div>
                    <h3>${item.title || 'Feature'}</h3>
                    <p>${item.description || 'Beschreibung'}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        `;
      case 'cta':
        return `
          <section class="cta-section" data-gjs-type="section" data-section-type="cta">
            <div class="container">
              <h2>${section.content?.heading || 'Call to Action'}</h2>
              <p>${section.content?.text || 'Beschreibungstext'}</p>
              <a href="${section.content?.button_url || '#'}" class="cta-button">${section.content?.button_text || 'Jetzt starten'}</a>
            </div>
          </section>
        `;
      default:
        if (typeof section.content === 'string') {
          return `
            <section class="custom-section" data-gjs-type="section" data-section-type="custom">
              <div class="container">
                ${section.content}
              </div>
            </section>
          `;
        } else {
          return `
            <section class="custom-section" data-gjs-type="section" data-section-type="custom">
              <div class="container">
                <h2>Benutzerdefinierter Abschnitt</h2>
                <p>Dieser Abschnitt wurde mit KI generiert.</p>
              </div>
            </section>
          `;
        }
    }
  };

  // Eingabefelder für KI-Variablen basierend auf der ausgewählten Vorlage rendern
  const renderVariableInputs = () => {
    if (!selectedTemplate) return null;

    // Variablen aus dem Prompt-Template extrahieren
    const variableMatches = selectedTemplate.prompt_template.match(/\{([^}]+)\}/g) || [];
    const variables = variableMatches.map(match => match.replace(/[{}]/g, ''));

    return (
      <div className="ai-variables">
        {variables.map(variable => (
          <div key={variable} className="form-group">
            <label htmlFor={`var-${variable}`}>{variable.replace(/_/g, ' ')}:</label>
            <input
              type="text"
              id={`var-${variable}`}
              value={aiVariables[variable] || ''}
              onChange={(e) => setAiVariables({ ...aiVariables, [variable]: e.target.value })}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grapesjs-editor-container">
      <div className="panel-top"></div>
      <div ref={editorRef} className="editor-canvas"></div>

      {/* KI-Panel */}
      {aiPanelOpen && (
        <div className="ai-panel">
          <div className="ai-panel-header">
            <h3>KI-Inhaltsgenerierung</h3>
            <button className="close-btn" onClick={() => setAiPanelOpen(false)}>×</button>
          </div>
          <div className="ai-panel-content">
            <div className="form-group">
              <label>Vorlage auswählen:</label>
              <select 
                value={selectedTemplate?.id || ''} 
                onChange={(e) => {
                  const template = aiTemplates.find(t => t.id === parseInt(e.target.value));
                  setSelectedTemplate(template);
                  setAiVariables({});
                }}
              >
                <option value="">-- Vorlage auswählen --</option>
                {aiTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.template_type})
                  </option>
                ))}
              </select>
            </div>

            {renderVariableInputs()}

            <div className="ai-panel-actions">
              <button 
                className="btn primary" 
                onClick={generateContent} 
                disabled={!selectedTemplate || isGenerating}
              >
                {isGenerating ? 'Generiere...' : 'Inhalt generieren'}
              </button>
              <button 
                className="btn" 
                onClick={() => setAiPanelOpen(false)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrapesJSEditor;