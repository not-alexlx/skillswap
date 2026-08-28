import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Avatar from '../components/Avatar.jsx';
import {
  IconChevronLeft, IconCheck, IconX, IconChat, IconUserPlus,
} from '../components/Icons.jsx';

export default function Friends() {
  const navigate = useNavigate();
  const toast = useToast();
  const app = useApp();
  const { peers } = app;

  const incoming = peers.filter((p) => p.friendState === 'incoming');
  const friends = peers.filter((p) => p.friendState === 'friends');
  const suggestions = peers.filter((p) => p.friendState === 'none' || p.friendState === 'requested');

  return (
    <div className="screen fade-in">
      <button className="back-btn" onClick={() => navigate('/profile')}><IconChevronLeft size={18} /> Profile</button>
      <div className="page-head" style={{ marginTop: 12 }}>
        <span className="eyebrow">Your study circle</span>
        <h1>Friends</h1>
      </div>

      {incoming.length > 0 && (
        <section className="section" style={{ marginTop: 8 }}>
          <div className="section-head"><h2>Requests</h2></div>
          <div className="stack">
            {incoming.map((p) => (
              <div className="card" key={p.id}>
                <div className="row">
                  <Avatar person={p} onClick={() => navigate(`/u/${p.id}`)} />
                  <div className="grow" style={{ cursor: 'pointer' }} onClick={() => navigate(`/u/${p.id}`)}>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div className="tiny muted">{p.mutualFriends} mutual · {p.grade}</div>
                  </div>
                </div>
                <div className="row" style={{ gap: 8, marginTop: 12 }}>
                  <button className="btn sm block" onClick={() => { app.setFriendState(p.id, 'friends'); toast(`You and ${p.name.split(' ')[0]} are friends`); }}>
                    <IconCheck size={15} /> Confirm
                  </button>
                  <button className="btn sm secondary" onClick={() => { app.setFriendState(p.id, 'none'); toast('Request removed'); }} aria-label="Delete">
                    <IconX size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head"><h2>{friends.length} friends</h2></div>
        <div className="stack">
          {friends.map((p) => (
            <div className="list-row" key={p.id}>
              <Avatar person={p} size="lg" onClick={() => navigate(`/u/${p.id}`)} />
              <div className="grow" onClick={() => navigate(`/u/${p.id}`)}>
                <div className="name">{p.name}</div>
                <div className="preview">{p.offeredSkills.slice(0, 2).join(' · ')}</div>
              </div>
              <button className="icon-btn" style={{ width: 38, height: 38 }} onClick={() => navigate(`/chat/${p.id}`)} aria-label="Message">
                <IconChat size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>People you may know</h2></div>
        <div className="stack">
          {suggestions.map((p) => (
            <div className="list-row" key={p.id}>
              <Avatar person={p} size="lg" onClick={() => navigate(`/u/${p.id}`)} />
              <div className="grow" onClick={() => navigate(`/u/${p.id}`)}>
                <div className="name">{p.name}</div>
                <div className="preview">{p.mutualFriends} mutual friends</div>
              </div>
              <button
                className="btn sm secondary"
                disabled={p.friendState === 'requested'}
                onClick={() => { app.setFriendState(p.id, 'requested'); toast('Friend request sent'); }}
              >
                <IconUserPlus size={14} /> {p.friendState === 'requested' ? 'Sent' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
