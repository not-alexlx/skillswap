import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { timeAgo } from '../utils/matching.js';
import { IconSearch, IconEdit } from '../components/Icons.jsx';

export default function ChatList() {
  const { conversations, peerById } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    return conversations
      .map((c) => {
        const peer = peerById[c.peerId];
        const last = c.messages[c.messages.length - 1];
        return peer && last ? { c, peer, last } : null;
      })
      .filter(Boolean)
      .filter(({ peer }) => peer.name.toLowerCase().includes(q.trim().toLowerCase()))
      .sort((a, b) => b.last.ts - a.last.ts);
  }, [conversations, peerById, q]);

  return (
    <div className="screen fade-in">
      <div className="head-row page-head">
        <h1>Chats</h1>
        <button className="icon-btn" onClick={() => navigate('/matches')} aria-label="New chat">
          <IconEdit size={19} />
        </button>
      </div>

      <div className="search">
        <IconSearch size={18} />
        <input placeholder="Search chats…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div style={{ marginTop: 8 }}>
        {rows.length === 0 && (
          <div className="empty"><div className="big">💬</div><h3>No chats yet</h3><p className="tiny">Accept a request or connect with a match to start talking.</p></div>
        )}
        {rows.map(({ c, peer, last }) => (
          <div className="list-row" key={c.id} onClick={() => navigate(`/chat/${peer.id}`)}>
            <Avatar person={peer} size="lg" />
            <div className="grow">
              <div className="between">
                <span className="name">{peer.name}</span>
                <span className="meta">{timeAgo(last.ts)}</span>
              </div>
              <div className={`preview ${c.unread ? 'strong' : ''}`}>
                {last.from === 'me' ? 'You: ' : ''}{last.text}
              </div>
            </div>
            {c.unread > 0 && <span className="unread-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}
