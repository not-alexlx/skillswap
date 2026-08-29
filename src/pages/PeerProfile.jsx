import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import { matchScore, theyCanTeach, youCanTeach } from '../utils/matching.js';
import {
  IconChevronLeft, IconChat, IconUserPlus, IconStar, IconCheck, IconSparkle,
  IconCoin, IconThumbUp,
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
  const { user, peerById, credits, activeMatches } = app;
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
  const isActive = activeMatches.includes(peer.id);
  const endorsements = Object.entries(peer.endorsements || {}).sort((a, b) => b[1] - a[1]);

  const onFriend = () => {
    if (peer.friendState === 'requested' || peer.friendState === 'friends') return;
    app.setFriendState(peer.id, cta.next);
    if (cta.toast) toast(cta.toast);
  };

  const book = () => {
    if (credits < peer.rate) { toast(`Need ${peer.rate} credits`); navigate('/credits'); return; }
    app.bookSession(peer.id);
    toast(`Session booked · −${peer.rate} credits`);
    navigate(`/chat/${peer.id}`);
  };

  const endorse = (skill) => {
    app.endorse(peer.id, skill);
    toast(`Endorsed ${peer.name.split(' ')[0]} for ${skill}`);
  };

  return (
    <div className="screen fade-in">
      <div className="between">
        <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Back</button>
        <button className="credit-pill" onClick={() => navigate('/credits')}><IconCoin size={15} /> {credits}</button>
      </div>

      <div className="center" style={{ marginTop: 10 }}>
        <Avatar person={peer} size="xl" />
        <h1 style={{ fontSize: 24, marginTop: 12 }}>{peer.name}</h1>
        {peer.headline && <p className="tiny" style={{ marginTop: 4, fontWeight: 600 }}>{peer.headline}</p>}
        <p className="muted tiny" style={{ marginTop: 4 }}>{peer.school} · {peer.grade} Grade</p>
        <div className="wrap" style={{ justifyContent: 'center', marginTop: 10 }}>
          <span className="pill-score"><IconSparkle size={12} /> {score}% match</span>
          {peer.mutualFriends > 0 && <span className="tag soft">{peer.mutualFriends} mutual friends</span>}
          {peer.online && <span className="tag mint">● Online</span>}
        </div>
        {peer.bio && <p className="tiny muted" style={{ marginTop: 14, lineHeight: 1.55 }}>{peer.bio}</p>}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginTop: 18 }}>
        <div className="stat-card"><b>⭐ {peer.rating}</b><span>{peer.ratingCount} ratings</span></div>
        <div className="stat-card"><b>{peer.tutored}</b><span>People tutored</span></div>
        <div className="stat-card"><b>{peer.rate}</b><span>Credits / session</span></div>
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
        <div className="section-head"><h2 style={{ fontSize: 17 }}>Endorsements</h2></div>
        <div className="stack">
          {endorsements.length === 0 && <p className="tiny muted">No endorsements yet — be the first.</p>}
          {endorsements.map(([skill, count]) => (
            <div className="between" key={skill}>
              <div className="row" style={{ gap: 8 }}>
                <span className="tag soft">{skill}</span>
                <span className="tiny muted" style={{ fontWeight: 700 }}>{count}</span>
              </div>
              <button className="btn sm secondary" onClick={() => endorse(skill)}>
                <IconThumbUp size={13} /> Endorse
              </button>
            </div>
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
        {isActive ? (
          <button className="btn block lg" onClick={() => { app.startConversation(peer.id); navigate(`/chat/${peer.id}`); }}>
            <IconChat size={17} /> Message
          </button>
        ) : (
          <button className="btn block lg" onClick={book}>
            <IconCoin size={17} /> Book a session · {peer.rate} credits
          </button>
        )}
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
