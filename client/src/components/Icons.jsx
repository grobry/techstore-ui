const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const BagIcon = (p) => (
  <svg {...base} {...p}><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
);
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
);
export const MenuIcon = (p) => (
  <svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const TruckIcon = (p) => (
  <svg {...base} {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></svg>
);
export const ShieldIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const ReturnIcon = (p) => (
  <svg {...base} {...p}><path d="M4 10h11a5 5 0 0 1 0 10H9" /><path d="m8 6-4 4 4 4" /></svg>
);
export const LockIcon = (p) => (
  <svg {...base} {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const CheckIcon = (p) => (
  <svg {...base} {...p}><path d="m5 12 4.5 4.5L19 7" /></svg>
);
export const StarIcon = ({ filled = 1, ...p }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <defs>
      <linearGradient id={`star-${Math.round(filled * 100)}`}>
        <stop offset={`${filled * 100}%`} stopColor="currentColor" />
        <stop offset={`${filled * 100}%`} stopColor="currentColor" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill={`url(#star-${Math.round(filled * 100)})`} />
  </svg>
);
