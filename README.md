# SkillSwap

A React web app that connects high schoolers with peers for mentoring and tutoring.
The visual design is streamlined and upgraded for a teen audience (playful palette,
soft cards, motion, dark‑mode aware).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to /dist
npm run preview  # serve the build
```

## What's in it

| Area | Screen(s) |
| --- | --- |
| Onboarding | Welcome, Sign in, 3‑step **Create your profile** (info → skills → availability) |
| Home | Top‑match spotlight, active swaps, pending connect requests (accept/decline), browse by category |
| Matches | Ranked match list with filters (best / two‑way swaps / can help me / I can help) |
| Match Blueprint | Two‑way skill fit, shared availability, match score, send connect request, add friend |
| Chat | Conversation list + full thread with day separators and a simulated reply bot |
| Call | Simulated voice / video call screen (ring → connect → timer, mute & camera toggles) |
| Profile | Stats, editable skill lists, availability, upcoming swaps, friends |
| Social | Friends: incoming requests, friends list, "people you may know"; peer profiles |
| Notifications | Requests, new matches, messages, friend + rating activity |

## How matching works

`src/utils/matching.js` scores each peer 0–100 by blending:
two‑way skill fit (they teach what you need **and** you teach what they need scores
highest), shared availability, same‑school bonus, mutual friends, and peer rating.

## Notes

- All data is seeded from `src/data/mockData.js`; state persists to `localStorage`
  (`skillswap.v1`). "Sign out" on the Profile screen clears it and resets the demo.
- Calls and the chat reply bot are **simulated** — there's no backend or WebRTC.
- Stack: React 18, React Router 6, Vite. Plain CSS design system in
  `src/styles/global.css`. No component library.
