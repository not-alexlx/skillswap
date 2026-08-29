import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import { timeAgo } from '../utils/matching.js';
import {
  IconChevronLeft, IconUserPlus, IconSparkle, IconChat, IconStar,
  IconCalendar, IconCheck, IconX, IconThumbUp, IconBook,
} from '../components/Icons.jsx';

const ICON = {
  message: IconChat,
  endorsement: IconThumbUp,
  friend_accepted: IconUserPlus,
  session: IconStar,
  match: IconSparkle,
  tutor_match: IconBook,
  default: IconCalendar,
};

export default function Notifications() {
  const navigate = useNavigate();
  const toast = useToast();
  const app = useApp();
  const {
    notifications, peerById, requests, incomingFriendRequests, incomingMatchRequests,
  } = app;

  useEffect(() => {
    const t = setTimeout(() => app.markAllNotificationsRead(), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingMatchPeerIds = new Set(incomingMatchRequests.map((m) => m.peerId));
  const activity = notifications.filter(
    (n) => !(n.type === 'tutor_match' && pendingMatchPeerIds.has(n.peerId))
      && !['request', 'friend'].includes(n.type)
  );

  const go = (n) => {
    if (n.type === 'message') navigate(`/chat/${n.peerId}`);
    else if (n.type === 'match' || n.type === 'tutor_match') navigate(`/matches/${n.peerId}`);
    else if (n.type === 'friend_accepted') navigate('/friends');
    else navigate(`/u/${n.peerId}`);
  };

  const hasActionable = requests.length + incomingFriendRequests.length + incomingMatchRequests.length > 0;

  return (
    <div className="screen fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Back</button>
      <div className="page-head" style={{ marginTop: 12 }}><h1>Notifications</h1></div>

      {hasActionable && (
        <section className="section" style={{ marginTop: 0 }}>
          <div className="section-head"><h2 style={{ fontSize: 18 }}>Needs your response</h2></div>
          <div className="stack">
            {incomingMatchRequests.map((m) => {
              const p = peerById[m.peerId];
              if (!p) return null;
              return (
                <div className="mr-card" key={m.id}>
                  <div className="row">
                    <Avatar person={p} onClick={() => navigate(`/u/${p.id}`)} />
                    <div className="grow">
                      <div style={{ fontWeight: 800 }}>{p.name}</div>
                      <div className="tiny muted"><IconBook size={12} /> Mentor match · {m.skill}</div>
                    </div>
                  </div>
                  {m.note && <p className="tiny muted" style={{ margin: '10px 2px' }}>“{m.note}”</p>}
                  <div className="row" style={{ gap: 8, marginTop: 10 }}>
                    <button className="btn sm block" onClick={() => { app.acceptMatchRequest(m.id); toast(`Matched with ${p.name.split(' ')[0]}`); navigate(`/chat/${p.id}`); }}>
                      <IconCheck size={14} /> Accept match
                    </button>
                    <button className="btn sm secondary" onClick={() => { app.declineMatchRequest(m.id); toast('Match dismissed'); }} aria-label="Decline">
                      <IconX size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {requests.map((r) => {
              const p = peerById[r.peerId];
              if (!p) return null;
              return (
                <div className="mr-card" key={r.id}>
                  <div className="row">
                    <Avatar person={p} onClick={() => navigate(`/u/${p.id}`)} />
                    <div className="grow">
                      <div style={{ fontWeight: 800 }}>{p.name}</div>
                      <div className="tiny muted"><IconChat size={12} /> Connect request · needs {r.need}</div>
                    </div>
                  </div>
                  {r.note && <p className="tiny muted" style={{ margin: '10px 2px' }}>“{r.note}”</p>}
                  <div className="row" style={{ gap: 8, marginTop: 10 }}>
                    <button className="btn sm block" onClick={() => { app.acceptRequest(r.id); toast(`Swapping with ${p.name.split(' ')[0]}`); }}>
                      <IconCheck size={14} /> Accept
                    </button>
                    <button className="btn sm secondary" onClick={() => { app.declineRequest(r.id); toast('Request dismissed'); }} aria-label="Decline">
                      <IconX size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {incomingFriendRequests.map((p) => (
              <div className="mr-card" key={p.id}>
                <div className="row">
                  <Avatar person={p} onClick={() => navigate(`/u/${p.id}`)} />
                  <div className="grow">
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div className="tiny muted"><IconUserPlus size={12} /> Friend request · {p.mutualFriends} mutual</div>
                  </div>
                </div>
                <div className="row" style={{ gap: 8, marginTop: 10 }}>
                  <button className="btn sm block" onClick={() => { app.setFriendState(p.id, 'friends'); toast(`You and ${p.name.split(' ')[0]} are friends`); }}>
                    <IconCheck size={14} /> Confirm
                  </button>
                  <button className="btn sm secondary" onClick={() => { app.setFriendState(p.id, 'none'); toast('Request removed'); }} aria-label="Delete">
                    <IconX size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head"><h2 style={{ fontSize: 18 }}>Earlier</h2></div>
        <div>
          {activity.length === 0 && (
            <div className="empty"><div className="big">🔔</div><h3>Nothing else new</h3></div>
          )}
          {activity.map((n) => {
            const p = peerById[n.peerId];
            const Ico = ICON[n.type] || ICON.default;
            return (
              <div
                className="list-row"
                key={n.id}
                onClick={() => go(n)}
                style={{ background: n.read ? 'transparent' : 'var(--brand-050)', borderRadius: 12, paddingLeft: 8, paddingRight: 8 }}
              >
                <div style={{ position: 'relative' }}>
                  <Avatar person={p} size="lg" />
                  <span style={{ position: 'absolute', right: -2, bottom: -2, background: 'var(--surface)', borderRadius: '50%', padding: 3, color: 'var(--brand)' }}>
                    <Ico size={13} />
                  </span>
                </div>
                <div className="grow">
                  <div className="tiny"><b>{p?.name || 'Someone'}</b> <span className="muted">{n.text}</span></div>
                  <div className="tiny muted" style={{ marginTop: 2 }}>{timeAgo(n.ts)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
