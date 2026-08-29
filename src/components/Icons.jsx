// Minimal inline icon set (stroke-based, inherits currentColor).
const S = ({ children, size = 22, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

export const IconHome = (p) => (
  <S {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </S>
);

export const IconMatches = (p) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c.6-3 2.9-4.6 5.5-4.6S14 16 14.5 19" />
    <path d="M16 11a3 3 0 0 0 0-6" />
    <path d="M18 19c-.2-2-1-3.4-2.4-4.2" />
  </S>
);

export const IconChat = (p) => (
  <S {...p}>
    <path d="M20 4H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3v4l4.5-4H20a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z" />
  </S>
);

export const IconProfile = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3.2" />
    <path d="M6.5 18.5c1-2.4 3-3.6 5.5-3.6s4.5 1.2 5.5 3.6" />
  </S>
);

export const IconBell = (p) => (
  <S {...p}>
    <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5Z" />
    <path d="M10.5 19a2 2 0 0 0 3 0" />
  </S>
);

export const IconSearch = (p) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </S>
);

export const IconEdit = (p) => (
  <S {...p}>
    <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="M14 6.5l3 3" />
  </S>
);

export const IconChevronLeft = (p) => (
  <S {...p}>
    <path d="m14 6-6 6 6 6" />
  </S>
);

export const IconChevronRight = (p) => (
  <S {...p}>
    <path d="m10 6 6 6-6 6" />
  </S>
);

export const IconPlus = (p) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

export const IconX = (p) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
);

export const IconCheck = (p) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </S>
);

export const IconPhone = (p) => (
  <S {...p}>
    <path d="M15.5 21C8 21 3 16 3 8.5 3 7 4 6 5.5 6H8l1.5 4L7.7 11.7a12 12 0 0 0 4.6 4.6L14 14.5 18 16v2.5C18 20 17 21 15.5 21Z" />
  </S>
);

export const IconVideo = (p) => (
  <S {...p}>
    <rect x="3" y="6" width="12" height="12" rx="2" />
    <path d="m15 10 6-3v10l-6-3" />
  </S>
);

export const IconMic = (p) => (
  <S {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <path d="M12 17v4" />
  </S>
);

export const IconMicOff = (p) => (
  <S {...p}>
    <path d="M9 5.5A3 3 0 0 1 15 6v4M15 12.5a3 3 0 0 1-4.6 1.4" />
    <path d="M6 11a6 6 0 0 0 9.3 5M18 11a6 6 0 0 1-.3 1.9" />
    <path d="M12 17v4M4 3l16 16" />
  </S>
);

export const IconStar = (p) => (
  <S {...p}>
    <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.1 6L12 16.9 6.7 19.6l1.1-6L3.3 9.4l6.1-.8L12 3Z" />
  </S>
);

export const IconClock = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </S>
);

export const IconSend = (p) => (
  <S {...p}>
    <path d="M4 12 20 4l-4.5 16-3.5-6.5L4 12Z" />
  </S>
);

export const IconSparkle = (p) => (
  <S {...p}>
    <path d="M12 3.5c.8 3.7 1.8 4.7 5.5 5.5-3.7.8-4.7 1.8-5.5 5.5-.8-3.7-1.8-4.7-5.5-5.5 3.7-.8 4.7-1.8 5.5-5.5Z" />
    <path d="M18 14c.4 1.8.9 2.3 2.7 2.7-1.8.4-2.3.9-2.7 2.7-.4-1.8-.9-2.3-2.7-2.7 1.8-.4 2.3-.9 2.7-2.7Z" />
  </S>
);

export const IconCalendar = (p) => (
  <S {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </S>
);

export const IconArrowRight = (p) => (
  <S {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
);

export const IconUserPlus = (p) => (
  <S {...p}>
    <circle cx="10" cy="8" r="3.5" />
    <path d="M4 19c.7-3 3-4.7 6-4.7 1 0 1.9.2 2.7.5" />
    <path d="M18 13v6M15 16h6" />
  </S>
);

export const IconLogOut = (p) => (
  <S {...p}>
    <path d="M14 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8" />
    <path d="M17 8l4 4-4 4M21 12H9" />
  </S>
);

export const IconCoin = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v9M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2-1.1 2-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2 2.5-.9 2.5-2" />
  </S>
);

export const IconHeart = (p) => (
  <S {...p}>
    <path d="M12 20s-7-4.3-9.3-8.5C1.2 8.8 2.6 5.5 6 5.5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3 3.4 0 4.8 3.3 3.3 6C19 15.7 12 20 12 20Z" />
  </S>
);

export const IconHeartFill = (p) => (
  <S {...p} fill="currentColor" stroke="none">
    <path d="M12 20.5s-7.4-4.6-9.7-9C.8 8.4 2.4 4.5 6.3 4.5c2 0 3.7 1.1 4.7 2.6 1-1.5 2.7-2.6 4.7-2.6 3.9 0 5.5 3.9 4 7-2.3 4.4-9.7 9-9.7 9Z" />
  </S>
);

export const IconComment = (p) => (
  <S {...p}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.5-5.4A8.5 8.5 0 1 1 21 11.5Z" />
  </S>
);

export const IconCompass = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </S>
);

export const IconBook = (p) => (
  <S {...p}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5V4.5Z" />
    <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19" />
  </S>
);

export const IconThumbUp = (p) => (
  <S {...p}>
    <path d="M7 10v10H4V10h3Z" />
    <path d="M7 10l4-7c1.4 0 2.3 1.1 2 2.5L12.5 9H18a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 17 19H7" />
  </S>
);

export const IconBolt = (p) => (
  <S {...p}>
    <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
  </S>
);

export const IconRefresh = (p) => (
  <S {...p}>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4" />
  </S>
);
