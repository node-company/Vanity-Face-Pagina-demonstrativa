"use client";

import { useMemo, useState } from "react";

interface Series {
  key: string;
  label: string;
  data: number[];
}

interface MultiLineChartProps {
  labels: string[];
  series: Series[];
  ariaLabel?: string;
  height?: number;
}

const VB_W = 1000;
const VB_H = 320;
const PAD_L = 48;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 38;

// Paleta com 6 hues distintos (não só variações de gold) — mantém aspecto
// premium/desaturado pra combinar com o navy/cream do site, mas cada cor
// é claramente distinguível das demais.
const PALETTE = [
  "#c9a84c", // gold (signature)
  "#7aa3c4", // steel blue
  "#c4866b", // terracotta
  "#8eb09a", // sage
  "#b88aa8", // dusty mauve
  "#d8c29b", // soft gold (mais claro, longe do gold puro)
];

export default function MultiLineChart({
  labels,
  series,
  ariaLabel,
  height = 320,
}: MultiLineChartProps) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const visible = series.filter((s) => !hidden.has(s.key));

  const max = useMemo(() => {
    let m = 1;
    visible.forEach((s) => {
      s.data.forEach((v) => {
        if (v > m) m = v;
      });
    });
    return m;
  }, [visible]);
  const yTicks = useMemo(() => buildYTicks(max), [max]);
  const yMax = yTicks[yTicks.length - 1];

  const innerW = VB_W - PAD_L - PAD_R;
  const innerH = VB_H - PAD_T - PAD_B;

  const n = labels.length;
  if (n === 0 || series.length === 0) {
    return <EmptyChart />;
  }

  const xStep = n === 1 ? 0 : innerW / (n - 1);
  const x = (i: number) => PAD_L + (n === 1 ? innerW / 2 : i * xStep);
  const y = (v: number) => PAD_T + innerH - (v / yMax) * innerH;

  const labelStep = Math.max(1, Math.ceil(n / 10));

  function toggle(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="w-full chart-wrap" role="img" aria-label={ariaLabel ?? "Gráfico multi-linha"}>
      {/* Legenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 chart-legend">
        {series.map((s, idx) => {
          const color = PALETTE[idx % PALETTE.length];
          const isHidden = hidden.has(s.key);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              aria-pressed={!isHidden}
              className={`inline-flex items-center gap-2 text-[0.7rem] tracking-[0.18em] uppercase transition-opacity ${
                isHidden ? "opacity-30 line-through" : "opacity-100"
              } hover:opacity-80`}
            >
              <span
                aria-hidden
                className="inline-block w-3 h-[3px]"
                style={{ background: color }}
              />
              <span className="text-cream/75">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ height }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid + Y axis */}
          {yTicks.map((tick) => {
            const yy = y(tick);
            return (
              <g key={tick}>
                <line
                  x1={PAD_L}
                  x2={VB_W - PAD_R}
                  y1={yy}
                  y2={yy}
                  stroke="rgba(245,240,232,0.08)"
                  strokeWidth={1}
                  className="chart-grid"
                />
                <text
                  x={PAD_L - 8}
                  y={yy + 4}
                  fontSize={11}
                  textAnchor="end"
                  fill="rgba(245,240,232,0.45)"
                  className="chart-axis-text tabular-nums"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {labels.map((lbl, i) => {
            if (i % labelStep !== 0 && i !== n - 1) return null;
            return (
              <text
                key={i}
                x={x(i)}
                y={VB_H - 12}
                fontSize={11}
                textAnchor="middle"
                fill="rgba(245,240,232,0.55)"
                className="chart-axis-text tabular-nums"
              >
                {lbl}
              </text>
            );
          })}

          {/* Linhas */}
          {series.map((s, idx) => {
            if (hidden.has(s.key)) return null;
            const color = PALETTE[idx % PALETTE.length];
            const pathD = s.data
              .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
              .join(" ");
            return (
              <g key={s.key}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="chart-line"
                />
                {/* Pontos */}
                {s.data.map((v, i) => (
                  <circle
                    key={i}
                    cx={x(i)}
                    cy={y(v)}
                    r={hoverIdx === i ? 3.4 : 1.8}
                    fill={color}
                    className="chart-dot"
                  />
                ))}
              </g>
            );
          })}

          {/* Cursor vertical no hover */}
          {hoverIdx !== null && (
            <line
              x1={x(hoverIdx)}
              x2={x(hoverIdx)}
              y1={PAD_T}
              y2={PAD_T + innerH}
              stroke="rgba(245,240,232,0.25)"
              strokeDasharray="3 3"
              pointerEvents="none"
            />
          )}

          {/* Hit areas */}
          {labels.map((_, i) => (
            <rect
              key={`hit-${i}`}
              x={x(i) - xStep / 2}
              y={PAD_T}
              width={xStep || 20}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          ))}
        </svg>
      </div>

      {/* Tooltip lateral (HTML, fora do SVG, melhor pra layout) */}
      {hoverIdx !== null && (
        <div className="mt-3 px-3 py-2 border border-cream/10 bg-navy chart-tooltip-html inline-block">
          <p className="eyebrow text-cream/55 mb-1 tabular-nums">{labels[hoverIdx]}</p>
          <ul className="space-y-0.5">
            {visible.map((s, idx) => {
              // calcula índice original de cor (na lista completa)
              const origIdx = series.findIndex((x) => x.key === s.key);
              const color = PALETTE[origIdx % PALETTE.length];
              return (
                <li
                  key={s.key}
                  className="flex items-center gap-3 text-xs"
                >
                  <span aria-hidden className="inline-block w-2.5 h-[3px]" style={{ background: color }} />
                  <span className="text-cream/65 flex-1">{s.label}</span>
                  <span className="text-cream tabular-nums font-medium">{s.data[hoverIdx]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="w-full h-40 flex items-center justify-center border border-dashed border-cream/15">
      <p className="italic-soft text-cream/45 text-sm">Sem dados no período.</p>
    </div>
  );
}

function buildYTicks(max: number): number[] {
  const targetTicks = 4;
  const rawStep = max / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(1, rawStep))));
  const norm = rawStep / magnitude;
  let step: number;
  if (norm <= 1) step = 1 * magnitude;
  else if (norm <= 2) step = 2 * magnitude;
  else if (norm <= 5) step = 5 * magnitude;
  else step = 10 * magnitude;

  const ticks: number[] = [];
  for (let v = 0; v <= max + step / 2; v += step) {
    ticks.push(Math.round(v));
  }
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}
