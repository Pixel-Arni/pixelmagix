import React, { useEffect, useState, useRef } from 'react';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginForms from 'grapesjs-plugin-forms';
import gjsComponentCountdown from 'grapesjs-component-countdown';
import gjsTabs from 'grapesjs-tabs';
import gjsTooltip from 'grapesjs-tooltip';
import gjsTyped from 'grapesjs-typed';
import 'grapesjs/dist/css/grapes.min.css';
import './GrapesEditor.css';

const GrapesEditor = ({ pageData, onSave }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDevice, setCurrentDevice] = useState('Desktop');

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
      
      // Plugins
      plugins: [
        gjsPresetWebpage,
        gjsBlocksBasic,
        gjsPluginForms,
        gjsComponentCountdown,
        gjsTabs,
        gjsTooltip,
        gjsTyped
      ],
      
      // Plugin-Optionen
      pluginsOpts: {
        [gjsPresetWebpage]: {
          modalImportTitle: 'Code importieren',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Fügen Sie hier Ihren HTML/CSS Code ein</div>',
          modalImportContent: function(editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          },
          filestackOpts: null,
          aviaryOpts: false,
          blocksBasicOpts: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
            flexGrid: 1
          },
          customStyleManager: [{
            name: 'General',
            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
            properties: [{
              name: 'Alignment',
              property: 'float',
              type: 'radio',
              defaults: 'none',
              list: [
                { value: 'none', className: 'fa fa-times'},
                { value: 'left', className: 'fa fa-align-left'},
                { value: 'right', className: 'fa fa-align-right'}
              ],
            },
            { property: 'position', type: 'select'}]
          },{
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'min-height', 'padding'],
            properties: [
              {
                id: 'flex-width',
                type: 'integer',
                name: 'Width',
                units: ['px', '%'],
                property: 'flex-basis',
                toRequire: 1,
              },
              {
                property: 'margin',
                properties: [
                  { name: 'Top', property: 'margin-top'},
                  { name: 'Right', property: 'margin-right'},
                  { name: 'Bottom', property: 'margin-bottom'},
                  { name: 'Left', property: 'margin-left'}
                ],
              },
              {
                property: 'padding',
                properties: [
                  { name: 'Top', property: 'padding-top'},
                  { name: 'Right', property: 'padding-right'},
                  { name: 'Bottom', property: 'padding-bottom'},
                  { name: 'Left', property: 'padding-left'}
                ],
              }],
          },{
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
            properties: [
              { name: 'Font', property: 'font-family'},
              { name: 'Weight', property: 'font-weight'},
              { name: 'Font color', property: 'color'},
              {
                property: 'text-align',
                type: 'radio',
                defaults: 'left',
                list: [
                  { value: 'left',  name: 'Left',    className: 'fa fa-align-left'},
                  { value: 'center',  name: 'Center',  className: 'fa fa-align-center' },
                  { value: 'right',   name: 'Right',   className: 'fa fa-align-right'},
                  { value: 'justify', name: 'Justify', className: 'fa fa-align-justify'}
                ],
              },{
                property: 'text-decoration',
                type: 'radio',
                defaults: 'none',
                list: [
                  { value: 'none', name: 'None', className: 'fa fa-times'},
                  { value: 'underline', name: 'underline', className: 'fa fa-underline'},
                  { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough'}
                ],
              },{
                property: 'text-shadow',
                properties: [
                  { name: 'X position', property: 'text-shadow-h'},
                  { name: 'Y position', property: 'text-shadow-v'},
                  { name: 'Blur', property: 'text-shadow-blur'},
                  { name: 'Color', property: 'text-shadow-color'}
                ],
              }],
          },{
            name: 'Decorations',
            open: false,
            buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
            properties: [
              { name: 'Opacity', property: 'opacity', type: 'slider', defaults: 1, step: 0.01, max: 1, min:0},
              { name: 'Background color', property: 'background-color'},
              { name: 'Border radius', property: 'border-radius'},
              {
                property: 'border',
                properties: [
                  { name: 'Width', property: 'border-width'},
                  { name: 'Style', property: 'border-style'},
                  { name: 'Color', property: 'border-color'}
                ],
              },{
                property: 'box-shadow',
                properties: [
                  { name: 'X position', property: 'box-shadow-h'},
                  { name: 'Y position', property: 'box-shadow-v'},
                  { name: 'Blur', property: 'box-shadow-blur'},
                  { name: 'Spread', property: 'box-shadow-spread'},
                  { name: 'Color', property: 'box-shadow-color'},
                  { name: 'Shadow type', property: 'box-shadow-type'}
                ],
              },{
                property: 'background',
                properties: [
                  { name: 'Image', property: 'background-image'},
                  { name: 'Repeat', property: 'background-repeat'},
                  { name: 'Position', property: 'background-position'},
                  { name: 'Attachment', property: 'background-attachment'},
                  { name: 'Size', property: 'background-size'}
                ],
              }],
          },{
            name: 'Extra',
            open: false,
            buildProps: ['transition', 'perspective', 'transform'],
            properties: [
              {
                property: 'transition',
                properties: [
                  { name: 'Property', property: 'transition-property'},
                  { name: 'Duration', property: 'transition-duration'},
                  { name: 'Easing', property: 'transition-timing-function'}
                ],
              },{
                property: 'transform',
                properties: [
                  { name: 'Rotate X', property: 'transform-rotate-x'},
                  { name: 'Rotate Y', property: 'transform-rotate-y'},
                  { name: 'Rotate Z', property: 'transform-rotate-z'},
                  { name: 'Scale X', property: 'transform-scale-x'},
                  { name: 'Scale Y', property: 'transform-scale-y'},
                  { name: 'Scale Z', property: 'transform-scale-z'}
                ],
              }]
          }]
        },
        [gjsBlocksBasic]: {},
        [gjsPluginForms]: {},
        [gjsComponentCountdown]: {},
        [gjsTabs]: {},
        [gjsTooltip]: {},
        [gjsTyped]: {}
      },

      // Block Manager
      blockManager: {
        appendTo: '#blocks-container'
      },

      // Style Manager
      styleManager: {
        appendTo: '#styles-container',
        sectors: []
      },

      // Layer Manager
      layerManager: {
        appendTo: '#layers-container'
      },

      // Trait Manager  
      traitManager: {
        appendTo: '#traits-container'
      },

      // Device Manager
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
            priority: 1
          },
          {
            name: 'Tablet',
            width: '768px',
            widthMedia: '992px',
            priority: 2
          },
          {
            name: 'Mobile',
            width: '320px', 
            widthMedia: '768px',
            priority: 3
          }
        ]
      },

      // Panels
      panels: {
        defaults: [
          {
            id: 'layers',
            el: '.panel__right',
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: 0,
              cl: 1,
              cr: 0,
              bc: 0,
              keyWidth: 'flex-basis',
            },
          },
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [
              {
                id: 'show-layers',
                active: true,
                label: 'Ebenen',
                command: 'show-layers',
                togglable: false,
              },
              {
                id: 'show-style',
                active: false,
                label: 'Stile',
                command: 'show-styles',
                togglable: false,
              },
              {
                id: 'show-traits',
                active: false,
                label: 'Eigenschaften',
                command: 'show-traits',
                togglable: false,
              }
            ],
          }
        ]
      },

      // Canvas
      canvas: {
        styles: ['https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css']
      }
    });

    // Commands definieren
    gjsEditor.Commands.add('show-layers', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getLayersEl(row) { return row.querySelector('.layers-container') },

      run(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });

    gjsEditor.Commands.add('show-styles', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getStyleEl(row) { return row.querySelector('.styles-container') },

      run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });

    gjsEditor.Commands.add('show-traits', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getTraitsEl(row) { return row.querySelector('.traits-container') },

      run(editor, sender) {
        const tmEl = this.getTraitsEl(this.getRowEl(editor));
        tmEl.style.display = '';
      },
      stop(editor, sender) {
        const tmEl = this.getTraitsEl(this.getRowEl(editor));
        tmEl.style.display = 'none';
      },
    });

    // Device Commands
    gjsEditor.Commands.add('set-device-desktop', {
      run: editor => {
        editor.setDevice('Desktop');
        setCurrentDevice('Desktop');
      }
    });
    gjsEditor.Commands.add('set-device-tablet', {
      run: editor => {
        editor.setDevice('Tablet');
        setCurrentDevice('Tablet');
      }
    });
    gjsEditor.Commands.add('set-device-mobile', {
      run: editor => {
        editor.setDevice('Mobile');
        setCurrentDevice('Mobile');
      }
    });

    // Save Command
    gjsEditor.Commands.add('save-page', {
      run: editor => {
        console.log('💾 Seite wird gespeichert...');
        const html = editor.getHtml();
        const css = editor.getCss();
        
        if (onSave) {
          onSave({
            html_content: html,
            css_content: css,
            components: JSON.stringify(editor.getComponents()),
            styles: JSON.stringify(editor.getStyle())
          });
        }
      }
    });

    // Editor-Events
    gjsEditor.on('load', () => {
      console.log('✅ GrapesJS Editor geladen');
      
      // Wenn pageData vorhanden ist, Inhalte laden
      if (pageData) {
        console.log('📄 Lade Seitendaten:', pageData.title);
        
        if (pageData.components) {
          try {
            if (typeof pageData.components === 'string') {
              gjsEditor.setComponents(JSON.parse(pageData.components));
            } else {
              gjsEditor.setComponents(pageData.components);
            }
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
            if (typeof pageData.styles === 'string') {
              gjsEditor.setStyle(JSON.parse(pageData.styles));
            } else {
              gjsEditor.setStyle(pageData.styles);
            }
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

      setLoading(false);
    });

    // Auto-Save (optional)
    gjsEditor.on('component:update', () => {
      console.log('🔄 Komponente geändert');
    });

    // Editor-Instanz speichern
    setEditor(gjsEditor);

    // Globale Editor-Referenz für KI-Integration
    window.editor = gjsEditor;

    // KI-Inhaltsgenerierung Funktion
    gjsEditor.loadAiContent = (content) => {
      console.log('🤖 Lade KI-generierte Inhalte:', content);

      // Hero-Abschnitt erstellen
      const heroSection = `
        <section class="hero-section" style="padding: 80px 0; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h1 style="font-size: 3rem; margin-bottom: 20px; font-weight: bold;">${content.headline || 'Willkommen'}</h1>
            <h2 style="font-size: 1.5rem; margin-bottom: 30px; opacity: 0.9;">${content.subheadline || 'Unterüberschrift'}</h2>
            <p style="font-size: 1.2rem; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">${content.intro_text || 'Einleitungstext'}</p>
            <a href="${content.cta_primary?.action || '#'}" class="btn btn-primary" style="display: inline-block; padding: 15px 30px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.1rem; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);">
              ${content.cta_primary?.text || 'Jetzt starten'}
            </a>
          </div>
        </section>
      `;

      // Features-Abschnitt
      let featuresHtml = `
        <section class="features-section" style="padding: 80px 0; background-color: #f8f9fa;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 60px; color: #333;">Unsere Features</h2>
            <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
      `;

      if (content.features && Array.isArray(content.features)) {
        content.features.forEach((feature, index) => {
          const icons = ['🚀', '⭐', '💎', '🔥', '✨', '🎯'];
          featuresHtml += `
            <div class="feature-item" style="text-align: center; padding: 30px 20px; background: white; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
              <div class="feature-icon" style="font-size: 3rem; margin-bottom: 20px;">${icons[index] || '✨'}</div>
              <h3 style="margin-bottom: 15px; color: #333; font-size: 1.5rem;">${feature.title || 'Feature'}</h3>
              <p style="color: #666; line-height: 1.6;">${feature.description || 'Beschreibung'}</p>
            </div>
          `;
        });
      }

      featuresHtml += `
            </div>
          </div>
        </section>
      `;

      // Testimonial-Abschnitt
      const testimonialSection = content.testimonial ? `
        <section class="testimonial-section" style="padding: 80px 0; background-color: #667eea; color: white; text-align: center;">
          <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
            <blockquote style="font-style: italic; font-size: 1.5rem; margin-bottom: 30px; line-height: 1.6;">
              <p style="margin-bottom: 30px;">"${content.testimonial.text || ''}"</p>
              <cite style="display: block; font-weight: bold; font-size: 1.1rem; opacity: 0.9;">
                — ${content.testimonial.author || ''}, ${content.testimonial.position || ''}
              </cite>
            </blockquote>
          </div>
        </section>
      ` : '';

      // CTA-Abschnitt
      const ctaSection = `
        <section class="cta-section" style="padding: 80px 0; background-color: #2c3e50; color: white; text-align: center;">
          <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Bereit loszulegen?</h2>
            <p style="font-size: 1.2rem; margin-bottom: 40px; opacity: 0.9;">${content.closing_text || 'Kontaktieren Sie uns noch heute!'}</p>
            <a href="${content.cta_primary?.action || '#'}" class="btn btn-cta" style="display: inline-block; padding: 15px 30px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.1rem; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);">
              ${content.cta_primary?.text || 'Jetzt starten'}
            </a>
          </div>
        </section>
      `;

      // Alles zusammenfügen und in den Editor laden
      const fullContent = heroSection + featuresHtml + testimonialSection + ctaSection;
      gjsEditor.setComponents(fullContent);

      console.log('✅ KI-Inhalte erfolgreich geladen');
    };

    // Cleanup beim Unmount
    return () => {
      console.log('🧹 GrapesJS Editor wird aufgeräumt');
      gjsEditor.destroy();
      window.editor = null;
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
    <div className="gjs-editor-cont">
      <div className="gjs-editor-row">
        {/* Top Panel */}
        <div className="panel__top">
          <div className="panel__basic-actions">
            <button className="btn-prim" onClick={() => editor && editor.runCommand('save-page')}>
              💾 Speichern
            </button>
          </div>
          <div className="panel__devices">
            <button 
              className={`btn-prim ${currentDevice === 'Desktop' ? 'active' : ''}`}
              onClick={() => editor && editor.runCommand('set-device-desktop')}
            >
              🖥️ Desktop
            </button>
            <button 
              className={`btn-prim ${currentDevice === 'Tablet' ? 'active' : ''}`}
              onClick={() => editor && editor.runCommand('set-device-tablet')}
            >
              📱 Tablet
            </button>
            <button 
              className={`btn-prim ${currentDevice === 'Mobile' ? 'active' : ''}`}
              onClick={() => editor && editor.runCommand('set-device-mobile')}
            >
              📞 Mobile
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="editor-row">
          {/* Left Panel - Blocks */}
          <div className="panel__left">
            <div className="blocks-container" id="blocks-container"></div>
          </div>

          {/* Canvas */}
          <div className="editor-canvas" ref={editorRef}></div>

          {/* Right Panel - Layers/Styles/Traits */}
          <div className="panel__right">
            <div className="panel__switcher"></div>
            <div className="layers-container" id="layers-container"></div>
            <div className="styles-container" id="styles-container" style={{display: 'none'}}></div>
            <div className="traits-container" id="traits-container" style={{display: 'none'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrapesEditor;