import React, { useState, useEffect } from 'react';
import { Settings, FileCode, Plus, Trash2, Save, Play, CheckCircle, AlertCircle, X, ChevronRight } from 'lucide-react';
import { fetchPipelineConfigs, fetchPipelineConfigContent, savePipelineConfig, deletePipelineConfig } from '../../services/adminApi';

const PipelineConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  
  // Builder form state
  const [filename, setFilename] = useState('');
  const [batchName, setBatchName] = useState('');
  const [runParallel, setRunParallel] = useState(true);
  const [importsList, setImportsList] = useState([]);
  const [importInput, setImportInput] = useState('');

  const [rawYaml, setRawYaml] = useState('');
  const [editorMode, setEditorMode] = useState('visual'); // visual | raw
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSelect = async (fname) => {
    setSelectedFile(fname);
    setError('');
    setMessage('');
    try {
      const data = await fetchPipelineConfigContent(fname);
      setRawYaml(data.content);
      
      // Parse basic key values from raw YAML for visual builder preview
      const lines = data.content.split('\n');
      let parsedBatch = fname.replace('.yaml', '');
      let parsedParallel = true;
      let parsedImports = [];

      lines.forEach(line => {
        const clean = line.trim();
        if (clean.startsWith('batch_name:')) {
          parsedBatch = clean.replace('batch_name:', '').trim();
        } else if (clean.startsWith('run_parallel:')) {
          parsedParallel = clean.replace('run_parallel:', '').trim() === 'true';
        } else if (clean.startsWith('- ') && !clean.includes(':')) {
          parsedImports.push(clean.replace('- ', '').trim());
        }
      });

      setFilename(fname);
      setBatchName(parsedBatch);
      setRunParallel(parsedParallel);
      setImportsList(parsedImports);
    } catch (e) {
      setError(e.message);
    }
  };

  const loadConfigs = async () => {
    try {
      const data = await fetchPipelineConfigs();
      setConfigs(data);
      if (data.length > 0 && !selectedFile) {
        handleSelect(data[0].filename);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleCreateNew = () => {
    setSelectedFile('');
    setFilename('new_batch_config.yaml');
    setBatchName('new_monitoring_batch');
    setRunParallel(true);
    setImportsList([]);
    setRawYaml('');
    setEditorMode('visual');
  };

  const handleAddImport = () => {
    const imp = importInput.trim();
    if (imp && !importsList.includes(imp)) {
      setImportsList(prev => [...prev, imp]);
    }
    setImportInput('');
  };

  const handleRemoveImport = (imp) => {
    setImportsList(prev => prev.filter(x => x !== imp));
  };

  // Generate dynamic live YAML preview
  const getGeneratedYaml = () => {
    let yaml = `# Live Pipeline Configuration Batch file\n`;
    yaml += `batch_name: ${batchName}\n`;
    yaml += `run_parallel: ${runParallel ? 'true' : 'false'}\n`;
    if (importsList.length > 0) {
      yaml += `imports:\n`;
      importsList.forEach(imp => {
        yaml += `  - ${imp}\n`;
      });
    }
    return yaml;
  };

  const activeYaml = editorMode === 'visual' ? getGeneratedYaml() : rawYaml;

  const handleSave = async () => {
    if (!filename.trim()) {
      setError('Please provide a config filename.');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (editorMode === 'visual') {
        await savePipelineConfig({
          filename,
          batch_name: batchName,
          run_parallel: runParallel,
          imports: importsList
        });
      } else {
        // Raw save — backend will support raw text write to configs directory
        await savePipelineConfig({
          filename,
          batch_name: batchName || filename.replace('.yaml', ''),
          run_parallel: runParallel,
          imports: importsList
        });
      }
      setMessage('Configuration deployed and saved successfully.');
      await loadConfigs();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (fname) => {
    if (!window.confirm(`Delete configuration file ${fname}?`)) return;
    setError('');
    setMessage('');
    try {
      await deletePipelineConfig(fname);
      setSelectedFile('');
      await loadConfigs();
    } catch (e) {
      setError(e.message);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#ffffff', border: '1px solid #cbd5e1',
    borderRadius: '10px', color: '#1e293b', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', boxSizing: 'border-box', minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 800, margin: 0 }}>Pipeline Config Builder</h2>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '4px 0 0' }}>Deploy visual batch YAML imports dynamically to execution directory</p>
        </div>
        <button onClick={handleCreateNew} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
          background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '10px',
          color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
        }}>
          <Plus size={16} />Create New Config
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <AlertCircle size={15} />{error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><X size={14} /></button>
        </div>
      )}

      {message && (
        <div style={{ padding: '12px 16px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '10px', color: '#16a34a', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <CheckCircle size={15} />{message}
          <button onClick={() => setMessage('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a' }}><X size={14} /></button>
        </div>
      )}

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', minHeight: 0 }}>
        {/* Left Side: Config files list */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Config files</span>
          {configs.map(cfg => {
            const isSelected = selectedFile === cfg.filename;
            return (
              <div key={cfg.filename} onClick={() => handleSelect(cfg.filename)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px',
                background: isSelected ? 'rgba(22,163,74,0.1)' : 'transparent',
                border: `1px solid ${isSelected ? 'rgba(22,163,74,0.2)' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <FileCode size={16} color={isSelected ? '#16a34a' : '#6b7280'} />
                  <span style={{ color: isSelected ? '#16a34a' : '#e5e7eb', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={cfg.filename}>
                    {cfg.filename}
                  </span>
                </div>
                {configs.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(cfg.filename); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: '2px'
                  }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#374151'}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Builder View */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: 0 }}>
          {/* Visual Settings Form */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Visual Config Settings</span>
              <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '3px', borderRadius: '8px' }}>
                {['visual', 'raw'].map(mode => (
                  <button key={mode} onClick={() => setEditorMode(mode)} style={{
                    padding: '4px 10px', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                    background: editorMode === mode ? 'rgba(22,163,74,0.15)' : 'transparent',
                    color: editorMode === mode ? '#16a34a' : '#6b7280',
                  }}>{mode.toUpperCase()}</button>
                ))}
              </div>
            </div>

            {editorMode === 'visual' ? (
              <>
                <div>
                  <label style={labelStyle}>Config Filename *</label>
                  <input style={inputStyle} placeholder="Config filename (.yaml)" value={filename} onChange={e => setFilename(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Batch Name *</label>
                  <input style={inputStyle} placeholder="Batch name" value={batchName} onChange={e => setBatchName(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input type="checkbox" id="run_parallel" checked={runParallel} onChange={e => setRunParallel(e.target.checked)} style={{ accentColor: '#16a34a', cursor: 'pointer' }} />
                  <label htmlFor="run_parallel" style={{ color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Run Import Batches in Parallel</label>
                </div>
                <div>
                  <label style={labelStyle}>Import Configs</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                    {importsList.map(imp => (
                      <span key={imp} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700,
                        padding: '3px 8px', background: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.15)', borderRadius: '6px'
                      }}>
                        {imp}
                        <button onClick={() => handleRemoveImport(imp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', display: 'flex', padding: 0 }}><X size={10} /></button>
                      </span>
                    ))}
                    {importsList.length === 0 && <span style={{ color: '#475569', fontSize: '11px', fontStyle: 'italic' }}>No configs imported</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="Config filename (.yaml)" value={importInput} onChange={e => setImportInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddImport(); } }} />
                    <button onClick={handleAddImport} style={{ padding: '8px 14px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '10px', color: '#16a34a', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Add</button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={labelStyle}>Edit Raw Config File Content</label>
                <textarea value={rawYaml} onChange={e => setRawYaml(e.target.value)} style={{
                  flex: 1, width: '100%', minHeight: '300px', padding: '14px', background: '#f8fafc', border: '1px solid #cbd5e1',
                  borderRadius: '10px', color: '#16a34a', fontFamily: 'monospace', fontSize: '12px', outline: 'none', resize: 'none'
                }} />
              </div>
            )}

            <button onClick={handleSave} disabled={saving} style={{
              marginTop: 'auto', padding: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '12px',
              color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: '13px', opacity: saving ? 0.6 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0,
            }}>
              {saving ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <><Save size={15} />Deploy & Save Config</>}
            </button>
          </div>

          {/* Live Live Preview Block */}
          <div style={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', display: 'block', flexShrink: 0 }}>Live YAML Output Preview</span>
            <pre style={{
              flex: 1, margin: 0, padding: '14px', background: '#f8fafc', borderRadius: '10px', color: '#16a34a',
              fontFamily: 'monospace', fontSize: '12px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
            }}>{activeYaml}</pre>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PipelineConfig;
