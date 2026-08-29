import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { SKILL_CATEGORIES } from '../data/mockData.js';
import { categoriesForPeer, recommendedTutors } from '../utils/matching.js';
import { IconArrowRight, IconStar, IconSparkle } from '../components/Icons.jsx';

export default function Learn() {
  const { user, peers, credits, activeMatches, passedTutors } = useApp();
  const navigate = useNavigate();

  const countFor = (catId) => peers.filter((p) => categoriesForPeer(p).includes(catId)).length;
  const topPick = recommendedTutors(user, peers, { exclude: [...activeMatches, ...passedTutors], limit: 1 })[0];

  return (
    <div className="screen fade-in">
      <div className="page-head">
        <span className="eyebrow">Pick a field to get tutored in</span>
        <h1 style={{ fontSize: 26 }}>Learn</h1>
      </div>

      {topPick && (
        <button
          className="card pad-lg"
          onClick={() => navigate(`/matches/${topPick.peer.id}`)}
          style={{ display: 'block', width: '100%', textAlign: 'left', background: 'linear-gradient(135deg, var(--brand), var(--pink))', color: '#fff', border: 'none' }}
        >
          <span className="tiny" style={{ fontWeight: 800, opacity: 0.9, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <IconSparkle size={14} /> AUTO-RECOMMENDED TUTOR
          </span>
          <div className="row" style={{ marginTop: 12 }}>
            <Avatar person={topPick.peer} size="lg" />
            <div className="grow">
              <div style={{ fontWeight: 800, fontSize: 17 }}>{topPick.peer.name}</div>
              <div className="tiny" style={{ opacity: 0.92 }}>
                {topPick.peer.rating}★ · {topPick.peer.tutored} tutored · teaches {topPick.teaches[0] || topPick.peer.offeredSkills[0]}
              </div>
            </div>
            <IconArrowRight size={20} />
          </div>
        </button>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Browse by category</h2>
          <Link to="/matches" className="link-btn">All matches</Link>
        </div>
        <div className="grid-2">
          {SKILL_CATEGORIES.map((c) => (
            <button key={c.id} className="category-tile" onClick={() => navigate(`/category/${c.id}`)}>
              <span className="emoji" style={{ background: `${c.tint}1f` }}>{c.emoji}</span>
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                {c.label}
                <span className="tiny muted" style={{ fontWeight: 700 }}>{countFor(c.id)} tutors</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Highest-rated tutors</h2></div>
        <div className="stack">
          {[...peers].sort((a, b) => (b.rating - a.rating) || (b.tutored - a.tutored)).slice(0, 4).map((p) => (
            <div className="list-row" key={p.id} onClick={() => navigate(`/u/${p.id}`)}>
              <Avatar person={p} size="lg" />
              <div className="grow">
                <div className="name">{p.name}</div>
                <div className="preview">
                  <span className="star-badge"><IconStar size={11} /> {p.rating}</span>
                  &nbsp; {p.tutored} people tutored · {p.offeredSkills[0]}
                </div>
              </div>
              <IconArrowRight size={16} style={{ color: 'var(--ink-3)' }} />
            </div>
          ))}
        </div>
      </section>

      <button className="btn block secondary" style={{ marginTop: 24 }} onClick={() => navigate('/credits')}>
        You have {credits} credits · manage
      </button>
    </div>
  );
}
