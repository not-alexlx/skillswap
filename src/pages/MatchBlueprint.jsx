import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import {
  matchScore, theyCanTeach, youCanTeach, sharedAvailability,
} from '../utils/matching.js';
import {
  IconChevronLeft, IconStar, IconChat, IconUserPlus, IconCheck, IconClock,
} from '../components/Icons.jsx';

export default function MatchBlueprint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const app = useApp();
  const { user, peerById, activeMatches } = app;
  const peer = peerById[id];

  if (!peer) {
    return (
      <div className="screen no-nav">
        <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Back</button>
        <div className="empty"><h3>Match not found</h3></div>
      </div>
    );
  }

  const score = matchScore(user, peer);
  const teaches = theyCanTeach(user, peer);
  const learns = youCanTeach(user, peer);
  const avail = sharedAvailability(user, peer);
  const isActive = activeMatches.includes(peer.id);
  const isFriend = peer.friendState === 'friends';

  const connect = () => {
    app.sendConnectRequest(peer.id);
    toast(`Connect request sent to ${peer.name.split(' ')[0]}`);
    navigate(`/chat/${peer.id}`);
  };

  return (
    <div className="screen fade-in">
      <div className="between" style={{ marginBottom: 14 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IconChevronLeft size={18} /> Match blueprint
        </button>
      </div>

      <div className="card pad-lg center">
        <Avatar person={peer} size="xl" className="fade-in" />
        <h2 style={{ fontSize: 24, marginTop: 12 }}>{peer.name}</h2>
        <p className="muted" style={{ marginTop: 4 }}>{peer.school} · {peer.grade} Grade</p>
        <div className="pill-score" style={{ marginTop: 12, fontSize: 14, padding: '8px 14px' }}>
          <IconStar size={14} /> {score}% match score
        </div>
        {peer.bio && <p className="tiny muted" style={{ marginTop: 14, lineHeight: 1.5 }}>{peer.bio}</p>}
        <button className="link-btn" style={{ marginTop: 6 }} onClick={() => navigate(`/u/${peer.id}`)}>
          View full profile
        </button>
      </div>

      <div className="card flat" style={{ background: 'var(--surface-2)', marginTop: 14 }}>
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>They can teach you</h3>
        <div className="wrap">
          {(teaches.length ? teaches : peer.offeredSkills).map((s) => (
            <span className={`tag ${teaches.includes(s) ? 'brand' : 'soft'}`} key={s}>{s}</span>
          ))}
        </div>
      </div>

      <div className="card flat" style={{ background: 'var(--surface-2)', marginTop: 12 }}>
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>You can teach them</h3>
        <div className="wrap">
          {(learns.length ? learns : peer.neededSkills).map((s) => (
            <span className={`tag ${learns.includes(s) ? 'outline' : 'soft'}`} key={s}>{s}</span>
          ))}
          {learns.length === 0 && peer.neededSkills.length === 0 && (
            <span className="tiny muted">No overlap yet — you can still mentor one-way.</span>
          )}
        </div>
      </div>

      <section className="section">
        <div className="section-head"><h2 style={{ fontSize: 17 }}>Availability</h2></div>
        <div className="wrap">
          {(avail.length ? avail : peer.availability).map((a) => (
            <span className="tag soft" key={a}><IconClock size={13} /> {a}</span>
          ))}
        </div>
        {avail.length > 0 && (
          <p className="tiny" style={{ color: 'var(--ok)', fontWeight: 700, marginTop: 10 }}>
            <IconCheck size={13} /> You share {avail.length} free time{avail.length > 1 ? 's' : ''}.
          </p>
        )}
      </section>

      <div className="stack" style={{ marginTop: 22 }}>
        <button className="btn block lg" onClick={isActive ? () => navigate(`/chat/${peer.id}`) : connect}>
          {isActive ? <><IconChat size={17} /> Open chat</> : 'Send connect request'}
        </button>
        {!isFriend && (
          <button
            className="btn block secondary"
            onClick={() => { app.setFriendState(peer.id, 'requested'); toast('Friend request sent'); }}
            disabled={peer.friendState === 'requested'}
          >
            <IconUserPlus size={16} /> {peer.friendState === 'requested' ? 'Friend request sent' : 'Add friend'}
          </button>
        )}
      </div>
    </div>
  );
}
