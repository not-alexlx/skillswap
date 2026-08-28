import { Link, useNavigate } from 'react-router-dom';

const STEPS = [
  { n: 1, title: 'List what you know', body: 'Add the subjects, tech, or hobbies you can actually help a classmate with.' },
  { n: 2, title: 'Get matched, not judged', body: 'We connect you with peers who can teach what you want to learn — and want what you know.' },
  { n: 3, title: 'Swap, message, or call', body: 'Chat, hop on a call, and friend the people who make studying less painful.' },
];

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="screen no-nav">
      <div className="welcome fade-in">
        <div className="brand-mark">S</div>
        <h1>SkillSwap</h1>
        <p className="sub">Trade what you know for what you want to learn.</p>

        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <div className="num">{s.n}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="spacer" />

        <button className="btn block lg" onClick={() => navigate('/signup')}>
          Get started
        </button>
        <p className="muted" style={{ marginTop: 14 }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: 'var(--brand)', fontWeight: 700 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
