import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { clockTime } from '../utils/matching.js';
import {
  IconChevronLeft, IconPhone, IconVideo, IconSend,
} from '../components/Icons.jsx';

function dayLabel(ts) {
  const d = new Date(ts);
  const today = new Date();
  const y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function ChatThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = useApp();
  const { conversations, peerById } = app;
  const peer = peerById[id];
  const convo = conversations.find((c) => c.peerId === id);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    app.startConversation(id);
    app.markConversationRead(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [convo?.messages.length]);

  if (!peer) {
    return (
      <div className="screen no-nav">
        <button className="back-btn" onClick={() => navigate('/chat')}><IconChevronLeft size={18} /> Chats</button>
        <div className="empty"><h3>Conversation not found</h3></div>
      </div>
    );
  }

  const messages = convo?.messages || [];

  const send = () => {
    if (!draft.trim()) return;
    app.sendMessage(id, draft);
    setDraft('');
    if (taRef.current) taRef.current.style.height = 'auto';
  };

  const grow = (e) => {
    setDraft(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="thread">
      <div className="thread-head">
        <button className="back-btn" style={{ padding: 4 }} onClick={() => navigate('/chat')} aria-label="Back">
          <IconChevronLeft size={20} />
        </button>
        <Avatar person={peer} size="sm" />
        <div className="grow" onClick={() => navigate(`/u/${peer.id}`)} style={{ cursor: 'pointer' }}>
          <div style={{ fontWeight: 800, fontSize: 15.5 }}>{peer.name}</div>
          <div className="tiny" style={{ color: 'var(--ok)', fontWeight: 700 }}>● Active now</div>
        </div>
        <button className="icon-btn" onClick={() => navigate(`/call/${peer.id}?mode=audio`)} aria-label="Voice call">
          <IconPhone size={18} />
        </button>
        <button className="icon-btn" onClick={() => navigate(`/call/${peer.id}?mode=video`)} aria-label="Video call">
          <IconVideo size={18} />
        </button>
      </div>

      <div className="thread-scroll" ref={scrollRef}>
        <div className="card flat center" style={{ background: 'var(--surface-2)', margin: '0 auto 8px', maxWidth: 300 }}>
          <p className="tiny muted">
            You're swapping with <b>{peer.name.split(' ')[0]}</b>. Keep it school-appropriate and kind. 💛
          </p>
        </div>
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showDay = !prev || dayLabel(prev.ts) !== dayLabel(m.ts);
          const mine = m.from === 'me';
          const lastOfRun = i === messages.length - 1 || messages[i + 1].from !== m.from;
          return (
            <div key={m.id} style={{ display: 'contents' }}>
              {showDay && <div className="day-sep">{dayLabel(m.ts)}</div>}
              <div className={`bubble ${mine ? 'me' : 'them'}`}>{m.text}</div>
              {lastOfRun && <div className={`bubble-time ${mine ? 'me' : ''}`}>{clockTime(m.ts)}</div>}
            </div>
          );
        })}
      </div>

      <div className="composer">
        <textarea
          ref={taRef}
          rows={1}
          placeholder={`Message ${peer.name.split(' ')[0]}…`}
          value={draft}
          onChange={grow}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
        />
        <button className="send-btn" onClick={send} disabled={!draft.trim()} aria-label="Send">
          <IconSend size={19} />
        </button>
      </div>
    </div>
  );
}
