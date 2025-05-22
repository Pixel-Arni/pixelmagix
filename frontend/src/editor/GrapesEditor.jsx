import React, { useEffect, useState, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import './GrapesEditor.css';

const GrapesEditor = ({ pageData, onSave }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!editorRef.current) return;

    console.log('🎨 Initialisiere GrapesJS Editor...');

    try {
      const gjsEditor = grapesjs.init({
        container: editorRef.current,
        height: '100vh',
        width: 'auto',
        storageManager: false,
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
              buttons: [
                {
                  id: 'device-desktop',
                  label: '🖥️',
                  command: 'set-device-desktop',
                  active: true
                },
                {
                  id: 'device-tablet', 
                  label: '📱',
                  command: 'set-device-tablet'
                },
                {
                  id: 'device-mobile',
                  label: '📱',
                  command: 'set-device-mobile'
                }
              ]
            },
            {
              id: 'panel-switcher',
              el: '.panel__switcher',
              buttons: [
                {
                  id: 'show-blocks',
                  active: true,
                  label: 'Blöcke',
                  command: 'show-blocks'
                },
                {
                  id: 'show-styles',
                  label: 'Stile',
                  command: 'show-styles'
                },
                {
                  id: 'show-layers',
                  label: 'Ebenen',
                  command: 'show-layers'
                },
                {
                  id: 'show-traits',
                  label: 'Eigenschaften',
                  command: 'show-traits'
                }
              ]
            },
            {
              id: 'panel-save',
              el: '.panel__save',
              buttons: [
                {
                  id: 'save',
                  className: 'btn-save',
                  label: '💾 Speichern',
                  command: 'save-page'
                }
              ]
            }
          ]
        },
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px' },
            { name: 'Mobile', width: '320px' }
          ]
        }
      });

      // Commands hinzufügen
      gjsEditor.Commands.add('show-blocks', {
        run: () => {
          document.getElementById('blocks').style.display = 'block';
          document.getElementById('styles-container').style.display = 'none';
          document.getElementById('layers-container').style.display = 'none';
          document.getElementById('trait-container').style.display = 'none';
        }
      });

      gjsEditor.Commands.add('show-styles', {
        run: () => {
          document.getElementById('blocks').style.display = 'none';
          document.getElementById('styles-container').style.display = 'block';
          document.getElementById('layers-container').style.display = 'none';
          document.getElementById('trait-container').style.display = 'none';
        }
      });

      gjsEditor.Commands.add('show-layers', {
        run: () => {
          document.getElementById('blocks').style.display = 'none';
          document.getElementById('styles-container').style.display = 'none';
          document.getElementById('layers-container').style.display = 'block';
          document.getElementById('trait-container').style.display = 'none';
        }
      });

      gjsEditor.Commands.add('show-traits', {
        run: () => {
          document.getElementById('blocks').style.display = 'none';
          document.getElementById('styles-container').style.display = 'none';
          document.getElementById('layers-container').style.display = 'none';
          document.getElementById('trait-container').style.display = 'block';
        }
      });

      gjsEditor.Commands.add('set-device-desktop', {
        run: () => gjsEditor.setDevice('Desktop')
      });

      gjsEditor.Commands.add('set-device-tablet', {
        run: () => gjsEditor.setDevice('Tablet')
      });

      gjsEditor.Commands.add('set-device-mobile', {
        run: () => gjsEditor.setDevice('Mobile')
      });

      gjsEditor.Commands.add('save-page', {
        run: () => {
          console.log('💾 Speichere Seite...');
          if (onSave) {
            const html = gjsEditor.getHtml();
            const css = gjsEditor.getCss();
            const components = JSON.stringify(gjsEditor.getComponents());
            const styles = JSON.stringify(gjsEditor.getStyle());
            
            onSave({
              html_content: html,
              css_content: css,
              components,
              styles
            });
          }
        }
      });

      // Standard-Blöcke hinzufügen
      gjsEditor.BlockManager.add('text-block', {
        label: 'Text',
        content: '<div data-gjs-type="text">Text hier eingeben</div>',
        category: 'Basic'
      });

      gjsEditor.BlockManager.add('image-block', {
        label: 'Bild',
        content: '<img src="https://via.placeholder.com/300x200" alt="Bild"/>',
        category: 'Basic'
      });

      gjsEditor.BlockManager.add('button-block', {
        label: 'Button',
        content: '<a href="#" class="btn">Button</a>',
        category: 'Basic'
      });

      // Wenn pageData vorhanden ist, Inhalte laden
      if (pageData) {
        console.log('📄 Lade Seitendaten...');
        
        if (pageData.components) {
          try {
            const components = typeof pageData.components === 'string' 
              ? JSON.parse(pageData.components) 
              : pageData.components;
            gjsEditor.setComponents(components);
          } catch (e) {
            console.error('❌ Fehler beim Laden der Komponenten:', e);
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
            if (pageData.css_content) {
              gjsEditor.setStyle(pageData.css_content);
            }
          }
        } else if (pageData.css_content) {
          gjsEditor.setStyle(pageData.css_content);
        }
      }

      setEditor(gjsEditor);
      setLoading(false);
      console.log('✅ GrapesJS Editor erfolgreich initialisiert');

      // Globale Referenz für KI-Integration
      window.editor = gjsEditor;

    } catch (error) {
      console.error('❌ Fehler beim Initialisieren des Editors:', error);
      setLoading(false);
    }

    return () => {
      console.log('🧹 Editor wird aufgeräumt');
      if (window.editor) {
        window.editor.destroy();
        window.editor = null;
      }
    };
  }, [pageData, onSave]);

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>GrapesJS Editor wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="grapesjs-editor-container">
      <div className="editor-panels">
        <div className="panel__devices"></div>
        <div className="panel__switcher"></div>
        <div className="panel__save"></div>
      </div>
      
      <div className="editor-main">
        <div className="editor-sidebar">
          <div id="blocks" className="blocks-container"></div>
          <div id="styles-container" className="styles-container" style={{display: 'none'}}></div>
          <div id="layers-container" className="layers-container" style={{display: 'none'}}></div>
          <div id="trait-container" className="trait-container" style={{display: 'none'}}></div>
        </div>
        
        <div ref={editorRef} className="editor-canvas"></div>
      </div>
    </div>
  );
};

export default GrapesEditor;