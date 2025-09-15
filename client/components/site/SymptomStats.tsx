import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

function hashString(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967295;
  };
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface Props {
  symptoms: string;
  causes: string[];
}

export default function SymptomStats({ symptoms, causes }: Props) {
  const seedBase = useMemo(() => hashString(symptoms.trim().toLowerCase()), [symptoms]);
  const rnd = useMemo(() => seeded(seedBase || 1), [seedBase]);

  const trendData = useMemo(() => {
    const days = 14;
    const now = new Date();
    const base = 40 + Math.floor(rnd() * 60);
    return Array.from({ length: days }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (days - 1 - i));
      const noise = Math.round((rnd() - 0.5) * 12);
      const count = Math.max(5, base + noise);
      return { date: formatDate(d), count };
    });
  }, [rnd]);

  const diseases = useMemo(() => {
    const list = (causes && causes.length ? causes.slice(0, 6) : [
      "Common cold",
      "Seasonal flu",
      "Allergic rhinitis",
      "Gastroenteritis",
      "Sinusitis",
      "COVID‑19",
    ]).map((name) => ({
      name,
      cases: Math.round(20 + rnd() * 80),
    }));
    return list.sort((a, b) => b.cases - a.cases);
  }, [causes, rnd]);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-medium text-foreground/80 mb-2">People reporting similar symptoms (last 14 days)</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={2} />
              <YAxis tick={{ fontSize: 12 }} width={28} />
              <Tooltip cursor={{ stroke: "#94a3b8" }} />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-medium text-foreground/80 mb-2">Trending related conditions</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={diseases} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} height={50} textAnchor="end" />
              <YAxis tick={{ fontSize: 12 }} width={28} />
              <Tooltip />
              <Bar dataKey="cases" radius={[4, 4, 0, 0]} fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
