import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { SKILL_CATEGORIES } from '../data/mockData.js';
import { categoryForSkill, matchScore } from '../utils/matching.js';
import { IconChevronLeft, IconStar } from '../components/Icons.jsx';

export default function Category() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, peers } = useApp();
  const cat = SKILL_CATEGORIES.find((c) => c.id === id);

  const tutors = peers
    .map((p) => ({
      peer: p,
      skills: p.offeredSkills.filter((s) => categoryForSkill(s) === id),
      score: matchScore(user, p),
    }))
    .filter((t) => t.skills.length > 0)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="screen fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Categories</button>
      <div className="page-head" style={{ marginTop: 12 }}>
        <div className="row">
          <span className="emoji" style={{ width: 46, height: 46, borderRadius: 14, display: 'grid', placeItems: 'center', fontSize: 24, background: `${cat?.tint || '#ccc'}1f` }}>
            {cat?.emoji || '📁'}
          </span>
          <div>
            <h1 style={{ fontSize: 24 }}>{cat?.label || 'Category'}</h1>
            <p className="tiny muted">{tutors.length} peer{tutors.length === 1 ? '' : 's'} can help here</p>
          </div>
        </div>
      </div>

      <div className="stack">
        {tutors.length === 0 && (
          <div className="empty"><div className="big">🫥</div><h3>No tutors yet</h3><p className="tiny">Check back soon or invite a friend.</p></div>
        )}
        {tutors.map(({ peer, skills, score }) => (
          <button key={peer.id} className="match-card" onClick={() => navigate(`/matches/${peer.id}`)}>
            <div className="row">
              <Avatar person={peer} />
              <div className="grow">
                <div className="between">
                  <span style={{ fontWeight: 800 }}>{peer.name}</span>
                  <span className="pill-score"><IconStar size={12} /> {score}%</span>
                </div>
                <div className="tiny muted">{peer.grade} · ⭐ {peer.rating} · {peer.sessions} swaps</div>
              </div>
            </div>
            <div className="wrap" style={{ marginTop: 10 }}>
              {skills.map((s) => <span className="tag brand" key={s}>{s}</span>)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
