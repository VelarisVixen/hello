import React from "react";

interface RiskGaugeProps {
  score: number; // 0-100
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function RiskGauge({ score }: RiskGaugeProps) {
  const value = clamp(Math.round(score), 0, 100);
  const radius = 56;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (value / 100) * circumference;

  const color = value < 33 ? "#10b981" : value < 66 ? "#f59e0b" : "#ef4444"; // green, yellow, red

  return (
    <div className="flex items-center gap-4">
      <svg height={radius * 2} width={radius * 2} className="shrink-0">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.6s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="18"
          fontWeight={700}
          fill="currentColor"
        >
          {value}
        </text>
      </svg>
      <div>
        <div className="text-sm font-medium text-foreground/80">Risk severity</div>
        <div className="text-sm text-foreground/60">{value}/100 — {value < 33 ? "low" : value < 66 ? "moderate" : "high"}</div>
        <div className="flex gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-xs text-foreground/70"><span className="h-2 w-2 rounded-full" style={{background:'#10b981'}}></span>low</span>
          <span className="inline-flex items-center gap-1 text-xs text-foreground/70"><span className="h-2 w-2 rounded-full" style={{background:'#f59e0b'}}></span>moderate</span>
          <span className="inline-flex items-center gap-1 text-xs text-foreground/70"><span className="h-2 w-2 rounded-full" style={{background:'#ef4444'}}></span>high</span>
        </div>
      </div>
    </div>
  );
}
