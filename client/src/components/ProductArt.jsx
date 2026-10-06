import { useId } from 'react';

/**
 * Renders a product's photo if it has one, otherwise a stylized vector
 * illustration of the device shape tinted with the product's accent color.
 */
export default function ProductArt({ product, className = '', glow = true }) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  if (product?.image) {
    return (
      <div className={`product-art ${className}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
    );
  }

  const accent = product?.accent || '#7c9cff';
  const shape = product?.shape || 'phone';
  const ids = { body: `b${id}`, screen: `s${id}`, glow: `g${id}`, sheen: `h${id}`, dots: `d${id}` };
  const Shape = SHAPES[shape] || SHAPES.phone;

  return (
    <div className={`product-art ${className}`}>
      <svg viewBox="0 0 400 400" role="img" aria-label={product?.name || 'Product'}>
        <defs>
          <radialGradient id={ids.glow} cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.06" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.body} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a3a41" />
            <stop offset="45%" stopColor="#1d1d21" />
            <stop offset="100%" stopColor="#0e0e10" />
          </linearGradient>
          <linearGradient id={ids.screen} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0b0b0d" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={ids.sheen} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <pattern id={ids.dots} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.6" fill="#000" fillOpacity="0.55" />
          </pattern>
        </defs>
        {glow && <rect width="400" height="400" fill={`url(#${ids.glow})`} />}
        <Shape ids={ids} accent={accent} />
      </svg>
    </div>
  );
}

const edge = { stroke: 'rgba(255,255,255,0.10)', strokeWidth: 1.5 };

const SHAPES = {
  phone: ({ ids, accent }) => (
    <g>
      <rect x="138" y="62" width="124" height="276" rx="28" fill={`url(#${ids.body})`} {...edge} />
      <rect x="138" y="62" width="124" height="276" rx="28" fill={`url(#${ids.sheen})`} />
      <rect x="152" y="78" width="62" height="62" rx="16" fill="#0c0c0e" {...edge} />
      <circle cx="170" cy="96" r="11" fill="#050506" stroke={accent} strokeOpacity="0.5" />
      <circle cx="196" cy="96" r="11" fill="#050506" stroke={accent} strokeOpacity="0.5" />
      <circle cx="170" cy="122" r="11" fill="#050506" stroke={accent} strokeOpacity="0.5" />
      <circle cx="196" cy="122" r="4" fill={accent} fillOpacity="0.8" />
      <circle cx="200" cy="250" r="14" fill="none" stroke="rgba(255,255,255,0.12)" />
    </g>
  ),
  tablet: ({ ids }) => (
    <g>
      <rect x="92" y="74" width="216" height="252" rx="22" fill={`url(#${ids.body})`} {...edge} />
      <rect x="102" y="84" width="196" height="232" rx="14" fill={`url(#${ids.screen})`} />
      <rect x="92" y="74" width="216" height="252" rx="22" fill={`url(#${ids.sheen})`} />
      <circle cx="200" cy="79" r="2" fill="#000" />
    </g>
  ),
  laptop: ({ ids }) => (
    <g>
      <rect x="82" y="96" width="236" height="164" rx="12" fill={`url(#${ids.body})`} {...edge} />
      <rect x="90" y="104" width="220" height="146" rx="6" fill={`url(#${ids.screen})`} />
      <path d="M52 262 H348 L336 282 Q334 286 328 286 H72 Q66 286 64 282 Z" fill="#2b2b31" {...edge} />
      <rect x="176" y="262" width="48" height="5" rx="2.5" fill="#141417" />
      <rect x="82" y="96" width="236" height="164" rx="12" fill={`url(#${ids.sheen})`} />
    </g>
  ),
  headphones: ({ ids, accent }) => (
    <g>
      <path d="M118 236 C118 112 282 112 282 236" fill="none" stroke="#26262b" strokeWidth="18" strokeLinecap="round" />
      <path d="M118 236 C118 112 282 112 282 236" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <rect x="92" y="206" width="58" height="108" rx="26" fill={`url(#${ids.body})`} {...edge} />
      <rect x="250" y="206" width="58" height="108" rx="26" fill={`url(#${ids.body})`} {...edge} />
      <rect x="140" y="220" width="10" height="80" rx="5" fill={accent} fillOpacity="0.55" />
      <rect x="250" y="220" width="10" height="80" rx="5" fill={accent} fillOpacity="0.55" />
    </g>
  ),
  earbuds: ({ ids, accent }) => (
    <g>
      <rect x="122" y="214" width="156" height="110" rx="44" fill={`url(#${ids.body})`} {...edge} />
      <line x1="132" y1="252" x2="268" y2="252" stroke="rgba(255,255,255,0.08)" />
      <circle cx="200" cy="286" r="3" fill={accent} />
      {[160, 240].map((cx, i) => (
        <g key={cx} transform={`rotate(${i ? 18 : -18} ${cx} 150)`}>
          <rect x={cx - 9} y="150" width="18" height="58" rx="9" fill="#232328" {...edge} />
          <circle cx={cx} cy="146" r="28" fill={`url(#${ids.body})`} {...edge} />
          <circle cx={cx} cy="146" r="12" fill="#0a0a0c" stroke={accent} strokeOpacity="0.45" />
        </g>
      ))}
    </g>
  ),
  watch: ({ ids, accent }) => (
    <g>
      <rect x="164" y="34" width="72" height="332" rx="22" fill="#1a1a1e" {...edge} />
      <rect x="132" y="112" width="136" height="176" rx="38" fill={`url(#${ids.body})`} {...edge} />
      <rect x="144" y="124" width="112" height="152" rx="28" fill="#060607" />
      <circle cx="200" cy="200" r="44" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeDasharray="200 300" transform="rotate(-90 200 200)" />
      <circle cx="200" cy="200" r="30" fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" strokeDasharray="120 300" transform="rotate(-90 200 200)" />
      <rect x="266" y="168" width="10" height="34" rx="4" fill={accent} fillOpacity="0.85" />
    </g>
  ),
  camera: ({ ids, accent }) => (
    <g>
      <path d="M150 138 L164 112 H236 L250 138 Z" fill="#24242a" {...edge} />
      <rect x="72" y="136" width="256" height="156" rx="20" fill={`url(#${ids.body})`} {...edge} />
      <rect x="72" y="136" width="50" height="156" rx="20" fill="#141417" />
      <circle cx="222" cy="214" r="62" fill="#18181c" {...edge} />
      <circle cx="222" cy="214" r="46" fill="#0a0a0c" stroke="rgba(255,255,255,0.12)" />
      <circle cx="222" cy="214" r="28" fill={`url(#${ids.screen})`} />
      <circle cx="210" cy="202" r="7" fill="#fff" fillOpacity="0.35" />
      <circle cx="300" cy="158" r="6" fill={accent} />
    </g>
  ),
  speaker: ({ ids, accent }) => (
    <g>
      <rect x="146" y="62" width="108" height="280" rx="54" fill={`url(#${ids.body})`} {...edge} />
      <rect x="146" y="120" width="108" height="200" fill={`url(#${ids.dots})`} />
      <ellipse cx="200" cy="82" rx="34" ry="8" fill="none" stroke={accent} strokeWidth="3" strokeOpacity="0.8" />
      <rect x="146" y="62" width="108" height="280" rx="54" fill={`url(#${ids.sheen})`} />
    </g>
  ),
  keyboard: ({ ids, accent }) => {
    const keys = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 13; c++) {
        keys.push(<rect key={`${r}-${c}`} x={66 + c * 21.5} y={160 + r * 21} width="17" height="17" rx="4" fill={r === 4 && c > 3 && c < 9 ? '#1b1b1f' : '#26262c'} stroke="rgba(255,255,255,0.06)" />);
      }
    }
    return (
      <g>
        <rect x="52" y="146" width="296" height="124" rx="16" fill={`url(#${ids.body})`} {...edge} />
        {keys}
        <rect x="52" y="146" width="296" height="124" rx="16" fill="none" stroke={accent} strokeOpacity="0.35" />
        <rect x="324" y="160" width="17" height="17" rx="4" fill={accent} fillOpacity="0.85" />
      </g>
    );
  },
};
