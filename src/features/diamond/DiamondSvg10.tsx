import React from 'react';
import { CANONICAL_STAGES, isValidNarrative } from '../../domain/constants';
import { DiamondVersion } from '../../types/domain';

interface DiamondSvg10Props {
  version: DiamondVersion | null;
  selectedDimension?: 'personal' | 'profesional';
  selectedIndex?: number;
  onSelectFacet?: (dim: 'personal' | 'profesional', index: number) => void;
  readOnly?: boolean;
  className?: string;
}

const YS = [75, 144, 211, 280, 360, 493];
const XS = [420, 279, 210, 168, 245, 420];

const STAGE_ACTIVE_COLORS = [
  '#00685F', // 0: Aspiración ganadora
  '#0D9488', // 1: Dónde jugar
  '#14B8A6', // 2: Cómo ganar
  '#2DD4BF', // 3: Con qué capacidades
  '#0284C7', // 4: Sistemas de gestión
];

export const DiamondSvg10: React.FC<DiamondSvg10Props> = ({
  version,
  selectedDimension,
  selectedIndex,
  onSelectFacet,
  readOnly = false,
  className = ''
}) => {
  const pCount = (version?.personalAnswers || []).filter(isValidNarrative).length;
  const prCount = (version?.professionalAnswers || []).filter(isValidNarrative).length;
  const activeCount = pCount + prCount;

  const prefix = React.useId();

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* SVG Container */}
      <svg
        viewBox="105 24 630 495"
        className="w-full max-w-[620px] h-auto drop-shadow-sm transition-all duration-300"
        aria-label={`Diamante estratégico de diez facetas. ${activeCount} de 10 decisiones completas.`}
        role="img"
      >
        <defs>
          <radialGradient id={`${prefix}-halo`}>
            <stop stopColor="#0D9488" stopOpacity={activeCount > 0 ? "0.18" : "0.05"} />
            <stop offset="1" stopColor="#0D9488" stopOpacity="0" />
          </radialGradient>
          <filter id={`${prefix}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1E293B" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Ambient Halo */}
        <ellipse cx="420" cy="280" rx="280" ry="230" fill={`url(#${prefix}-halo)`} />

        {/* Outer Base Silhouette */}
        <path
          d="M420 75 L561 144 L630 211 L672 280 L595 360 L420 493 L245 360 L168 280 L210 211 L279 144 Z"
          fill="#FFFFFF"
          stroke="#E9E6DF"
          strokeWidth="2"
        />

        {/* Render 10 Facets (5 Left = Personal, 5 Right = Professional) */}
        {CANONICAL_STAGES.map((stage, i) => {
          const yt = YS[i];
          const yb = YS[i + 1];

          return (['personal', 'profesional'] as const).map(dim => {
            const isLeft = dim === 'personal';
            const xt = isLeft ? XS[i] : 840 - XS[i];
            const xb = isLeft ? XS[i + 1] : 840 - XS[i + 1];

            const points = isLeft
              ? `${xt},${yt} 420,${yt} 420,${yb} ${xb},${yb}`
              : `420,${yt} ${xt},${yt} ${xb},${yb} 420,${yb}`;

            const answer = isLeft
              ? version?.personalAnswers?.[i]
              : version?.professionalAnswers?.[i];
            const isAnswered = isValidNarrative(answer);
            const isSelected = selectedDimension === dim && selectedIndex === i;

            // Fill color
            let fillColor = '#F7F5F0'; // Default empty
            if (isAnswered) {
              fillColor = STAGE_ACTIVE_COLORS[i];
            }

            return (
              <g key={`${dim}-${i}`} className="group cursor-pointer">
                <polygon
                  points={points}
                  fill={fillColor}
                  fillOpacity={isAnswered ? 0.92 : 0.6}
                  stroke={isSelected ? '#EA580C' : '#E9E6DF'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-200 hover:opacity-100"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 8px rgba(234, 88, 12, 0.4))' : undefined
                  }}
                  onClick={() => !readOnly && onSelectFacet?.(dim, i)}
                  onKeyDown={e => {
                    if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelectFacet?.(dim, i);
                    }
                  }}
                  role="button"
                  tabIndex={readOnly ? -1 : 0}
                  aria-label={`${dim.toUpperCase()}: ${stage.title} - ${isAnswered ? 'Completada' : 'Pendiente'}`}
                  aria-pressed={isSelected}
                />
              </g>
            );
          });
        })}

        {/* Horizontal Tier Dividing Lines */}
        {YS.slice(1, 5).map((y, idx) => (
          <line
            key={`hline-${y}`}
            x1={XS[idx + 1]}
            y1={y}
            x2={840 - XS[idx + 1]}
            y2={y}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            pointerEvents="none"
          />
        ))}

        {/* Center Vertical Spine Line (Divides Personal and Professional) */}
        <line
          x1="420"
          y1="75"
          x2="420"
          y2="493"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          pointerEvents="none"
        />

        {/* Stage Center Medallions / Badges */}
        {CANONICAL_STAGES.map((stage, i) => {
          const cy = (YS[i] + YS[i + 1]) / 2;
          const label = stage.title.toUpperCase();
          const badgeWidth = label.length * 6.5 + 24;

          return (
            <g key={`label-${i}`} pointerEvents="none">
              <rect
                x={420 - badgeWidth / 2}
                y={cy - 12}
                width={badgeWidth}
                height="24"
                rx="12"
                fill="#1E293B"
                fillOpacity="0.85"
                filter={`url(#${prefix}-shadow)`}
              />
              <text
                x="420"
                y={cy + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="600"
                letterSpacing="0.06em"
                className="font-sans"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Axis Headers: Personal (Izquierda) / Profesional (Derecha) */}
      <div className="w-full max-w-[620px] flex justify-between items-center px-6 mt-1 text-xs uppercase tracking-wider font-semibold text-ink-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>Dimensión Personal (5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Dimensión Profesional (5)</span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
};
