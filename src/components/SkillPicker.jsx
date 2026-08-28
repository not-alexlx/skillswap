import { useMemo, useRef, useState } from 'react';
import { SKILL_LIBRARY } from '../data/mockData.js';
import { IconPlus, IconX } from './Icons.jsx';

export default function SkillPicker({ label, hint, value, onChange, tagClass = 'tag', accent }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const chosen = new Set(value.map((v) => v.toLowerCase()));
    return SKILL_LIBRARY.filter(
      (s) => !chosen.has(s.name.toLowerCase()) && (!q || s.name.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, value]);

  const add = (name) => {
    const clean = name.trim();
    if (!clean) return;
    if (!value.some((v) => v.toLowerCase() === clean.toLowerCase())) onChange([...value, clean]);
    setQuery('');
    inputRef.current?.focus();
  };
  const remove = (name) => onChange(value.filter((v) => v !== name));

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="wrap" style={{ marginBottom: value.length || open ? 10 : 0 }}>
        {value.map((skill) => (
          <span
            className={tagClass}
            key={skill}
            style={accent ? { background: accent, borderColor: accent, color: '#fff' } : undefined}
          >
            {skill}
            <button type="button" aria-label={`Remove ${skill}`} onClick={() => remove(skill)}>
              <IconX size={13} />
            </button>
          </span>
        ))}
        {!open && (
          <button type="button" className="tag add" onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}>
            <IconPlus size={14} /> Add skill
          </button>
        )}
      </div>

      {open && (
        <div className="fade-in">
          <input
            ref={inputRef}
            className="input"
            placeholder="Type a subject or hobby…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); add(query); }
              if (e.key === 'Escape') { setOpen(false); setQuery(''); }
            }}
          />
          <div className="wrap" style={{ marginTop: 10 }}>
            {suggestions.map((s) => (
              <button type="button" key={s.name} className="tag soft" onClick={() => add(s.name)}>
                <IconPlus size={13} /> {s.name}
              </button>
            ))}
            {query.trim() && !suggestions.some((s) => s.name.toLowerCase() === query.trim().toLowerCase()) && (
              <button type="button" className="tag brand" onClick={() => add(query)}>
                <IconPlus size={13} /> Add “{query.trim()}”
              </button>
            )}
          </div>
          <button type="button" className="link-btn" style={{ marginTop: 4 }} onClick={() => { setOpen(false); setQuery(''); }}>
            Done
          </button>
        </div>
      )}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}
