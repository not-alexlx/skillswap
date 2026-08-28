import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import { SKILL_CATEGORIES } from '../data/mockData.js';
import { rankedMatches } from '../utils/matching.js';
import {
  IconBell, IconCheck, IconX, IconArrowRight, IconSparkle, IconChat,
} from '../components/Icons.jsx';

export default function Home() {
  const app = useApp();
  const { user, peers, peerById, activeMatches, requests, unreadNotifications } = app;
  const navigate = useNavigate();
  const toast = useToast();

  const ranked = rankedMatches(user, peers, 'all');
  const top = ranked[0];
  const activePeers = activeMatches.map((id) => peerById[id]).filter(Boolean);

  return (
    <div className="screen fade-in">
      <div className="head-row page-head">
        <div>
          <span className="eyebrow">Welcome back,</span>
          <h1>{user.name}</h1>
        </div>
        <button className="icon-btn" onClick={() => navigate('/notifications')} aria-label="Notifications">
          <IconBell size={20} />
          {unreadNotifications > 0 && <span className="badge">{unreadNotifications}</span>}
        </button>
      </div>

      {top && (
        <Link to={`/matches/${top.peer.id}`} className="card pad-lg" style={{ display: 'block', background: 'linear-gradient(135deg, var(--brand), var(--pink))', color: '#fff', border: 'none' }}>
          <div className="between">
            <span className="tiny" style={{ fontWeight: 800, opacity: 0.9, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <IconSparkle size={15} /> TOP MATCH FOR YOU
            </span>
            <span className="tiny" style={{ fontWeight: 800 }}>{top.score}%</span>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <Avatar person={top.peer} size="lg" />
            <div className="grow">
              <div style={{ fontWeight: 800, fontSize: 17 }}>{top.peer.name}</div>
              <div className="tiny" style={{ opacity: 0.9 }}>
                Can teach you {top.teaches[0] || top.peer.offeredSkills[0]}
              </div>
            </div>
            <IconArrowRight size={20} />
          </div>
        </Link>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Active swaps</h2>
          <Link to="/matches" className="link-btn">Find more</Link>
        </div>
        {activePeers.length === 0 ? (
          <div className="card muted tiny">No active swaps yet — send a connect request to get started.</div>
        ) : (
          <div className="hscroll">
            {activePeers.map((p) => (
              <Link to={`/chat/${p.id}`} key={p.id} className="card" style={{ display: 'block' }}>
                <div className="row">
                  <Avatar person={p} />
                  <div className="grow">
                    <div style={{ fontWeight: 800 }}>{p.name.split(' ')[0]} {p.name.split(' ')[1]?.[0]}.</div>
                    <div className="tiny muted">{p.offeredSkills[0]}</div>
                  </div>
                </div>
                <button className="btn sm secondary block" style={{ marginTop: 12 }}>
                  <IconChat size={15} /> Message
                </button>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Pending requests</h2>
          {requests.length > 0 && <Link to="/matches" className="link-btn">See all ({requests.length})</Link>}
        </div>
        {requests.length === 0 ? (
          <div className="card muted tiny">You're all caught up. 🙌</div>
        ) : (
          <div className="stack">
            {requests.map((r) => {
              const p = peerById[r.peerId];
              if (!p) return null;
              return (
                <div className="card" key={r.id}>
                  <div className="row">
                    <Avatar person={p} />
                    <div className="grow" style={{ cursor: 'pointer' }} onClick={() => navigate(`/u/${p.id}`)}>
                      <div style={{ fontWeight: 800 }}>{p.name}</div>
                      <div className="tiny muted">Needs help with {r.need}</div>
                    </div>
                  </div>
                  <p className="tiny muted" style={{ margin: '10px 2px 12px' }}>“{r.note}”</p>
                  <div className="row" style={{ gap: 8 }}>
                    <button
                      className="btn sm block"
                      onClick={() => { app.acceptRequest(r.id); toast(`You're now swapping with ${p.name.split(' ')[0]}`); }}
                    >
                      <IconCheck size={15} /> Accept
                    </button>
                    <button
                      className="btn sm secondary"
                      onClick={() => { app.declineRequest(r.id); toast('Request dismissed'); }}
                      aria-label="Decline"
                    >
                      <IconX size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Browse by category</h2>
        </div>
        <div className="grid-2">
          {SKILL_CATEGORIES.map((c) => (
            <button key={c.id} className="category-tile" onClick={() => navigate(`/category/${c.id}`)}>
              <span className="emoji" style={{ background: `${c.tint}1f` }}>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
