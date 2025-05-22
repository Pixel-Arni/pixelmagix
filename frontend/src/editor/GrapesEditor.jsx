import React, { useEffect, useState, useRef } from 'react';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import 'grapesjs/dist/css/grapes.min.css';

const GrapesEditor = ({ pageData, onSave }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor initialisieren
  useEffect(() => {
    if (!editorRef.current) return;

    // GrapesJS-Editor erstellen
    const editor = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: 'auto',
      storageManager: false,
      plugins: [gjsPresetWebpage, gjsBlocksBasic],
      pluginsOpts: {
        gjsPresetWebpage: {},
        gjsBlocksBasic: {}
      },
      blockManager: {
        appendTo: '#blocks'
      },
      styleManager: {
        appendTo: '#styles-container'
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
            }]
          },
          {
            id: 'panel-save',
            el: '.panel__save',
            buttons: [{
              id: 'save',
              className: 'btn-save',
              label: 'Speichern',
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
              editor.Panels.getButton('views', 'open-blocks').set('active', true);
              editor.Panels.getButton('views', 'open-styles').set('active', false);
              editor.Panels.getButton('views', 'open-layers').set('active', false);
              editor.Panels.getButton('views', 'open-traits').set('active', false);
            }
          },
          {
            id: 'show-styles',
            run: (editor) => {
              editor.Panels.getButton('views', 'open-blocks').set('active', false);
              editor.Panels.getButton('views', 'open-styles').set('active', true);
              editor.Panels.getButton('views', 'open-layers').set('active', false);
              editor.Panels.getButton('views', 'open-traits').set('active', false);
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
    setEditor(editor);

    // Wenn pageData vorhanden ist, Inhalte laden
    if (pageData) {
      if (pageData.components) {
        try {
          const components = typeof pageData.components === 'string' 
            ? JSON.parse(pageData.components) 
            : pageData.components;
          editor.setComponents(components);
        } catch (e) {
          console.error('Fehler beim Laden der Komponenten:', e);
          // Fallback: HTML-Inhalt laden
          if (pageData.html_content) {
            editor.setComponents(pageData.html_content);
          }
        }
      } else if (pageData.html_content) {
        editor.setComponents(pageData.html_content);
      }

      if (pageData.styles) {
        try {
          const styles = typeof pageData.styles === 'string' 
            ? JSON.parse(pageData.styles) 
            : pageData.styles;
          editor.setStyle(styles);
        } catch (e) {
          console.error('Fehler beim Laden der Stile:', e);
          // Fallback: CSS-Inhalt laden
          if (pageData.css_content) {
            editor.setStyle(pageData.css_content);
          }
        }
      } else if (pageData.css_content) {
        editor.setStyle(pageData.css_content);
      }
    }

    setLoading(false);

    // Aufräumen beim Unmounten
    return () => {
      editor.destroy();
    };
  }, [pageData, onSave]);

  // KI-generierte Inhalte laden
  const loadAiContent = (content) => {
    if (!editor) return;

    // Beispiel für das Hinzufügen eines Hero-Abschnitts
    const heroSection = `
      <section class="hero">
        <div class="container">
          <h1>${content.headline || 'Willkommen'}</h1>
          <h2>${content.subheadline || 'Unterüberschrift'}</h2>
          <p>${content.intro_text || 'Einleitungstext'}</p>
          <a href="${content.cta_primary?.action || '#'}" class="btn btn-primary">
            ${content.cta_primary?.text || 'Jetzt starten'}
          </a>
        </div>
      </section>
    `;

    // Features-Abschnitt
    let featuresHtml = '<section class="features"><div class="container"><div class="row">';
    if (content.features && Array.isArray(content.features)) {
      content.features.forEach(feature => {
        featuresHtml += `
          <div class="feature-item">
            <h3>${feature.title || 'Feature'}</h3>
            <p>${feature.description || 'Beschreibung'}</p>
          </div>
        `;
      });
    }
    featuresHtml += '</div></div></section>';

    // Testimonial-Abschnitt
    const testimonialSection = content.testimonial ? `
      <section class="testimonial">
        <div class="container">
          <blockquote>
            <p>${content.testimonial.text || ''}</p>
            <cite>${content.testimonial.author || ''}, ${content.testimonial.position || ''}</cite>
          </blockquote>
        </div>
      </section>
    ` : '';

    // Abschluss-Abschnitt
    const closingSection = content.closing_text ? `
      <section class="closing">
        <div class="container">
          <p>${content.closing_text}</p>
          <a href="#kontakt" class="btn btn-secondary">Kontakt aufnehmen</a>
        </div>
      </section>
    ` : '';

    // Alles zusammenfügen und in den Editor laden
    const fullContent = heroSection + featuresHtml + testimonialSection + closingSection;
    editor.setComponents(fullContent);

    // Grundlegende Stile hinzufügen
    const basicStyles = `
      body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
      .container { width: 90%; max-width: 1200px; margin: 0 auto; padding: 0 15px; }
      .hero { padding: 80px 0; text-align: center; background-color: #f8f9fa; }
      .hero h1 { font-size: 2.5rem; margin-bottom: 20px; }
      .hero h2 { font-size: 1.5rem; margin-bottom: 30px; color: #6c757d; }
      .features { padding: 60px 0; background-color: #fff; }
      .row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
      .feature-item { flex: 1 0 30%; margin: 15px; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
      .testimonial { padding: 60px 0; background-color: #f8f9fa; text-align: center; }
      .testimonial blockquote { font-style: italic; max-width: 800px; margin: 0 auto; }
      .testimonial cite { display: block; margin-top: 20px; font-weight: bold; }
      .closing { padding: 80px 0; text-align: center; background-color: #343a40; color: #fff; }
      .btn { display: inline-block; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; }
      .btn-primary { background-color: #007bff; color: white; }
      .btn-secondary { background-color: #6c757d; color: white; }
      @media (max-width: 768px) {
        .feature-item { flex: 1 0 100%; }
        .hero h1 { font-size: 2rem; }
      }
    `;
    editor.setStyle(basicStyles);
  };

  // Editor-Komponente rendern
  return (
    <div className="grapesjs-editor-container">
      {loading && <div className="editor-loading">Editor wird geladen...</div>}
      
      <div className="editor-panels">
        <div className="panel__devices"></div>
        <div className="panel__switcher"></div>
        <div className="panel__save"></div>
      </div>
      
      <div className="editor-sidebar">
        <div id="blocks" className="blocks-container"></div>
        <div id="styles-container" className="styles-container"></div>
      </div>
      
      <div ref={editorRef} className="editor-canvas"></div>
    </div>
  );
};

export default GrapesEditor;