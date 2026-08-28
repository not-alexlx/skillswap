const PALETTE = ['#6C5CE7', '#22C7A9', '#FF7A59', '#E4568A', '#F5A524', '#3B82F6', '#16A34A', '#8B5CF6'];

function colorFor(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function Avatar({ person, name, initials, color, size = 'md', ring = false, className = '', onClick }) {
  const label = initials || person?.initials || deriveInitials(name || person?.name || '?');
  const bg = color || person?.color || colorFor(person?.id || name || label);
  const sizeClass = size === 'md' ? '' : size;
  return (
    <div
      className={`avatar ${sizeClass} ${ring ? 'ring' : ''} ${className}`.trim()}
      style={{ background: bg, color: bg, cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      <span style={{ color: '#fff' }}>{label}</span>
    </div>
  );
}

function deriveInitials(n) {
  const parts = n.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}
