import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { timeAgo } from '../utils/matching.js';
import {
  IconChevronLeft, IconUserPlus, IconSparkle, IconChat, IconStar, IconCalendar,
} from '../components/Icons.jsx';

const ICON = {
  request: IconUserPlus,
  match: IconSparkle,
  message: IconChat,
  friend: IconUserPlus,
  session: IconStar,
  default: IconCalendar,
};

export default function Notifications() {
  const navigate = useNavigate();
  const app = useApp();
  const { notifications, peerById } = app;

  useEffect(() => {
    const t = setTimeout(() => app.markAllNotificationsRead(), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (n) => {
    if (n.type === 'message') navigate(`/chat/${n.peerId}`);
    else if (n.type === 'match') navigate(`/matches/${n.peerId}`);
    else if (n.type === 'friend') navigate('/friends');
    else navigate(`/u/${n.peerId}`);
  };

  return (
    <div className="screen fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}><IconChevronLeft size={18} /> Back</button>
      <div className="page-head" style={{ marginTop: 12 }}><h1>Notifications</h1></div>

      <div>
        {notifications.length === 0 && (
          <div className="empty"><div className="big">🔔</div><h3>Nothing new</h3></div>
        )}
        {notifications.map((n) => {
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
    </div>
  );
}
