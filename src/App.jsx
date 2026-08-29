import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import { Frame, TabBar } from './components/Shell.jsx';
import { ToastProvider } from './components/Toast.jsx';

import Welcome from './pages/Welcome.jsx';
import SignIn from './pages/SignIn.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Discover from './pages/Discover.jsx';
import Learn from './pages/Learn.jsx';
import Matches from './pages/Matches.jsx';
import MatchBlueprint from './pages/MatchBlueprint.jsx';
import Category from './pages/Category.jsx';
import Credits from './pages/Credits.jsx';
import ChatList from './pages/ChatList.jsx';
import ChatThread from './pages/ChatThread.jsx';
import Call from './pages/Call.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import PeerProfile from './pages/PeerProfile.jsx';
import Friends from './pages/Friends.jsx';
import Notifications from './pages/Notifications.jsx';

const TAB_ROUTES = ['/home', '/discover', '/learn', '/matches', '/chat', '/profile', '/friends', '/category', '/credits', '/u/'];

export default function App() {
  const { onboarded } = useApp();
  const { pathname } = useLocation();

  const showTabs =
    onboarded &&
    TAB_ROUTES.some((r) => pathname === r || pathname.startsWith(r)) &&
    !pathname.startsWith('/chat/') &&
    !pathname.startsWith('/call/');

  return (
    <ToastProvider>
      <Frame>
        <Routes>
          <Route path="/" element={onboarded ? <Navigate to="/home" replace /> : <Welcome />} />
          <Route path="/signin" element={onboarded ? <Navigate to="/home" replace /> : <SignIn />} />
          <Route path="/signup" element={onboarded ? <Navigate to="/home" replace /> : <Signup />} />

          <Route path="/home" element={<Guard><Home /></Guard>} />
          <Route path="/discover" element={<Guard><Discover /></Guard>} />
          <Route path="/learn" element={<Guard><Learn /></Guard>} />
          <Route path="/matches" element={<Guard><Matches /></Guard>} />
          <Route path="/matches/:id" element={<Guard><MatchBlueprint /></Guard>} />
          <Route path="/category/:id" element={<Guard><Category /></Guard>} />
          <Route path="/credits" element={<Guard><Credits /></Guard>} />
          <Route path="/chat" element={<Guard><ChatList /></Guard>} />
          <Route path="/chat/:id" element={<Guard><ChatThread /></Guard>} />
          <Route path="/call/:id" element={<Guard><Call /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/profile/edit" element={<Guard><EditProfile /></Guard>} />
          <Route path="/u/:id" element={<Guard><PeerProfile /></Guard>} />
          <Route path="/friends" element={<Guard><Friends /></Guard>} />
          <Route path="/notifications" element={<Guard><Notifications /></Guard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {showTabs && <TabBar />}
      </Frame>
    </ToastProvider>
  );
}

function Guard({ children }) {
  const { onboarded } = useApp();
  if (!onboarded) return <Navigate to="/" replace />;
  return children;
}
