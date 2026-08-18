/**
 * Le poulpe seul, monochrome (`currentColor`) — version lisible sous 40px.
 * À remplacer par les tracés vectoriels du logo officiel dès réception.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 96"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* tête */}
      <path
        d="M50 8c15.6 0 26.8 11.2 26.8 25.4 0 8.2-3.4 14.4-8.6 19.2-3.2 3-5 5.4-5.6 9H37.4c-.6-3.6-2.4-6-5.6-9-5.2-4.8-8.6-11-8.6-19.2C23.2 19.2 34.4 8 50 8Z"
        fill="currentColor"
      />
      {/* yeux */}
      <circle cx="41.5" cy="31" r="3.6" fill="var(--color-paper)" />
      <circle cx="58.5" cy="31" r="3.6" fill="var(--color-paper)" />
      {/* tentacules */}
      <g
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M38 62c-6 6-14 6-19 12s-2 12 3 14" />
        <path d="M44 63c-4 8-11 12-13 20s3 10 8 9" />
        <path d="M50 64v14c0 8 4 12 9 11" />
        <path d="M56 63c4 8 11 11 14 18s-2 11-7 10" />
        <path d="M62 62c6 6 15 5 20 11s2 13-4 14" />
        <path d="M33 60c-7 3-15 1-20 7s-2 11 3 12" />
        <path d="M67 60c7 3 15 0 20 6s2 12-4 13" />
        <path d="M47 64c-1 9-5 13-5 21" />
      </g>
    </svg>
  );
}
