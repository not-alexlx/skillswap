import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { IconChevronLeft } from '../components/Icons.jsx';

export default function SignIn() {
  const navigate = useNavigate();
  const { signInDemo } = useApp();

  const submit = (e) => {
    e.preventDefault();
    signInDemo();
    navigate('/home');
  };

  return (
    <div className="screen no-nav">
      <button className="back-btn" onClick={() => navigate('/')}>
        <IconChevronLeft size={18} /> Back
      </button>

      <div className="page-head" style={{ marginTop: 18 }}>
        <h1>Welcome back</h1>
        <p className="muted" style={{ marginTop: 6 }}>Sign in to pick up where you left off.</p>
      </div>

      <form onSubmit={submit}>
        <div className="field">
          <label>School email</label>
          <input className="input" type="email" placeholder="you@lincolnhigh.edu" defaultValue="alex.rivera@lincolnhigh.edu" />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" placeholder="••••••••" defaultValue="skillswap" />
        </div>
        <button className="btn block lg" type="submit" style={{ marginTop: 8 }}>
          Sign in
        </button>
      </form>

      <p className="muted center" style={{ marginTop: 18 }}>
        New here?{' '}
        <Link to="/signup" style={{ color: 'var(--brand)', fontWeight: 700 }}>
          Create your profile
        </Link>
      </p>
      <p className="tiny muted center" style={{ marginTop: 24 }}>
        Demo build — any credentials sign you in as Alex Rivera.
      </p>
    </div>
  );
}
