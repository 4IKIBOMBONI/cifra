import { useEffect, useState } from 'react';

interface SkillData {
  label: string;
  value: number; // 0-100
  color?: string;
}

interface Props {
  skills: SkillData[];
  size?: number;
}

export function SkillRadarChart({ skills, size = 250 }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = 4;
  const angleStep = (2 * Math.PI) / skills.length;

  // Get point position on the radar
  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Grid lines (concentric polygons)
  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const levelRadius = ((level + 1) / levels) * radius;
    return skills.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
    }).join(' ');
  });

  // Data polygon
  const dataPoints = skills.map((s, i) => {
    const val = animated ? s.value : 0;
    const point = getPoint(i, val);
    return `${point.x},${point.y}`;
  }).join(' ');

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid levels */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgb(var(--color-border))"
            strokeWidth={i === levels - 1 ? 1.5 : 0.5}
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {skills.map((_, i) => {
          const point = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgb(var(--color-border))"
              strokeWidth={0.5}
              opacity={0.4}
            />
          );
        })}

        {/* Data area */}
        <polygon
          points={dataPoints}
          fill="url(#radarGradient)"
          stroke="rgb(var(--color-primary))"
          strokeWidth={2}
          className="transition-all duration-1000 ease-out"
          opacity={0.85}
        />

        {/* Data points */}
        {skills.map((s, i) => {
          const val = animated ? s.value : 0;
          const point = getPoint(i, val);
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="rgb(var(--color-primary))"
              stroke="rgb(var(--color-surface))"
              strokeWidth={2}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}

        {/* Labels */}
        {skills.map((s, i) => {
          const point = getPoint(i, 125);
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-text-secondary text-[10px] font-medium"
              style={{ fill: 'rgb(var(--color-text-secondary))' }}
            >
              {s.label}
            </text>
          );
        })}

        {/* Gradient def */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(var(--color-secondary, var(--color-primary)))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
