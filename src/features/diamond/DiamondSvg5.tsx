import React from 'react';
import { CANONICAL_STAGES, isValidNarrative } from '../../domain/constants';
import { ProfDiamondVersion } from '../../types/domain';

interface DiamondSvg5Props {
  version: ProfDiamondVersion | null;
  selectedIndex?: number;
  onSelectFacet?: (index: number) => void;
  readOnly?: boolean;
  className?: string;
}

const STAGE_ACTIVE_COLORS = [
  '#00685F', // 0: Aspiración ganadora
  '#0D9488', // 1: Dónde jugar
  '#14B8A6', // 2: Cómo ganar
  '#2DD4BF', // 3: Con qué capacidades
  '#0284C7', // 4: Sistemas de gestión
];

// Coordinates for the 5 cascading facets forming the strategic gem
const FACET_POLYGONS = [
  // 0: Aspiración ganadora (Cúspide triangular superior)
  '420,60 500,135 340,135',
  // 1: Dónde jugar (Trapecio superior)
  '340,135 500,135 580,210 260,210',
  // 2: Cómo ganar (Corazón del diamante, cintura ancha)
  '260,210 580,210 640,285 200,285',
  // 3: Con qué capacidades (Trapecio inferior)
  '200,285 640,285 550,380 290,380',
  // 4: Sistemas de gestión (Vértice inferior cónico)
  '290,380 550,380 420,480'
];

// Label anchor Y positions for each stage
const LABEL_CENTERS = [
  { x: 420, y: 110 },
  { x: 420, y: 175 },
  { x: 420, y: 250 },
  { x: 420, y: 335 },
  { x: 420, y: 430 }
];

export const DiamondSvg5: React.FC<DiamondSvg5Props> = ({
  version,
  selectedIndex,
  onSelectFacet,
  readOnly = false,
  className = ''
}) => {
  const answers = version?.professionalAnswers || [];
  const activeCount = answers.filter(isValidNarrative).length;
  const prefix = React.useId();

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* SVG Container */}
      <svg
        viewBox="140 25 560 485"
        className="w-full max-w-[580px] h-auto drop-shadow-sm transition-all duration-300"
        aria-label={`Diamante estratégico profesional de cinco facetas. ${activeCount} de 5 decisiones completas.`}
        role="img"
      >
        <defs>
          <radialGradient id={`${prefix}-halo`}>
            <stop stopColor="#0D9488" stopOpacity={activeCount > 0 ? "0.20" : "0.06"} />
            <stop offset="1" stopColor="#0D9488" stopOpacity="0" />
          </radialGradient>
          <filter id={`${prefix}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1E293B" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Ambient Halo */}
        <ellipse cx="420" cy="270" rx="270" ry="220" fill={`url(#${prefix}-halo)`} />

        {/* Outer Base Silhouette */}
        <path
          d="M420 60 L500 135 L580 210 L640 285 L550 380 L420 480 L290 380 L200 285 L260 210 L340 135 Z"
          fill="#FFFFFF"
          stroke="#E9E6DF"
          strokeWidth="2"
        />

        {/* Render 5 Cascading Facets */}
        {CANONICAL_STAGES.map((stage, i) => {
          const isAnswered = isValidNarrative(answers[i]);
          const isSelected = selectedIndex === i;
          const points = FACET_POLYGONS[i];
          const center = LABEL_CENTERS[i];

          // Fill color
          let fillColor = '#F7F5F0'; // Default empty
          if (isAnswered) {
            fillColor = STAGE_ACTIVE_COLORS[i];
          }

          return (
            <g 
              key={`facet-${i}`} 
              className={`group ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !readOnly && onSelectFacet && onSelectFacet(i)}
              tabIndex={readOnly ? -1 : 0}
              role="button"
              aria-label={`Decisión ${i + 1}: ${stage.title}. ${isAnswered ? 'Completada' : 'Pendiente'}`}
              onKeyDown={e => {
                if (!readOnly && onSelectFacet && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectFacet(i);
                }
              }}
            >
              <polygon
                points={points}
                fill={fillColor}
                fillOpacity={isAnswered ? 0.94 : 0.65}
                stroke={isSelected ? '#00685F' : '#E9E6DF'}
                strokeWidth={isSelected ? 3.5 : 1.5}
                className="transition-all duration-300 group-hover:filter group-hover:brightness-105"
                filter={isSelected ? `url(#${prefix}-shadow)` : undefined}
              />

              {/* Number and Stage Label in Facet Center */}
              <text
                x={center.x}
                y={center.y - 2}
                textAnchor="middle"
                fontSize={i === 0 ? "11" : "12"}
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill={isAnswered ? '#FFFFFF' : '#1E293B'}
                className="pointer-events-none tracking-wide"
              >
                {i + 1}. {stage.title.toUpperCase()}
              </text>

              {/* Status Indicator text / icon */}
              <text
                x={center.x}
                y={center.y + 13}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill={isAnswered ? 'rgba(255,255,255,0.92)' : '#64748B'}
                className="pointer-events-none"
              >
                {isAnswered ? '✓ Completada' : 'Pendiente'}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Accessible Non-Color Status Bar below SVG */}
      <div className="mt-3 flex items-center gap-2 text-xs font-sans text-ink-muted">
        <span className="font-semibold text-ink">Decisiones Estratégicas:</span>
        <span className="font-mono bg-canvas-subtle px-2 py-0.5 rounded border border-border-subtle font-bold text-primary">
          {activeCount} de 5
        </span>
        <span>iluminadas en tiempo real</span>
      </div>
    </div>
  );
};
