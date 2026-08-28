import { SKILL_LIBRARY } from '../data/mockData.js';

const norm = (s) => s.trim().toLowerCase();

export function categoryForSkill(name) {
  const hit = SKILL_LIBRARY.find((s) => norm(s.name) === norm(name));
  return hit ? hit.cat : null;
}

// Skills the peer offers that the user needs.
export function theyCanTeach(user, peer) {
  const need = new Set(user.neededSkills.map(norm));
  return peer.offeredSkills.filter((s) => need.has(norm(s)));
}

// Skills the user offers that the peer needs.
export function youCanTeach(user, peer) {
  const need = new Set(peer.neededSkills.map(norm));
  return user.offeredSkills.filter((s) => need.has(norm(s)));
}

export function sharedAvailability(user, peer) {
  const mine = new Set(user.availability || []);
  return (peer.availability || []).filter((a) => mine.has(a));
}

// A 0-100 "match score" blending two-way skill fit, schedule overlap,
// same-school bonus, mutual friends and the peer's rating.
export function matchScore(user, peer) {
  const inbound = theyCanTeach(user, peer).length; // value to the user
  const outbound = youCanTeach(user, peer).length; // value to the peer
  const avail = sharedAvailability(user, peer).length;

  let score = 0;
  score += Math.min(inbound, 3) * 20; // up to 60
  score += Math.min(outbound, 3) * 10; // up to 30 — mutual swaps rank higher
  if (inbound > 0 && outbound > 0) score += 12; // true "swap" bonus
  score += Math.min(avail, 2) * 6; // up to 12
  if (peer.school === user.school) score += 6;
  score += Math.min(peer.mutualFriends || 0, 4) * 1.5; // up to 6
  score += ((peer.rating || 4.5) - 4.5) * 8; // small nudge from rating

  return Math.max(8, Math.min(99, Math.round(score)));
}

// Ranked matches for the user. `mode` filters the list.
export function rankedMatches(user, peers, mode = 'all') {
  let list = peers
    .map((p) => ({
      peer: p,
      score: matchScore(user, p),
      teaches: theyCanTeach(user, p),
      learns: youCanTeach(user, p),
    }))
    .sort((a, b) => b.score - a.score);

  if (mode === 'canHelpMe') list = list.filter((m) => m.teaches.length > 0);
  if (mode === 'iCanHelp') list = list.filter((m) => m.learns.length > 0);
  if (mode === 'swaps') list = list.filter((m) => m.teaches.length > 0 && m.learns.length > 0);
  return list;
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d}d`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function clockTime(ts) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
