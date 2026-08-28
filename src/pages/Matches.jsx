import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { rankedMatches } from '../utils/matching.js';
import { IconStar, IconArrowRight } from '../components/Icons.jsx';

const FILTERS = [
  { id: 'all', label: 'Best matches' },
  { id: 'swaps', label: 'Two-way swaps' },
  { id: 'canHelpMe', label: 'Can help me' },
  { id: 'iCanHelp', label: 'I can help' },
];

export default function Matches() {
  const { user, peers } = useApp();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const list = rankedMatches(user, peers, filter);

  return (
    <div className="screen fade-in">
      <div className="page-head">
        <span className="eyebrow">Matched on your skills</span>
        <h1>Matches</h1>
      </div>

      <div className="chip-row">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'on' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stack" style={{ marginTop: 16 }}>
        {list.length === 0 && (
          <div className="empty">
            <div className="big">🔍</div>
            <h3>No matches in this filter</h3>
            <p className="tiny">Try adding more skills to your profile.</p>
          </div>
        )}
        {list.map(({ peer, score, teaches, learns }) => (
          <button key={peer.id} className="match-card" onClick={() => navigate(`/matches/${peer.id}`)}>
            <div className="row">
              <Avatar person={peer} size="lg" />
              <div className="grow">
                <div className="between">
                  <span style={{ fontWeight: 800, fontSize: 16 }}>{peer.name}</span>
                  <span className="pill-score"><IconStar size={12} /> {score}%</span>
                </div>
                <div className="tiny muted">{peer.school} · {peer.grade}</div>
              </div>
            </div>

            {teaches.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div className="tiny muted" style={{ fontWeight: 700, marginBottom: 6 }}>Can teach you</div>
                <div className="wrap">
                  {teaches.map((s) => <span className="tag brand" key={s}>{s}</span>)}
                </div>
              </div>
            )}
            {learns.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div className="tiny muted" style={{ fontWeight: 700, marginBottom: 6 }}>You can teach them</div>
                <div className="wrap">
                  {learns.map((s) => <span className="tag outline" key={s}>{s}</span>)}
                </div>
              </div>
            )}
            {teaches.length === 0 && learns.length === 0 && (
              <div className="wrap" style={{ marginTop: 12 }}>
                {peer.offeredSkills.slice(0, 3).map((s) => <span className="tag soft" key={s}>{s}</span>)}
              </div>
            )}

            <div className="row" style={{ justifyContent: 'flex-end', color: 'var(--brand)', fontWeight: 700, fontSize: 13, marginTop: 12, gap: 4 }}>
              View match blueprint <IconArrowRight size={15} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
