import React, { useEffect, useState, useRef } from 'react';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import 'grapesjs/dist/css/grapes.min.css';
import './GrapesEditor.css';

const GrapesEditor = ({ pageData, onSave }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor initialisieren
  useEffect(() => {
    if (!editorRef.current) return;

    console.log('🎨 GrapesJS Editor wird initialisiert...');

    // GrapesJS-Editor erstellen
    const gjsEditor = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: 'auto',
      storageManager: false,
      plugins: [gjsPresetWebpage, gjsBlocksBasic],
      pluginsOpts: {
        gjsPresetWebpage: {
          blocks: ['link-block', 'quote', 'text-basic'],
        },
        gjsBlocksBasic: {}
      },
      blockManager: {
        appendTo: '#blocks'
      },
      styleManager: {
        appendTo: '#styles-container'
      },
      layerManager: {
        appendTo: '#layers-container'
      },
      traitManager: {
        appendTo: '#trait-container'
      },
      panels: {
        defaults: [
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [{
              id: 'device-desktop',
              label: '<i class="fa fa-desktop"></i>',
              command: 'set-device-desktop',
              active: true,
              togglable: false,
            }, {
              id: 'device-tablet', 
              label: '<i class="fa fa-tablet"></i>',
              command: 'set-device-tablet',
              togglable: false,
            }, {
              id: 'device-mobile',
              label: '<i class="fa fa-mobile"></i>',
              command: 'set-device-mobile',
              togglable: false,
            }]
          },
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [{
              id: 'show-blocks',
              active: true,
              label: 'Blöcke',
              command: 'show-blocks',
              togglable: false,
            }, {
              id: 'show-styles',
              label: 'Stile',
              command: 'show-styles',
              togglable: false,
            }, {
              id: 'show-layers',
              label: 'Ebenen',
              command: 'show-layers',
              togglable: false,
            }, {
              id: 'show-traits',
              label: 'Eigenschaften',
              command: 'show-traits',
              togglable: false,
            }]
          },
          {
            id: 'panel-save',
            el: '.panel__save',
            buttons: [{
              id: 'save',
              className: 'btn-save',
              label: '<i class="fa fa-floppy-o"></i> Speichern',
              command: 'save-page',
              togglable: false,
            }]
          }
        ]
      },
      deviceManager: {
        devices: [{
          name: 'Desktop',
          width: '',
        }, {
          name: 'Tablet',
          width: '768px',
          widthMedia: '992px',
        }, {
          name: 'Mobile',
          width: '320px',
          widthMedia: '480px',
        }]
      },
      commands: {
        defaults: [
          {
            id: 'show-blocks',
            run: (editor) => {
              document.getElementById('blocks').style.display = 'block';
              document.getElementById('styles-container').style.display = 'none';
              document.getElementById('layers-container').style.display = 'none';
              document.getElementById('trait-container').style.display = 'none';
            }
          },
          {
            id: 'show-styles', 
            run: (editor) => {
              document.getElementById('blocks').style.display = 'none';
              document.getElementById('styles-container').style.display = 'block';
              document.getElementById('layers-container').style.display = 'none';
              document.getElementById('trait-container').style.display = 'none';
            }
          },
          {
            id: 'show-layers',
            run: (editor) => {
              document.getElementById('blocks').style.display = 'none';
              document.getElementById('styles-container').style.display = 'none';
              document.getElementById('layers-container').style.display = 'block';
              document.getElementById('trait-container').style.display = 'none';
            }
          },
          {
            id: 'show-traits',
            run: (editor) => {
              document.getElementById('blocks').style.display = 'none';
              document.getElementById('styles-container').style.display = 'none';
              document.getElementById('layers-container').style.display = 'none';
              document.getElementById('trait-container').style.display = 'block';
            }
          },
          {
            id: 'set-device-desktop',
            run: (editor) => editor.setDevice('Desktop')
          },
          {
            id: 'set-device-tablet',
            run: (editor) => editor.setDevice('Tablet')
          },
          {
            id: 'set-device-mobile',
            run: (editor) => editor.setDevice('Mobile')
          },
          {
            id: 'save-page',
            run: (editor) => {
              console.log('💾 Seite wird gespeichert...');
              const html = editor.getHtml();
              const css = editor.getCss();
              const js = editor.getJs ? editor.getJs() : '';
              const components = JSON.stringify(editor.getComponents());
              const styles = JSON.stringify(editor.getStyle());
              
              if (onSave) {
                onSave({
                  html_content: html,
                  css_content: css,
                  js_content: js,
                  components,
                  styles
                });
              }
            }
          }
        ]
      }
    });

    // Editor-Instanz speichern
    setEditor(gjsEditor);

    // Wenn pageData vorhanden ist, Inhalte laden
    if (pageData) {
      console.log('📄 Lade Seitendaten:', pageData.title);
      
      if (pageData.components) {
        try {
          const components = typeof pageData.components === 'string' 
            ? JSON.parse(pageData.components) 
            : pageData.components;
          gjsEditor.setComponents(components);
        } catch (e) {
          console.error('❌ Fehler beim Laden der Komponenten:', e);
          // Fallback: HTML-Inhalt laden
          if (pageData.html_content) {
            gjsEditor.setComponents(pageData.html_content);
          }
        }
      } else if (pageData.html_content) {
        gjsEditor.setComponents(pageData.html_content);
      }

      if (pageData.styles) {
        try {
          const styles = typeof pageData.styles === 'string' 
            ? JSON.parse(pageData.styles) 
            : pageData.styles;
          gjsEditor.setStyle(styles);
        } catch (e) {
          console.error('❌ Fehler beim Laden der Stile:', e);
          // Fallback: CSS-Inhalt laden
          if (pageData.css_content) {
            gjsEditor.setStyle(pageData.css_content);
          }
        }
      } else if (pageData.css_content) {
        gjsEditor.setStyle(pageData.css_content);
      }
    }

    // Globale Editor-Referenz für KI-Integration
    window.editor = gjsEditor;

    setLoading(false);
    console.log('✅ GrapesJS Editor erfolgreich initialisiert');

    // Aufräumen beim Unmounten
    return () => {
      console.log('🧹 GrapesJS Editor wird aufgeräumt');
      gjsEditor.destroy();
      window.editor = null;
    };
  }, [pageData, onSave]);

  // KI-generierte Inhalte laden
  const loadAiContent = (content) => {
    if (!editor) {
      console.warn('⚠️ Editor nicht verfügbar für KI-Inhalt');
      return;
    }

    console.log('🤖 Lade KI-generierte Inhalte:', content);

    // Beispiel für das Hinzufügen eines Hero-Abschnitts
    const heroSection = `
      <section class="hero" style="padding: 80px 0; text-align: center; background-color: #f8f9fa;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <h1 style="font-size: 2.5rem; margin-bottom: 20px;">${content.headline || 'Willkommen'}</h1>
          <h2 style="font-size: 1.5rem; margin-bottom: 30px; color: #6c757d;">${content.subheadline || 'Unterüberschrift'}</h2>
          <p style="font-size: 1.1rem; margin-bottom: 40px;">${content.intro_text || 'Einleitungstext'}</p>
          <a href="${content.cta_primary?.action || '#'}" class="btn btn-primary" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            ${content.cta_primary?.text || 'Jetzt starten'}
          </a>
        </div>
      </section>
    `;

    // Features-Abschnitt
    let featuresHtml = '<section class="features" style="padding: 60px 0; background-color: #fff;"><div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;"><div class="row" style="display: flex; flex-wrap: wrap; margin: 0 -15px;">';
    if (content.features && Array.isArray(content.features)) {
      content.features.forEach(feature => {
        featuresHtml += `
          <div class="feature-item" style="flex: 1 0 30%; margin: 15px; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="margin-bottom: 15px;">${feature.title || 'Feature'}</h3>
            <p>${feature.description || 'Beschreibung'}</p>
          </div>
        `;
      });
    }
    featuresHtml += '</div></div></section>';

    // Testimonial-Abschnitt
    const testimonialSection = content.testimonial ? `
      <section class="testimonial" style="padding: 60px 0; background-color: #f8f9fa; text-align: center;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <blockquote style="font-style: italic; font-size: 1.2rem; max-width: 800px; margin: 0 auto;">
            <p style="margin-bottom: 20px;">"${content.testimonial.text || ''}"</p>
            <cite style="display: block; font-weight: bold;">${content.testimonial.author || ''}, ${content.testimonial.position || ''}</cite>
          </blockquote>
        </div>
      </section>
    ` : '';

    // Alles zusammenfügen und in den Editor laden
    const fullContent = heroSection + featuresHtml + testimonialSection;
    editor.setComponents(fullContent);

    console.log('✅ KI-Inhalte erfolgreich geladen');
  };

  // Globale loadAiContent-Funktion verfügbar machen
  React.useEffect(() => {
    if (editor) {
      window.editor.loadAiContent = loadAiContent;
    }
  }, [editor]);

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>GrapesJS Editor wird geladen...</p>
      </div>
    );
  }

  // Editor-Komponente rendern
  return (
    <div className="grapesjs-editor-container">
      <div className="editor-panels">
        <div className="panel__devices"></div>
        <div className="panel__switcher"></div>
        <div className="panel__save"></div>
      </div>
      
      <div className="editor-sidebar">
        <div id="blocks" className="blocks-container"></div>
        <div id="styles-container" className="styles-container" style={{display: 'none'}}></div>
        <div id="layers-container" className="layers-container" style={{display: 'none'}}></div>
        <div id="trait-container" className="trait-container" style={{display: 'none'}}></div>
      </div>
      
      <div ref={editorRef} className="editor-canvas"></div>
    </div>
  );
};

export default GrapesEditor;