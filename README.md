# SkillSwap

A React web app that connects high schoolers with peers for mentoring and tutoring.
It borrows the shapes people already know from social apps: an Instagram/LinkedIn‑style
**feed**, a dating‑app‑style **swipe deck** for finding a mentor, and a **credit economy**
that keeps the give‑and‑take fair.

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
| Feed | Instagram/LinkedIn‑style activity feed: stories row, post composer, likes, comments, skill endorsements, plus an **auto‑recommended tutors** strip |
| Discover | Dating‑app **swipe deck** — pick a field, swipe right to send a mentor match or left to pass; tutors **accept the match** to connect |
| Learn | Pick a skill **category** → ranked list of tutor profiles with **ratings, rating counts, and how many people they've tutored**; sort by match / rating / most tutored |
| Credits | Wallet + ledger. **Tutoring earns credits; booking a session spends them.** Log sessions you tutored to earn |
| Matches / Blueprint | Ranked matches with filters; per‑match blueprint with score, reasons, two‑way skill fit, availability, **Book a session (credits)** or free connect request |
| Chat / Call | Conversation list + thread with a simulated reply bot; simulated voice/video call screen |
| Profile | Credit balance card, tutor stats, editable skills, availability, friends, endorsements |
| Notifications | **Needs your response** section — inline accept/decline for tutor match requests, connect requests, and friend requests — plus an activity log |

## Credit / token economy

- Everyone starts with **9 credits**. A session costs **2–4 credits** depending on the tutor (`peer.rate`).
- **Tutor someone → earn 3 credits** (log it from the Credits screen). **Book a tutor → spend credits.**
- Every earn/spend is written to a ledger (`state.ledger`) shown on the Credits screen.

## How matching & recommendations work

`src/utils/matching.js` scores each peer 0–100 by blending two‑way skill fit, shared
availability, same‑school bonus, mutual friends, and peer rating. On top of that:

- `matchReasons()` — the short "why we surfaced this tutor" chips.
- `recommendedTutors()` — auto‑recommendations for the Feed and Learn screens; tutors
  who can directly help you float to the top, then strong all‑round matches.
- `peerSkillsInCategory()` / `categoriesForPeer()` — power the category and Discover filters.

## Accessibility note

Button colours were tuned so every label clears WCAG AA contrast against its own fill
(bright fills like mint/amber use near‑black text; saturated fills use white). See the
"button colour + text‑contrast rules" block in `src/styles/global.css`.

## Notes

- All data is seeded from `src/data/mockData.js`; state persists to `localStorage`
  (`skillswap.v2`). "Sign out" on the Profile screen clears it and resets the demo.
- Calls, the chat reply bot, and "tutor accepts your match" are **simulated** — no backend.
- Stack: React 18, React Router 6, Vite. Plain CSS design system in `src/styles/global.css`.
