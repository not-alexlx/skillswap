import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import Post from '../components/Post.jsx';
import { recommendedTutors } from '../utils/matching.js';
import {
  IconBell, IconCoin, IconSparkle, IconArrowRight, IconStar,
} from '../components/Icons.jsx';

export default function Home() {
  const app = useApp();
  const { user, peers, peerById, activeMatches, passedTutors, feed, credits, unreadNotifications, actionableCount } = app;
  const navigate = useNavigate();
  const toast = useToast();
  const [draft, setDraft] = useState('');

  const recs = recommendedTutors(user, peers, {
    exclude: [...activeMatches, ...passedTutors],
    limit: 5,
  });
  const spotlights = [
    ...activeMatches.map((id) => peerById[id]).filter(Boolean),
    ...recs.map((r) => r.peer),
  ].slice(0, 8);

  const share = () => {
    if (!draft.trim()) return;
    app.addPost(draft);
    setDraft('');
    toast('Posted to your feed');
  };

  return (
    <div className="screen fade-in">
      <div className="head-row page-head">
        <div>
          <span className="eyebrow">SkillSwap</span>
          <h1 style={{ fontSize: 26 }}>Feed</h1>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="credit-pill" onClick={() => navigate('/credits')} aria-label="Your credits">
            <IconCoin size={16} /> {credits}
          </button>
          <button className="icon-btn" onClick={() => navigate('/notifications')} aria-label="Notifications">
            <IconBell size={20} />
            {(unreadNotifications > 0 || actionableCount > 0) && (
              <span className="badge">{Math.max(unreadNotifications, actionableCount)}</span>
            )}
          </button>
        </div>
      </div>

      {/* Stories: your swaps + auto-recommended tutors */}
      <div className="story-row">
        {spotlights.map((p, i) => (
          <button className="story" key={p.id} onClick={() => navigate(`/u/${p.id}`)}>
            <span className={`rim ${i >= activeMatches.length ? 'seen' : ''}`}>
              <Avatar person={p} size="lg" />
            </span>
            <span>{p.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="post-composer">
        <Avatar person={user} size="sm" />
        <textarea
          rows={1}
          placeholder="Share a win, a cheat sheet, or ask for help…"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
        />
        <button className="btn sm" onClick={share} disabled={!draft.trim()}>Post</button>
      </div>

      {/* Auto-recommendations */}
      <section className="section" style={{ marginTop: 4 }}>
        <div className="section-head">
          <h2 style={{ fontSize: 18 }}><IconSparkle size={16} style={{ verticalAlign: '-2px' }} /> Recommended for you</h2>
          <Link to="/discover" className="link-btn">Browse</Link>
        </div>
        <div className="hscroll">
          {recs.map(({ peer, score, reasons }) => (
            <div className="card" key={peer.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="row">
                <Avatar person={peer} onClick={() => navigate(`/u/${peer.id}`)} />
                <div className="grow">
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>{peer.name.split(' ')[0]} {peer.name.split(' ')[1]?.[0]}.</div>
                  <div className="tiny" style={{ color: 'var(--ink-2)', fontWeight: 700 }}>
                    <span className="star-badge"><IconStar size={11} /> {peer.rating}</span> · {peer.tutored} tutored
                  </div>
                </div>
              </div>
              <div className="wrap">
                {reasons.slice(0, 2).map((r) => <span className="reason-chip" key={r}>{r}</span>)}
              </div>
              <button className="btn sm block" onClick={() => navigate(`/matches/${peer.id}`)}>
                View · {score}% match <IconArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* The social feed */}
      <section className="section">
        <div className="section-head"><h2 style={{ fontSize: 18 }}>Latest from your circle</h2></div>
        {feed.map((post) => <Post key={post.id} post={post} />)}
      </section>
    </div>
  );
}
