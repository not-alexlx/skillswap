import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import {
  IconEdit, IconClock, IconArrowRight, IconLogOut, IconCompass, IconCoin,
} from '../components/Icons.jsx';

export default function Profile() {
  const app = useApp();
  const { user, peers, credits } = app;
  const navigate = useNavigate();

  const friends = peers.filter((p) => p.friendState === 'friends');
  const stats = user.stats || { helped: 0, sessions: 0, rating: 5.0, tutored: 0 };

  return (
    <div className="screen fade-in">
      <div className="head-row page-head">
        <div className="row">
          <Avatar person={user} size="xl" />
          <div className="grow">
            <h1 style={{ fontSize: 22 }}>{user.name}</h1>
            {user.headline && <p className="tiny" style={{ fontWeight: 600 }}>{user.headline}</p>}
            <p className="tiny muted">{user.school} · {user.grade} Grade</p>
            <button className="btn sm secondary" style={{ marginTop: 8 }} onClick={() => navigate('/profile/edit')}>
              <IconEdit size={14} /> Edit profile
            </button>
          </div>
        </div>
        {user.bio && <p className="tiny muted" style={{ marginTop: 14, lineHeight: 1.55 }}>{user.bio}</p>}
      </div>

      <button
        className="wallet-card"
        onClick={() => navigate('/credits')}
        style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'block' }}
      >
        <span className="cap">Credit balance</span>
        <div className="bal">{credits} <IconCoin size={26} style={{ verticalAlign: '-3px' }} /></div>
        <div className="sub">Tutor to earn · spend to get tutored · tap to manage</div>
      </button>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginTop: 14 }}>
        <div className="stat-card"><b>{stats.tutored ?? stats.helped}</b><span>People tutored</span></div>
        <div className="stat-card"><b>{stats.sessions}</b><span>Swaps done</span></div>
        <div className="stat-card"><b>{stats.rating.toFixed(1)}</b><span>Peer rating</span></div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Skills I offer</h2>
          <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={() => navigate('/profile/edit')} aria-label="Edit offered skills">
            <IconEdit size={15} />
          </button>
        </div>
        <div className="wrap">
          {user.offeredSkills.map((s) => <span className="tag" key={s}>{s}</span>)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>I need help with</h2>
          <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={() => navigate('/profile/edit')} aria-label="Edit needed skills">
            <IconEdit size={15} />
          </button>
        </div>
        <div className="wrap">
          {user.neededSkills.map((s) => <span className="tag outline" key={s}>{s}</span>)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Upcoming swaps</h2></div>
        <div className="card">
          <div className="row">
            <span className="emoji" style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--brand-050)', color: 'var(--brand-600)' }}>
              <IconClock size={18} />
            </span>
            <div className="grow tiny">
              <b style={{ fontSize: 14 }}>Chemistry swap with Maya</b>
              <div className="muted">Today at 4:00 PM · Lincoln High library</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Friends</h2>
          <button className="link-btn" onClick={() => navigate('/friends')}>See all</button>
        </div>
        <div className="card" onClick={() => navigate('/friends')} style={{ cursor: 'pointer' }}>
          <div className="between">
            <div className="row" style={{ gap: 0 }}>
              {friends.slice(0, 5).map((f, i) => (
                <div key={f.id} style={{ marginLeft: i === 0 ? 0 : -12 }}>
                  <Avatar person={f} size="sm" ring />
                </div>
              ))}
            </div>
            <div className="row" style={{ color: 'var(--brand)', fontWeight: 700, fontSize: 13, gap: 4 }}>
              {friends.length} friends <IconArrowRight size={15} />
            </div>
          </div>
        </div>
      </section>

      <button className="btn block secondary" style={{ marginTop: 26 }} onClick={() => navigate('/discover')}>
        <IconCompass size={16} /> Discover new tutors
      </button>
      <button
        className="btn block ghost"
        style={{ marginTop: 10, color: 'var(--danger)' }}
        onClick={() => { if (confirm('Sign out and reset this demo?')) app.signOut(); }}
      >
        <IconLogOut size={16} /> Sign out
      </button>
    </div>
  );
}
