import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_USER,
  PEERS,
  SEED_CONVERSATIONS,
  SEED_REQUESTS,
  SEED_ACTIVE_MATCHES,
  SEED_NOTIFICATIONS,
} from '../data/mockData.js';

const AppContext = createContext(null);
const STORAGE_KEY = 'skillswap.v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

function freshState() {
  return {
    onboarded: false,
    user: null,
    peers: PEERS,
    conversations: SEED_CONVERSATIONS,
    requests: SEED_REQUESTS,
    activeMatches: SEED_ACTIVE_MATCHES,
    notifications: SEED_NOTIFICATIONS,
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadState() || freshState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
  }, [state]);

  const update = (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));

  const actions = useMemo(
    () => ({
      /* ---- onboarding / auth ---- */
      completeSignup(profile) {
        update({
          onboarded: true,
          user: {
            ...DEFAULT_USER,
            ...profile,
            id: 'me',
            initials: initialsFrom(profile.name || DEFAULT_USER.name),
            stats: { helped: 0, sessions: 0, rating: 5.0 },
          },
        });
      },
      signInDemo() {
        update({ onboarded: true, user: { ...DEFAULT_USER } });
      },
      signOut() {
        localStorage.removeItem(STORAGE_KEY);
        setState(freshState());
      },
      updateProfile(patch) {
        update((s) => ({ user: { ...s.user, ...patch, initials: patch.name ? initialsFrom(patch.name) : s.user.initials } }));
      },

      /* ---- connect requests ---- */
      acceptRequest(reqId) {
        update((s) => {
          const req = s.requests.find((r) => r.id === reqId);
          if (!req) return {};
          const activeMatches = s.activeMatches.includes(req.peerId)
            ? s.activeMatches
            : [...s.activeMatches, req.peerId];
          return {
            requests: s.requests.filter((r) => r.id !== reqId),
            activeMatches,
            conversations: ensureConversation(s.conversations, req.peerId, {
              from: 'me',
              text: `Accepted your request! Happy to help with ${req.need}. When works for you?`,
            }),
          };
        });
      },
      declineRequest(reqId) {
        update((s) => ({ requests: s.requests.filter((r) => r.id !== reqId) }));
      },
      sendConnectRequest(peerId) {
        update((s) => {
          if (s.activeMatches.includes(peerId)) return {};
          return {
            activeMatches: [...s.activeMatches, peerId],
            conversations: ensureConversation(s.conversations, peerId, {
              from: 'me',
              text: 'Hey! Sent you a connect request on SkillSwap — want to set up a swap?',
            }),
          };
        });
      },

      /* ---- friends ---- */
      setFriendState(peerId, friendState) {
        update((s) => ({
          peers: s.peers.map((p) => (p.id === peerId ? { ...p, friendState } : p)),
        }));
      },

      /* ---- messaging ---- */
      sendMessage(peerId, text) {
        const clean = text.trim();
        if (!clean) return;
        update((s) => ({
          conversations: ensureConversation(s.conversations, peerId, { from: 'me', text: clean }),
        }));
        // Simulate a reply so the demo feels two-way.
        setTimeout(() => {
          update((s) => ({
            conversations: s.conversations.map((c) =>
              c.peerId === peerId
                ? {
                    ...c,
                    unread: c.unread + 1,
                    messages: [
                      ...c.messages,
                      { id: rid(), from: peerId, text: autoReply(clean), ts: Date.now() },
                    ],
                  }
                : c
            ),
          }));
        }, 1400);
      },
      markConversationRead(peerId) {
        update((s) => ({
          conversations: s.conversations.map((c) => (c.peerId === peerId ? { ...c, unread: 0 } : c)),
        }));
      },
      startConversation(peerId) {
        update((s) => ({ conversations: ensureConversation(s.conversations, peerId) }));
      },

      /* ---- notifications ---- */
      markAllNotificationsRead() {
        update((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
      },

      resetDemo() {
        localStorage.removeItem(STORAGE_KEY);
        setState(freshState());
      },
    }),
    []
  );

  const derived = useMemo(() => {
    const peerById = Object.fromEntries(state.peers.map((p) => [p.id, p]));
    const unreadChats = state.conversations.reduce((n, c) => n + (c.unread > 0 ? 1 : 0), 0);
    const unreadNotifications = state.notifications.filter((n) => !n.read).length;
    return { peerById, unreadChats, unreadNotifications };
  }, [state]);

  return <AppContext.Provider value={{ ...state, ...derived, ...actions }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

/* ---------- helpers ---------- */

function initialsFrom(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'ME';
}

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

function ensureConversation(conversations, peerId, message) {
  const exists = conversations.find((c) => c.peerId === peerId);
  if (!exists) {
    return [
      {
        id: `c-${peerId}`,
        peerId,
        unread: 0,
        messages: message ? [{ id: rid(), ts: Date.now(), ...message }] : [],
      },
      ...conversations,
    ];
  }
  if (!message) return conversations;
  return conversations.map((c) =>
    c.peerId === peerId
      ? { ...c, messages: [...c.messages, { id: rid(), ts: Date.now(), ...message }] }
      : c
  );
}

function autoReply(text) {
  const t = text.toLowerCase();
  if (t.includes('?')) return 'Good question — let me think and send you a couple notes before we meet.';
  if (t.match(/\b(\d{1,2})\s?(am|pm)\b/) || t.includes('tomorrow') || t.includes('today'))
    return 'That time works for me. I will add it to my calendar 👍';
  if (t.includes('thank')) return 'Anytime! That is what the swap is for 🙌';
  const generic = [
    'Sounds good! See you then.',
    'Got it — I will bring my notes.',
    'Perfect, library table by the windows?',
    'Cool, sending you a practice problem to warm up.',
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}
