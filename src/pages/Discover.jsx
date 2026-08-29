import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import { SKILL_CATEGORIES } from '../data/mockData.js';
import {
  matchScore, peerSkillsInCategory, categoriesForPeer, matchReasons,
} from '../utils/matching.js';
import {
  IconX, IconHeart, IconStar, IconRefresh, IconArrowRight, IconBolt,
} from '../components/Icons.jsx';

const THRESHOLD = 90;

export default function Discover() {
  const app = useApp();
  const { user, peers, activeMatches, passedTutors, matchRequests } = app;
  const navigate = useNavigate();
  const toast = useToast();
  const [field, setField] = useState('all');
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const startRef = useRef(null);

  const pendingIds = matchRequests.filter((m) => m.status === 'pending').map((m) => m.peerId);

  const queue = useMemo(() => {
    const skip = new Set([...activeMatches, ...passedTutors, ...pendingIds]);
    return peers
      .filter((p) => !skip.has(p.id))
      .filter((p) => field === 'all' || categoriesForPeer(p).includes(field))
      .map((p) => ({ peer: p, score: matchScore(user, p) }))
      .sort((a, b) => b.score - a.score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peers, activeMatches, passedTutors, pendingIds.join(','), field, user]);

  const top = queue[0];
  const next = queue[1];

  const commit = (dir) => {
    if (!top) return;
    const name = top.peer.name.split(' ')[0];
    app.swipeTutor(top.peer.id, dir, field === 'all' ? null : field);
    if (dir === 'right') toast(`Match sent to ${name} — they'll get to accept`);
    else toast(`Passed on ${name}`);
    setDrag({ x: 0, y: 0, active: false });
  };

  const onDown = (e) => {
    const pt = e.touches ? e.touches[0] : e;
    startRef.current = { x: pt.clientX, y: pt.clientY };
    setDrag((d) => ({ ...d, active: true }));
  };
  const onMove = (e) => {
    if (!startRef.current) return;
    const pt = e.touches ? e.touches[0] : e;
    setDrag({ x: pt.clientX - startRef.current.x, y: pt.clientY - startRef.current.y, active: true });
  };
  const onUp = () => {
    if (!startRef.current) return;
    startRef.current = null;
    if (drag.x > THRESHOLD) return commit('right');
    if (drag.x < -THRESHOLD) return commit('left');
    setDrag({ x: 0, y: 0, active: false });
  };

  const rot = drag.x / 18;
  const likeOpacity = Math.max(0, Math.min(1, drag.x / THRESHOLD));
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / THRESHOLD));

  return (
    <div className="screen fade-in">
      <div className="page-head">
        <span className="eyebrow">Swipe to find a mentor</span>
        <h1 style={{ fontSize: 26 }}>Discover</h1>
      </div>

      <div className="seg-row">
        <button className={`seg ${field === 'all' ? 'on' : ''}`} onClick={() => setField('all')}>
          <IconBolt size={13} /> All fields
        </button>
        {SKILL_CATEGORIES.map((c) => (
          <button key={c.id} className={`seg ${field === c.id ? 'on' : ''}`} onClick={() => setField(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {!top ? (
        <div className="empty" style={{ marginTop: 40 }}>
          <div className="big">🎉</div>
          <h3>You're all caught up</h3>
          <p className="tiny">No more tutors to review in this field. Check your matches or reset.</p>
          <div className="stack" style={{ marginTop: 16, maxWidth: 240, marginInline: 'auto' }}>
            <button className="btn block" onClick={() => navigate('/matches')}>See your matches</button>
            {passedTutors.length > 0 && (
              <button className="btn block secondary" onClick={() => { app.resetSwipes(); toast('Passed tutors are back'); }}>
                <IconRefresh size={15} /> Reset passed
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="deck">
            {next && (
              <div className="swipe-card" style={{ transform: 'scale(0.955) translateY(10px)', filter: 'brightness(0.97)' }}>
                <CardFace item={next} user={user} field={field} />
              </div>
            )}
            <div
              className="swipe-card"
              style={{
                transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rot}deg)`,
                transition: drag.active ? 'none' : 'transform 0.28s cubic-bezier(.2,.8,.2,1)',
                touchAction: 'pan-y',
              }}
              onMouseDown={onDown}
              onMouseMove={drag.active ? onMove : undefined}
              onMouseUp={onUp}
              onMouseLeave={drag.active ? onUp : undefined}
              onTouchStart={onDown}
              onTouchMove={onMove}
              onTouchEnd={onUp}
            >
              <span className="swipe-stamp like" style={{ opacity: likeOpacity }}>Match</span>
              <span className="swipe-stamp nope" style={{ opacity: nopeOpacity }}>Pass</span>
              <CardFace item={top} user={user} field={field} />
            </div>
          </div>

          <div className="deck-actions">
            {passedTutors.length > 0 && (
              <button className="deck-btn undo" onClick={() => { app.resetSwipes(); toast('Passed tutors restored'); }} aria-label="Undo passes">
                <IconRefresh size={18} />
              </button>
            )}
            <button className="deck-btn nope" onClick={() => commit('left')} aria-label="Pass">
              <IconX size={26} />
            </button>
            <button className="deck-btn info" onClick={() => navigate(`/u/${top.peer.id}`)} aria-label="View profile">
              <IconArrowRight size={20} />
            </button>
            <button className="deck-btn like" onClick={() => commit('right')} aria-label="Match">
              <IconHeart size={24} />
            </button>
          </div>
          <p className="tiny muted center" style={{ marginTop: 12 }}>
            Swipe right to request a mentor match · they accept to connect
          </p>
        </>
      )}
    </div>
  );
}

function CardFace({ item, user, field }) {
  const { peer } = item;
  const skills = field !== 'all' ? peerSkillsInCategory(peer, field) : peer.offeredSkills;
  const reasons = matchReasons(user, peer);
  return (
    <>
      <div className="hero" style={{ background: `linear-gradient(150deg, ${peer.color}, ${peer.color}99)` }}>
        <Avatar person={peer} size="xl" ring />
      </div>
      <div className="body">
        <div className="between">
          <h3>{peer.name}</h3>
          <span className="star-badge"><IconStar size={12} /> {peer.rating}</span>
        </div>
        <p className="tiny muted" style={{ marginTop: 2 }}>
          {peer.grade} · {peer.school} · {peer.tutored} people tutored
        </p>
        {peer.headline && <p className="tiny" style={{ marginTop: 8, fontWeight: 600 }}>{peer.headline}</p>}
        <div className="wrap" style={{ marginTop: 10 }}>
          {skills.slice(0, 4).map((s) => <span className="tag brand" key={s}>{s}</span>)}
        </div>
        {reasons.length > 0 && (
          <div className="wrap" style={{ marginTop: 10 }}>
            {reasons.map((r) => <span className="reason-chip" key={r}>{r}</span>)}
          </div>
        )}
        <p className="tiny muted" style={{ marginTop: 12, lineHeight: 1.5 }}>{peer.bio}</p>
      </div>
    </>
  );
}
