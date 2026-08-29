import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import { SKILL_CATEGORIES } from '../data/mockData.js';
import { peerSkillsInCategory, matchScore } from '../utils/matching.js';
import {
  IconChevronLeft, IconStar, IconArrowRight, IconChat, IconCoin,
} from '../components/Icons.jsx';

const SORTS = [
  { id: 'match', label: 'Best match' },
  { id: 'rating', label: 'Top rated' },
  { id: 'tutored', label: 'Most tutored' },
];

export default function Category() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const app = useApp();
  const { user, peers, credits, activeMatches } = app;
  const cat = SKILL_CATEGORIES.find((c) => c.id === id);
  const [sort, setSort] = useState('match');

  const tutors = peers
    .map((p) => ({
      peer: p,
      skills: peerSkillsInCategory(p, id),
      score: matchScore(user, p),
    }))
    .filter((t) => t.skills.length > 0)
    .sort((a, b) => {
      if (sort === 'rating') return b.peer.rating - a.peer.rating;
      if (sort === 'tutored') return b.peer.tutored - a.peer.tutored;
      return b.score - a.score;
    });

  const book = (peer) => {
    const cost = peer.rate;
    if (credits < cost) {
      toast(`Need ${cost} credits — earn some by tutoring`);
      navigate('/credits');
      return;
    }
    app.bookSession(peer.id);
    toast(`Booked with ${peer.name.split(' ')[0]} · −${cost} credits`);
    navigate(`/chat/${peer.id}`);
  };

  return (
    <div className="screen fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Categories</button>
      <div className="page-head" style={{ marginTop: 12 }}>
        <div className="between">
          <div className="row">
            <span className="emoji" style={{ width: 46, height: 46, borderRadius: 14, display: 'grid', placeItems: 'center', fontSize: 24, background: `${cat?.tint || '#ccc'}1f` }}>
              {cat?.emoji || '📁'}
            </span>
            <div>
              <h1 style={{ fontSize: 24 }}>{cat?.label || 'Category'}</h1>
              <p className="tiny muted">{tutors.length} tutor{tutors.length === 1 ? '' : 's'} available</p>
            </div>
          </div>
          <button className="credit-pill" onClick={() => navigate('/credits')}><IconCoin size={15} /> {credits}</button>
        </div>
      </div>

      <div className="seg-row">
        {SORTS.map((s) => (
          <button key={s.id} className={`seg ${sort === s.id ? 'on' : ''}`} onClick={() => setSort(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="stack">
        {tutors.length === 0 && (
          <div className="empty"><div className="big">🫥</div><h3>No tutors yet</h3><p className="tiny">Check back soon or invite a friend.</p></div>
        )}
        {tutors.map(({ peer, skills, score }) => {
          const connected = activeMatches.includes(peer.id);
          const topEndorsed = Object.entries(peer.endorsements || {}).sort((a, b) => b[1] - a[1])[0];
          return (
            <div className="tutor-card" key={peer.id}>
              <div className="row" onClick={() => navigate(`/u/${peer.id}`)} style={{ cursor: 'pointer' }}>
                <Avatar person={peer} size="lg" />
                <div className="grow">
                  <div className="between">
                    <span style={{ fontWeight: 800, fontSize: 15.5 }}>{peer.name}</span>
                    <span className="pill-score"><IconStar size={12} /> {score}%</span>
                  </div>
                  <div className="rating-line">
                    <span className="star-badge"><IconStar size={11} /> {peer.rating.toFixed(1)}</span>
                    <span>{peer.ratingCount} ratings</span>
                    <span>· {peer.tutored} people tutored</span>
                  </div>
                </div>
              </div>

              <div className="wrap" style={{ marginTop: 10 }}>
                {skills.map((s) => <span className="tag brand" key={s}>{s}</span>)}
              </div>
              {topEndorsed && (
                <p className="tiny muted" style={{ marginTop: 8, fontWeight: 700 }}>
                  👍 {topEndorsed[1]} endorsements for {topEndorsed[0]}
                </p>
              )}

              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <button className="btn sm block" onClick={() => book(peer)}>
                  <IconCoin size={14} /> Book · {peer.rate} cr
                </button>
                <button
                  className="btn sm secondary"
                  onClick={() => { app.startConversation(peer.id); navigate(`/chat/${peer.id}`); }}
                  aria-label="Message"
                >
                  <IconChat size={14} />
                </button>
                <button className="btn sm secondary" onClick={() => navigate(`/matches/${peer.id}`)} aria-label="Details">
                  <IconArrowRight size={14} />
                </button>
              </div>
              {connected && <p className="tiny" style={{ color: 'var(--ok)', fontWeight: 700, marginTop: 8 }}>● Already connected</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
