import { SKILL_LIBRARY } from '../data/mockData.js';

const norm = (s) => s.trim().toLowerCase();

export function categoryForSkill(name) {
  const hit = SKILL_LIBRARY.find((s) => norm(s.name) === norm(name));
  return hit ? hit.cat : null;
}

// Distinct skill categories a peer can teach.
export function categoriesForPeer(peer) {
  return [...new Set((peer.offeredSkills || []).map(categoryForSkill).filter(Boolean))];
}

// Skills a peer offers that fall in a given category.
export function peerSkillsInCategory(peer, catId) {
  return (peer.offeredSkills || []).filter((s) => categoryForSkill(s) === catId);
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

// Short human-readable reasons the algorithm surfaced this tutor.
export function matchReasons(user, peer) {
  const reasons = [];
  const teaches = theyCanTeach(user, peer);
  const learns = youCanTeach(user, peer);
  const avail = sharedAvailability(user, peer);
  if (teaches.length) reasons.push(`Teaches ${teaches.slice(0, 2).join(' & ')}`);
  if (teaches.length && learns.length) reasons.push('Two-way swap — you can teach them back');
  if (avail.length) reasons.push(`Free ${avail[0].toLowerCase()} like you`);
  if (peer.school === user.school) reasons.push('Same school');
  if ((peer.mutualFriends || 0) >= 2) reasons.push(`${peer.mutualFriends} mutual friends`);
  if ((peer.rating || 0) >= 4.9) reasons.push(`Top-rated (${peer.rating}★)`);
  return reasons.slice(0, 3);
}

// Auto-recommendations: best matches the user hasn't already connected with or passed on.
// Tutors who can directly help the user float to the top; the list is then topped
// up with strong all-round matches so there's always something to show.
export function recommendedTutors(user, peers, { exclude = [], limit = 4 } = {}) {
  const skip = new Set(exclude);
  const all = rankedMatches(user, peers, 'all').filter((m) => !skip.has(m.peer.id));
  const canHelp = all.filter((m) => m.teaches.length > 0);
  const rest = all.filter((m) => m.teaches.length === 0);
  return [...canHelp, ...rest]
    .slice(0, limit)
    .map((m) => ({ ...m, reasons: matchReasons(user, m.peer) }));
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
