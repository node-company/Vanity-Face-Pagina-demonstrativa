"use client";

import { useState, useMemo } from "react";

interface LineChartProps {
  labels: string[];
  data: number[];
  bucketDates?: string[];
  /** Cor da linha. Padrão: gold */
  color?: string;
  /** Aria-label descritivo */
  ariaLabel?: string;
  /** Altura visual em px */
  height?: number;
}

const VB_W = 1000;
const VB_H = 280;
const PAD_L = 48;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 38;

export default function LineChart({
  labels,
  data,
  bucketDates,
  color = "#c9a84c",
  ariaLabel,
  height = 280,
}: LineChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const max = useMemo(() => Math.max(1, ...data), [data]);
  const yTicks = useMemo(() => buildYTicks(max), [max]);
  const yMax = yTicks[yTicks.length - 1];

  const innerW = VB_W - PAD_L - PAD_R;
  const innerH = VB_H - PAD_T - PAD_B;

  const n = data.length;
  if (n === 0) {
    return <EmptyChart />;
  }

  const xStep = n === 1 ? 0 : innerW / (n - 1);
  const x = (i: number) => PAD_L + (n === 1 ? innerW / 2 : i * xStep);
  const y = (v: number) => PAD_T + innerH - (v / yMax) * innerH;

  // Path da linha
  const pathD = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");

  // Path da área (linha + base)
  const areaD = `${pathD} L ${x(n - 1).toFixed(1)} ${PAD_T + innerH} L ${x(0).toFixed(1)} ${PAD_T + innerH} Z`;

  // Decide quantos labels mostrar no eixo X (max ~10)
  const labelStep = Math.max(1, Math.ceil(n / 10));

  // Tooltip text
  const tooltip =
    hover !== null
      ? {
          x: x(hover),
          y: y(data[hover]),
          label: labels[hover],
          value: data[hover],
        }
      : null;

  const peakIdx = data.indexOf(Math.max(...data));
  const totalSum = data.reduce((a, b) => a + b, 0);

  return (
    <div className="w-full chart-wrap" style={{ height }} role="img" aria-label={ariaLabel ?? `Gráfico de linha — ${totalSum} no total`}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Grid horizontal + Y axis labels */}
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

        {/* Area fill */}
        <defs>
          <linearGradient id="lc-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lc-area)" className="chart-area" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          className="chart-line"
        />

        {/* Pontos sutis */}
        {data.map((v, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(v)}
            r={hover === i ? 4 : 2.2}
            fill={color}
            className="chart-dot"
          />
        ))}

        {/* Hover overlay invisível */}
        {data.map((_, i) => (
          <rect
            key={`hit-${i}`}
            x={x(i) - xStep / 2}
            y={PAD_T}
            width={xStep || 20}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}

        {/* Tooltip */}
        {tooltip && (
          <g pointerEvents="none">
            <line
              x1={tooltip.x}
              x2={tooltip.x}
              y1={PAD_T}
              y2={PAD_T + innerH}
              stroke={color}
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
            <g
              transform={`translate(${Math.min(VB_W - PAD_R - 130, Math.max(PAD_L, tooltip.x + 8))}, ${Math.max(PAD_T + 8, tooltip.y - 32)})`}
            >
              <rect
                x={0}
                y={0}
                width={130}
                height={42}
                fill="#0b1527"
                stroke={color}
                strokeOpacity={0.5}
              />
              <text x={10} y={17} fontSize={11} fill="rgba(245,240,232,0.65)" className="tabular-nums">
                {tooltip.label}
              </text>
              <text x={10} y={34} fontSize={14} fill="#f5f0e8" fontWeight={600} className="tabular-nums">
                {tooltip.value} {tooltip.value === 1 ? "lead" : "leads"}
              </text>
            </g>
          </g>
        )}
      </svg>

      <p className="mt-2 text-[0.65rem] tracking-widest tabular-nums uppercase text-cream/40">
        Total: {totalSum} · pico em {labels[peakIdx]} ({data[peakIdx]})
      </p>
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
  // Escolhe ticks bonitos (4 intervalos)
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
