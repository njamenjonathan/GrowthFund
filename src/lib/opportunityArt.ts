import { Category } from '../types';

/**
 * Built-in artwork for every offering.
 *
 * Cards previously depended entirely on remote photographs, so a blocked
 * host, an offline device or a dead URL left an empty grey box where the
 * image should be. Each category now has generated SVG artwork that ships
 * with the bundle, used both as the placeholder while a photo loads and
 * as the permanent fallback if it never does.
 */

interface Palette {
  from: string;
  to: string;
  accent: string;
}

const PALETTES: Record<Category, Palette> = {
  Energy: { from: '#065f46', to: '#10b981', accent: '#fbbf24' },
  Agriculture: { from: '#3f6212', to: '#84cc16', accent: '#fde047' },
  'Real Estate': { from: '#1e3a8a', to: '#3b82f6', accent: '#93c5fd' },
  Infrastructure: { from: '#78350f', to: '#f59e0b', accent: '#fed7aa' },
  Technology: { from: '#4c1d95', to: '#8b5cf6', accent: '#c4b5fd' },
  Healthcare: { from: '#831843', to: '#ec4899', accent: '#fbcfe8' },
};

/** A category motif drawn over the gradient. */
const MOTIFS: Record<Category, (p: Palette) => string> = {
  // Solar array with a sun.
  Energy: (p) => `
    <circle cx="620" cy="120" r="46" fill="${p.accent}" opacity="0.9"/>
    <g fill="${p.accent}" opacity="0.75">
      <rect x="90"  y="250" width="150" height="96" rx="6" transform="skewX(-12)"/>
      <rect x="270" y="250" width="150" height="96" rx="6" transform="skewX(-12)"/>
      <rect x="450" y="250" width="150" height="96" rx="6" transform="skewX(-12)"/>
    </g>
    <g stroke="${p.from}" stroke-width="4" opacity="0.5">
      <line x1="120" y1="298" x2="640" y2="298"/>
    </g>`,
  // Rows of crops under a sun.
  Agriculture: (p) => `
    <circle cx="130" cy="110" r="40" fill="${p.accent}" opacity="0.85"/>
    <g stroke="${p.accent}" stroke-width="9" stroke-linecap="round" opacity="0.8">
      <path d="M150 360 Q170 280 190 360"/>
      <path d="M250 360 Q270 270 290 360"/>
      <path d="M350 360 Q370 285 390 360"/>
      <path d="M450 360 Q470 265 490 360"/>
      <path d="M550 360 Q570 290 590 360"/>
    </g>
    <rect x="60" y="358" width="600" height="10" rx="5" fill="${p.accent}" opacity="0.55"/>`,
  // City skyline.
  'Real Estate': (p) => `
    <g fill="${p.accent}" opacity="0.8">
      <rect x="110" y="200" width="90"  height="170" rx="4"/>
      <rect x="220" y="140" width="110" height="230" rx="4"/>
      <rect x="350" y="230" width="90"  height="140" rx="4"/>
      <rect x="460" y="120" width="120" height="250" rx="4"/>
    </g>
    <g fill="${p.from}" opacity="0.55">
      <rect x="128" y="222" width="18" height="18"/><rect x="162" y="222" width="18" height="18"/>
      <rect x="240" y="166" width="20" height="20"/><rect x="285" y="166" width="20" height="20"/>
      <rect x="240" y="226" width="20" height="20"/><rect x="285" y="226" width="20" height="20"/>
      <rect x="482" y="150" width="22" height="22"/><rect x="530" y="150" width="22" height="22"/>
      <rect x="482" y="212" width="22" height="22"/><rect x="530" y="212" width="22" height="22"/>
    </g>`,
  // Pylons and transmission lines.
  Infrastructure: (p) => `
    <g stroke="${p.accent}" stroke-width="8" fill="none" opacity="0.85" stroke-linecap="round">
      <path d="M180 370 L215 150 L250 370 M190 300 L240 300 M185 240 L245 240"/>
      <path d="M450 370 L485 150 L520 370 M460 300 L510 300 M455 240 L515 240"/>
    </g>
    <g stroke="${p.accent}" stroke-width="5" fill="none" opacity="0.6">
      <path d="M215 165 Q350 235 485 165"/>
      <path d="M195 245 Q350 305 505 245"/>
    </g>`,
  // Server racks with status lights.
  Technology: (p) => `
    <g fill="${p.accent}" opacity="0.8">
      <rect x="180" y="130" width="150" height="240" rx="10"/>
      <rect x="370" y="130" width="150" height="240" rx="10"/>
    </g>
    <g fill="${p.from}" opacity="0.6">
      <rect x="200" y="158" width="110" height="14" rx="7"/><rect x="200" y="192" width="110" height="14" rx="7"/>
      <rect x="200" y="226" width="110" height="14" rx="7"/><rect x="200" y="260" width="110" height="14" rx="7"/>
      <rect x="390" y="158" width="110" height="14" rx="7"/><rect x="390" y="192" width="110" height="14" rx="7"/>
      <rect x="390" y="226" width="110" height="14" rx="7"/><rect x="390" y="260" width="110" height="14" rx="7"/>
    </g>
    <g fill="#22c55e" opacity="0.95">
      <circle cx="300" cy="310" r="7"/><circle cx="490" cy="310" r="7"/>
    </g>`,
  // Medical cross and pulse trace.
  Healthcare: (p) => `
    <g fill="${p.accent}" opacity="0.85">
      <rect x="316" y="120" width="68" height="200" rx="12"/>
      <rect x="250" y="186" width="200" height="68" rx="12"/>
    </g>
    <path d="M90 340 L200 340 L235 288 L280 384 L325 330 L610 330"
          fill="none" stroke="${p.accent}" stroke-width="8"
          stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>`,
};

/**
 * A self-contained SVG data URI for an offering.
 * `seed` shifts the gradient angle so neighbouring cards in the same
 * category do not look identical.
 */
export const opportunityArt = (category: Category, seed = ''): string => {
  const palette = PALETTES[category] ?? PALETTES.Infrastructure;
  const angle = 20 + (hash(seed) % 50);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" width="720" height="400" role="img">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${palette.from}"/>
        <stop offset="100%" stop-color="${palette.to}"/>
      </linearGradient>
    </defs>
    <rect width="720" height="400" fill="url(#g)"/>
    ${MOTIFS[category]?.(palette) ?? ''}
  </svg>`;

  // encodeURIComponent keeps this valid for every character the SVG uses,
  // and avoids btoa's problems with non-Latin-1 input.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`;
};

const hash = (value: string): number => {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) total = (total * 31 + value.charCodeAt(i)) >>> 0;
  return total;
};
