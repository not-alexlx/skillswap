import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import { matchScore, theyCanTeach, youCanTeach } from '../utils/matching.js';
import {
  IconChevronLeft, IconChat, IconUserPlus, IconStar, IconCheck, IconSparkle,
} from '../components/Icons.jsx';

const FRIEND_CTA = {
  none: { label: 'Add friend', next: 'requested', toast: 'Friend request sent' },
  requested: { label: 'Request sent', next: 'requested', toast: '' },
  incoming: { label: 'Accept friend request', next: 'friends', toast: 'You are now friends' },
  friends: { label: 'Friends', next: 'friends', toast: '' },
};

export default function PeerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const app = useApp();
  const { user, peerById } = app;
  const peer = peerById[id];

  if (!peer) {
    return (
      <div className="screen fade-in">
        <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Back</button>
        <div className="empty"><h3>Student not found</h3></div>
      </div>
    );
  }

  const score = matchScore(user, peer);
  const teaches = theyCanTeach(user, peer);
  const learns = youCanTeach(user, peer);
  const cta = FRIEND_CTA[peer.friendState] || FRIEND_CTA.none;

  const onFriend = () => {
    if (peer.friendState === 'requested' || peer.friendState === 'friends') return;
    app.setFriendState(peer.id, cta.next);
    if (cta.toast) toast(cta.toast);
  };

  return (
    <div className="screen fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Back</button>

      <div className="center" style={{ marginTop: 10 }}>
        <Avatar person={peer} size="xl" />
        <h1 style={{ fontSize: 24, marginTop: 12 }}>{peer.name}</h1>
        <p className="muted" style={{ marginTop: 4 }}>{peer.school} · {peer.grade} Grade</p>
        <div className="wrap" style={{ justifyContent: 'center', marginTop: 10 }}>
          <span className="pill-score"><IconSparkle size={12} /> {score}% match</span>
          {peer.mutualFriends > 0 && <span className="tag soft">{peer.mutualFriends} mutual friends</span>}
        </div>
        {peer.bio && <p className="tiny muted" style={{ marginTop: 14, lineHeight: 1.55 }}>{peer.bio}</p>}
      </div>

      <div className="grid-2" style={{ marginTop: 18 }}>
        <div className="stat-card"><b>⭐ {peer.rating}</b><span>Peer rating</span></div>
        <div className="stat-card"><b>{peer.sessions}</b><span>Swaps completed</span></div>
      </div>

      <section className="section">
        <div className="section-head"><h2 style={{ fontSize: 17 }}>Offers to teach</h2></div>
        <div className="wrap">
          {peer.offeredSkills.map((s) => (
            <span className={`tag ${teaches.includes(s) ? 'brand' : 'soft'}`} key={s}>
              {teaches.includes(s) && <IconStar size={12} />} {s}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2 style={{ fontSize: 17 }}>Wants to learn</h2></div>
        <div className="wrap">
          {peer.neededSkills.map((s) => (
            <span className={`tag ${learns.includes(s) ? 'outline' : 'soft'}`} key={s}>{s}</span>
          ))}
        </div>
      </section>

      <div className="stack" style={{ marginTop: 24 }}>
        <button className="btn block lg" onClick={() => { app.startConversation(peer.id); navigate(`/chat/${peer.id}`); }}>
          <IconChat size={17} /> Message
        </button>
        <div className="row" style={{ gap: 10 }}>
          <button
            className="btn block secondary"
            onClick={onFriend}
            disabled={peer.friendState === 'requested' || peer.friendState === 'friends'}
          >
            {peer.friendState === 'friends' || peer.friendState === 'requested'
              ? <IconCheck size={16} /> : <IconUserPlus size={16} />} {cta.label}
          </button>
          <button className="btn secondary" onClick={() => navigate(`/matches/${peer.id}`)}>
            Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
