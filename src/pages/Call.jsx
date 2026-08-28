import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Avatar from '../components/Avatar.jsx';
import {
  IconMic, IconMicOff, IconVideo, IconPhone,
} from '../components/Icons.jsx';

export default function Call() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const video = params.get('mode') === 'video';
  const { peerById } = useApp();
  const peer = peerById[id];

  const [status, setStatus] = useState('Ringing…');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOn, setCamOn] = useState(video);
  const tick = useRef(null);

  useEffect(() => {
    if (!peer) { navigate(`/chat/${id}`, { replace: true }); return; }
    const connect = setTimeout(() => setStatus('connected'), 2200);
    return () => clearTimeout(connect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'connected') {
      tick.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(tick.current);
  }, [status]);

  const end = () => navigate(`/chat/${id}`, { replace: true });

  if (!peer) return null;

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="call">
      <div className="who">
        <h2>{peer.name}</h2>
        <p>{status === 'connected' ? `${video ? 'Video' : 'Voice'} call · ${mmss}` : status}</p>
      </div>

      <div className="big-avatar">
        <Avatar
          person={peer}
          size="xl"
          className={status !== 'connected' ? 'pulse' : ''}
        />
      </div>

      <div className="spacer" />

      <div className="call-controls">
        <button className={`call-btn ${muted ? 'on' : ''}`} onClick={() => setMuted((m) => !m)} aria-label="Mute">
          {muted ? <IconMicOff size={24} /> : <IconMic size={24} />}
        </button>
        {video && (
          <button className={`call-btn ${camOn ? 'on' : ''}`} onClick={() => setCamOn((c) => !c)} aria-label="Camera">
            <IconVideo size={24} />
          </button>
        )}
        <button className="call-btn end" onClick={end} aria-label="End call">
          <IconPhone size={26} style={{ transform: 'rotate(135deg)' }} />
        </button>
      </div>
      <p className="note">Calls are simulated in this demo build.</p>
    </div>
  );
}
