import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_USER,
  PEERS,
  SEED_CONVERSATIONS,
  SEED_REQUESTS,
  SEED_ACTIVE_MATCHES,
  SEED_NOTIFICATIONS,
  SEED_MATCH_REQUESTS,
  SEED_LEDGER,
  SEED_FEED,
  SESSION_COST,
  STARTING_CREDITS,
} from '../data/mockData.js';
import { peerSkillsInCategory } from '../utils/matching.js';

const AppContext = createContext(null);
const STORAGE_KEY = 'skillswap.v2';

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
    matchRequests: SEED_MATCH_REQUESTS,
    ledger: SEED_LEDGER,
    feed: SEED_FEED,
    passedTutors: [],
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => ({ ...freshState(), ...(loadState() || {}) }));

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
            credits: STARTING_CREDITS,
            stats: { helped: 0, sessions: 0, rating: 5.0, tutored: 0 },
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

      /* ---- credits / tokens ---- */
      // Book a paid tutoring session with a peer. Spends credits.
      // Guarded so it is a no-op if the balance can't cover the cost; callers
      // should pre-check `credits` to decide what to tell the user.
      bookSession(peerId) {
        update((s) => {
          const peer = s.peers.find((p) => p.id === peerId);
          if (!peer) return {};
          const cost = peer.rate || SESSION_COST;
          if ((s.user.credits || 0) < cost) return {};
          const skill = peer.offeredSkills[0];
          return {
            user: { ...s.user, credits: s.user.credits - cost },
            ledger: [
              { id: rid(), kind: 'spend', amount: cost, reason: `Session with ${peer.name.split(' ')[0]} — ${skill}`, peerId, ts: Date.now() },
              ...s.ledger,
            ],
            activeMatches: s.activeMatches.includes(peerId) ? s.activeMatches : [...s.activeMatches, peerId],
            conversations: ensureConversation(s.conversations, peerId, {
              from: 'me',
              text: `Booked a ${skill} session with you (${cost} credits). What time works?`,
            }),
          };
        });
      },
      // Simulate finishing a session where YOU were the tutor — earns credits.
      logTutoringSession(peerId) {
        update((s) => {
          const peer = s.peers.find((p) => p.id === peerId);
          const reward = SESSION_COST;
          const skill = s.user.offeredSkills[0] || 'a skill';
          return {
            user: {
              ...s.user,
              credits: (s.user.credits || 0) + reward,
              stats: {
                ...s.user.stats,
                sessions: (s.user.stats?.sessions || 0) + 1,
                helped: (s.user.stats?.helped || 0) + 1,
                tutored: (s.user.stats?.tutored || 0) + 1,
              },
            },
            ledger: [
              { id: rid(), kind: 'earn', amount: reward, reason: `Tutored ${peer ? peer.name.split(' ')[0] : 'a peer'} — ${skill}`, peerId, ts: Date.now() },
              ...s.ledger,
            ],
          };
        });
      },

      /* ---- dating-style tutor matching ---- */
      // dir 'right' = interested (send a mentor match); 'left' = pass.
      swipeTutor(peerId, dir, field) {
        if (dir === 'left') {
          update((s) => ({ passedTutors: [...new Set([...s.passedTutors, peerId])] }));
          return;
        }
        update((s) => {
          if (s.matchRequests.some((m) => m.peerId === peerId && m.status === 'pending')) return {};
          const peer = s.peers.find((p) => p.id === peerId);
          const skill = field ? peerSkillInField(peer, field) : peer?.offeredSkills[0];
          return {
            matchRequests: [
              { id: rid(), peerId, dir: 'outgoing', field, skill, status: 'pending', ts: Date.now() },
              ...s.matchRequests,
            ],
          };
        });
        // Simulate the tutor accepting shortly after.
        setTimeout(() => {
          update((s) => {
            const mr = s.matchRequests.find((m) => m.peerId === peerId && m.dir === 'outgoing' && m.status === 'pending');
            if (!mr) return {};
            const peer = s.peers.find((p) => p.id === peerId);
            return {
              matchRequests: s.matchRequests.map((m) => (m.id === mr.id ? { ...m, status: 'accepted' } : m)),
              notifications: [
                { id: rid(), type: 'tutor_match', peerId, text: `matched with you for ${mr.skill || 'mentoring'} — say hi!`, ts: Date.now(), read: false },
                ...s.notifications,
              ],
              activeMatches: s.activeMatches.includes(peerId) ? s.activeMatches : [...s.activeMatches, peerId],
              conversations: ensureConversation(s.conversations, peerId, {
                from: peerId,
                text: `Hey! Saw we matched${mr.skill ? ` on ${mr.skill}` : ''}. Happy to mentor you — what are you stuck on?`,
              }),
            };
          });
        }, 1600);
      },
      acceptMatchRequest(mrId) {
        update((s) => {
          const mr = s.matchRequests.find((m) => m.id === mrId);
          if (!mr) return {};
          return {
            matchRequests: s.matchRequests.map((m) => (m.id === mrId ? { ...m, status: 'accepted' } : m)),
            activeMatches: s.activeMatches.includes(mr.peerId) ? s.activeMatches : [...s.activeMatches, mr.peerId],
            conversations: ensureConversation(s.conversations, mr.peerId, {
              from: 'me',
              text: `Thanks for offering to mentor me${mr.skill ? ` in ${mr.skill}` : ''}! When are you free?`,
            }),
          };
        });
      },
      declineMatchRequest(mrId) {
        update((s) => ({ matchRequests: s.matchRequests.filter((m) => m.id !== mrId) }));
      },
      resetSwipes() {
        update({ passedTutors: [] });
      },

      /* ---- feed (social) ---- */
      addPost(text, extra = {}) {
        const clean = text.trim();
        if (!clean) return;
        update((s) => ({
          feed: [
            { id: rid(), authorId: 'me', type: 'update', text: clean, ts: Date.now(), likes: 0, likedByMe: false, comments: [], ...extra },
            ...s.feed,
          ],
        }));
      },
      toggleLike(postId) {
        update((s) => ({
          feed: s.feed.map((p) =>
            p.id === postId
              ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
              : p
          ),
        }));
      },
      addComment(postId, text) {
        const clean = text.trim();
        if (!clean) return;
        update((s) => ({
          feed: s.feed.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, { id: rid(), authorId: 'me', text: clean, ts: Date.now() }] }
              : p
          ),
        }));
      },
      endorse(peerId, skill) {
        update((s) => ({
          peers: s.peers.map((p) =>
            p.id === peerId
              ? { ...p, endorsements: { ...(p.endorsements || {}), [skill]: (p.endorsements?.[skill] || 0) + 1 } }
              : p
          ),
          feed: [
            { id: rid(), authorId: 'me', type: 'endorsement', text: `endorsed ${s.peers.find((p) => p.id === peerId)?.name} for ${skill}`, skill, targetId: peerId, ts: Date.now(), likes: 0, likedByMe: false, comments: [] },
            ...s.feed,
          ],
        }));
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
      dismissNotification(nId) {
        update((s) => ({ notifications: s.notifications.filter((n) => n.id !== nId) }));
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
    const incomingMatchRequests = state.matchRequests.filter((m) => m.dir === 'incoming' && m.status === 'pending');
    const incomingFriendRequests = state.peers.filter((p) => p.friendState === 'incoming');
    const actionableCount = incomingMatchRequests.length + incomingFriendRequests.length + state.requests.length;
    const credits = state.user?.credits ?? 0;
    return { peerById, unreadChats, unreadNotifications, incomingMatchRequests, incomingFriendRequests, actionableCount, credits };
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

function peerSkillInField(peer, field) {
  if (!peer) return undefined;
  return (field && peerSkillsInCategory(peer, field)[0]) || peer.offeredSkills[0];
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
