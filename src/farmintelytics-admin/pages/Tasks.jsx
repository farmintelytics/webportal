import React, { useState, useEffect, useRef } from 'react';
import {
  KanbanSquare, Plus, Trash2, Edit3, X, Check, Calendar,
  Tag, User, AlertCircle, ChevronDown, GripVertical, Search,
  Clock, Zap, ArrowUp, Minus,
} from 'lucide-react';
import {
  fetchTaskBoard, createTask, updateTask, moveTask, deleteTask,
} from '../../services/adminApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: 'backlog',     label: 'Backlog',     color: '#475569', bg: 'rgba(107,114,128,0.04)' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.04)' },
  { id: 'review',     label: 'Review',       color: '#3b82f6', bg: 'rgba(59,130,246,0.04)' },
  { id: 'done',       label: 'Done',         color: '#16a34a', bg: 'rgba(22,163,74,0.04)' },
];

const PRIORITIES = [
  { id: 'low',    label: 'Low',    color: '#475569', icon: Minus },
  { id: 'medium', label: 'Medium', color: '#f59e0b', icon: Minus },
  { id: 'high',   label: 'High',   color: '#ef4444', icon: ArrowUp },
  { id: 'urgent', label: 'Urgent', color: '#dc2626', icon: Zap },
];

const COMMON_TAGS = ['pipeline', 'infra', 'frontend', 'backend', 'data', 'bug', 'feature', 'monitoring', 'urgent', 'review'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getPriorityStyle = (p) => PRIORITIES.find(x => x.id === p) || PRIORITIES[1];

const formatDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  const now  = new Date();
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  return { label, overdue: diff < 0, soon: diff >= 0 && diff <= 2 };
};

// ─── Task Card ────────────────────────────────────────────────────────────────

const TaskCard = ({ task, onEdit, onDelete, onDragStart }) => {
  const prio = getPriorityStyle(task.priority);
  const due  = formatDate(task.due_date);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '12px', padding: '14px',
        cursor: 'grab', userSelect: 'none',
        transition: 'all 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
    >
      {/* Priority bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
        borderRadius: '12px 0 0 12px',
        background: prio.color,
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', paddingLeft: '8px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#1e293b', fontSize: '13px', fontWeight: 600, lineHeight: '1.4', margin: 0 }}>{task.title}</p>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            onClick={() => onEdit(task)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px', borderRadius: '6px', display: 'flex' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.background = 'none'; }}
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px', borderRadius: '6px', display: 'flex' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.background = 'none'; }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ color: '#475569', fontSize: '11px', marginTop: '6px', marginBottom: '0', lineHeight: '1.5', paddingLeft: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px', paddingLeft: '8px' }}>
          {task.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
              padding: '2px 7px', borderRadius: '6px',
              background: 'rgba(22,163,74,0.1)', color: '#16a34a',
              border: '1px solid rgba(22,163,74,0.15)',
            }}>{tag}</span>
          ))}
          {task.tags.length > 3 && (
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <prio.icon size={11} color={prio.color} />
          <span style={{ fontSize: '10px', color: prio.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {prio.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.assignee && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8px', fontWeight: 800, color: 'white',
              }}>
                {task.assignee[0]?.toUpperCase()}
              </div>
            </div>
          )}
          {due && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: 700,
              color: due.overdue ? '#ef4444' : due.soon ? '#f59e0b' : '#4b5563',
            }}>
              <Clock size={10} />
              {due.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Column ───────────────────────────────────────────────────────────────────

const KanbanColumn = ({ col, tasks, onEdit, onDelete, onAddTask, onDragStart, onDrop, onDragOver, draggingId }) => {
  return (
    <div
      style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '0' }}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, col.id)}
    >
      {/* Column header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
          <span style={{ color: '#1e293b', fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {col.label}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 700, color: col.color,
            background: col.bg, padding: '2px 8px', borderRadius: '20px',
            border: `1px solid ${col.color}30`,
          }}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(col.id)}
          style={{
            background: '#ffffff', border: '1px solid #cbd5e1',
            borderRadius: '8px', padding: '4px', cursor: 'pointer', color: '#475569',
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = col.color; e.currentTarget.style.borderColor = col.color + '40'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Cards */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', gap: '8px',
        minHeight: '80px', padding: '8px',
        background: col.bg, borderRadius: '12px',
        border: `1px solid ${col.color}20`,
        transition: 'all 0.15s',
      }}>
        {tasks.length === 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '80px', color: '#475569', fontSize: '11px', fontWeight: 600,
            fontStyle: 'italic',
          }}>
            Drop tasks here
          </div>
        )}
        {tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Task Modal ───────────────────────────────────────────────────────────────

const TaskModal = ({ task, defaultStatus, onSave, onClose }) => {
  const [form, setForm] = useState({
    title:       task?.title || '',
    description: task?.description || '',
    status:      task?.status || defaultStatus || 'backlog',
    priority:    task?.priority || 'medium',
    assignee:    task?.assignee || '',
    tags:        task?.tags || [],
    due_date:    task?.due_date || '',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = (tag) => {
    const t = tag.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        due_date: form.due_date || null,
        tags: form.tags,
      };
      await onSave(task?.id, payload);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px', color: '#1e293b',
    fontSize: '13px', fontWeight: 500,
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Roboto', sans-serif",
  };

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: 800,
    color: '#64748b', letterSpacing: '0.12em',
    textTransform: 'uppercase', marginBottom: '6px',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: '100%', maxWidth: '520px',
        background: '#ffffff', border: '1px solid #cbd5e1',
        borderRadius: '20px', padding: '28px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 800, margin: 0 }}>
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} placeholder="Task title…" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Optional description…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Row: Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => set('status', e.target.value)}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Assignee + Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Assignee</label>
              <input style={inputStyle} placeholder="Name or email…" value={form.assignee} onChange={e => set('assignee', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" style={inputStyle} value={form.due_date} onChange={e => set('due_date', e.target.value)} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {form.tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                  background: 'rgba(22,163,74,0.1)', color: '#16a34a',
                  border: '1px solid rgba(22,163,74,0.2)', borderRadius: '8px',
                }}>
                  {tag}
                  <button onClick={() => set('tags', form.tags.filter(t => t !== tag))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', display: 'flex', padding: 0 }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Add tag…"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
              />
              <button onClick={() => addTag(tagInput)} style={{
                padding: '10px 14px', background: 'rgba(22,163,74,0.1)',
                border: '1px solid rgba(22,163,74,0.2)', borderRadius: '10px',
                color: '#16a34a', cursor: 'pointer', fontWeight: 700, fontSize: '12px',
              }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
              {COMMON_TAGS.filter(t => !form.tags.includes(t)).map(t => (
                <button key={t} onClick={() => addTag(t)} style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                  background: '#ffffff', border: '1px solid #cbd5e1',
                  borderRadius: '6px', color: '#475569', cursor: 'pointer',
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: '#ffffff',
            border: '1px solid #cbd5e1', borderRadius: '12px',
            color: '#334155', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.title.trim()} style={{
            flex: 2, padding: '12px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            border: 'none', borderRadius: '12px',
            color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: '13px',
            opacity: saving || !form.title.trim() ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            {saving
              ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : <><Check size={15} />{task ? 'Update Task' : 'Create Task'}</>
            }
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Main Tasks Page ──────────────────────────────────────────────────────────

const Tasks = () => {
  const [board, setBoard] = useState({ backlog: [], in_progress: [], review: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { task: null|obj, defaultStatus: string }
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const dragTask = useRef(null);

  const loadBoard = async () => {
    try {
      const data = await fetchTaskBoard();
      setBoard(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBoard(); }, []);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────

  const handleDragStart = (e, task) => {
    dragTask.current = task;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const task = dragTask.current;
    if (!task || task.status === targetStatus) return;
    // Optimistic update
    setBoard(prev => {
      const newBoard = { ...prev };
      // Remove from old column
      newBoard[task.status] = newBoard[task.status].filter(t => t.id !== task.id);
      // Add to new column
      const updated = { ...task, status: targetStatus };
      newBoard[targetStatus] = [...newBoard[targetStatus], updated];
      return newBoard;
    });
    try {
      await moveTask(task.id, targetStatus, board[targetStatus].length);
    } catch {
      await loadBoard(); // rollback on error
    }
    dragTask.current = null;
  };

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const handleSave = async (id, payload) => {
    try {
      if (id) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }
      setModal(null);
      await loadBoard();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      await loadBoard();
    } catch (e) {
      setError(e.message);
    }
  };

  // ── Filtering ───────────────────────────────────────────────────────────────

  const filterTasks = (tasks) => {
    let out = tasks;
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assignee?.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    if (filterPriority) out = out.filter(t => t.priority === filterPriority);
    return out;
  };

  const totalTasks = Object.values(board).flat().length;

  return (
    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box', minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 800, margin: 0 }}>Task Board</h2>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '4px 0 0' }}>
            {totalTasks} tasks across {COLUMNS.length} columns
          </p>
        </div>
        <button
          onClick={() => setModal({ task: null, defaultStatus: 'backlog' })}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.25)',
          }}
        >
          <Plus size={16} />New Task
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            placeholder="Search tasks, tags, assignees…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px', color: '#1e293b',
              fontSize: '13px', fontWeight: 500,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          style={{
            padding: '10px 12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px', color: '#1e293b',
            fontSize: '13px', fontWeight: 600,
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertCircle size={15} />
          <span>{error} — showing local state</span>
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><X size={14} /></button>
        </div>
      )}

      {/* Board */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(22,163,74,0.2)', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Loading board…</p>
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', gap: '16px',
          overflow: 'auto', paddingBottom: '8px',
        }}>
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.id}
              col={col}
              tasks={filterTasks(board[col.id] || [])}
              onEdit={(task) => setModal({ task, defaultStatus: col.id })}
              onDelete={handleDelete}
              onAddTask={(status) => setModal({ task: null, defaultStatus: status })}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal.task}
          defaultStatus={modal.defaultStatus}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Tasks;
