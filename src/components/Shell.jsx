import { NavLink } from 'react-router-dom';
import {
  IconHome, IconCompass, IconBook, IconChat, IconProfile,
} from './Icons.jsx';
import { useApp } from '../context/AppContext.jsx';

export function StatusBar() {
  const time = new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '');
  return (
    <div className="status-bar">
      <span>{time}</span>
      <span className="dots">
        <span>●●●</span>
        <span>ᯤ</span>
        <span>▮</span>
      </span>
    </div>
  );
}

export function Frame({ children }) {
  return (
    <div className="app-bg">
      <div className="shell">
        <StatusBar />
        {children}
      </div>
    </div>
  );
}

const TABS = [
  { to: '/home', label: 'Feed', Icon: IconHome },
  { to: '/discover', label: 'Discover', Icon: IconCompass },
  { to: '/learn', label: 'Learn', Icon: IconBook },
  { to: '/chat', label: 'Chat', Icon: IconChat, badgeKey: 'unreadChats' },
  { to: '/profile', label: 'Profile', Icon: IconProfile },
];

export function TabBar() {
  const app = useApp();
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, Icon, badgeKey }) => {
        const badge = badgeKey ? app[badgeKey] : 0;
        return (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="nav-ico"><Icon size={21} /></span>
            {label}
            {badge > 0 && <span className="badge">{badge}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}
