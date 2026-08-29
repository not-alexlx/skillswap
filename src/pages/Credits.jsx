import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import { SESSION_COST } from '../data/mockData.js';
import { timeAgo } from '../utils/matching.js';
import {
  IconChevronLeft, IconCoin, IconArrowRight, IconStar,
} from '../components/Icons.jsx';

export default function Credits() {
  const app = useApp();
  const { user, peers, peerById, ledger, credits, activeMatches } = app;
  const navigate = useNavigate();
  const toast = useToast();

  const earned = ledger.filter((l) => l.kind === 'earn').reduce((n, l) => n + l.amount, 0);
  const spent = ledger.filter((l) => l.kind === 'spend').reduce((n, l) => n + l.amount, 0);

  // People you're connected with and could log a completed tutoring session for.
  const tutees = activeMatches.map((pid) => peerById[pid]).filter(Boolean);

  const logSession = (peer) => {
    app.logTutoringSession(peer.id);
    toast(`+${SESSION_COST} credits for tutoring ${peer.name.split(' ')[0]}`);
  };

  return (
    <div className="screen fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Back</button>
      <div className="page-head" style={{ marginTop: 12 }}>
        <h1>Credits</h1>
      </div>

      <div className="wallet-card">
        <span className="cap">Your balance</span>
        <div className="bal">{credits} <IconCoin size={28} style={{ verticalAlign: '-3px' }} /></div>
        <div className="sub">Earned {earned} · Spent {spent} all-time</div>
      </div>

      <div className="card flat" style={{ background: 'var(--surface-2)', marginTop: 14 }}>
        <p className="tiny" style={{ lineHeight: 1.55 }}>
          <b>How credits work.</b> Every time you tutor someone you earn <b>{SESSION_COST} credits</b>.
          Spend those credits to book sessions with other tutors — {SESSION_COST}–4 credits each,
          depending on the tutor. It keeps the swap fair: teach to learn.
        </p>
      </div>

      <section className="section">
        <div className="section-head"><h2 style={{ fontSize: 18 }}>Log a session you tutored</h2></div>
        {tutees.length === 0 ? (
          <div className="card muted tiny">Connect with someone first, then log the sessions you tutor to earn credits.</div>
        ) : (
          <div className="stack">
            {tutees.map((p) => (
              <div className="list-row" key={p.id} style={{ borderBottom: 'none' }}>
                <Avatar person={p} size="lg" />
                <div className="grow">
                  <div className="name">{p.name}</div>
                  <div className="preview">Needs {p.neededSkills[0] || 'help'}</div>
                </div>
                <button className="btn sm mint" onClick={() => logSession(p)}>
                  <IconCoin size={14} /> +{SESSION_COST}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2 style={{ fontSize: 18 }}>Activity</h2>
          <button className="link-btn" onClick={() => navigate('/discover')}>Find a tutor <IconArrowRight size={13} /></button>
        </div>
        <div className="card flat">
          {ledger.length === 0 && <p className="tiny muted">No transactions yet.</p>}
          {ledger.map((l) => {
            const p = l.peerId ? peerById[l.peerId] : null;
            return (
              <div className="ledger-row" key={l.id}>
                <span className={`ico ${l.kind}`}>
                  {l.kind === 'earn' ? <IconStar size={16} /> : <IconCoin size={16} />}
                </span>
                <div className="grow">
                  <div className="tiny" style={{ fontWeight: 700 }}>{l.reason}</div>
                  <div className="tiny muted">{timeAgo(l.ts)}{p ? ` · ${p.name.split(' ')[0]}` : ''}</div>
                </div>
                <span className={`amt ${l.kind}`}>{l.kind === 'earn' ? '+' : '−'}{l.amount}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
