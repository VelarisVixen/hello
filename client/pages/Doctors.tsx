import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: number; // years
  availability: string[]; // ISO times or labels
};

function hash(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967295;
  };
}

function deriveSpecialization(
  causes: string[],
  analysis: string | null,
  severity: number | null,
) {
  const hay = `${(analysis || "").toLowerCase()} ${causes.join(" ").toLowerCase()}`;
  const has = (k: string) => hay.includes(k);
  if (has("asthma") || has("respiratory") || has("wheeze") || has("cough"))
    return "Pulmonologist";
  if (has("covid") || has("infection") || has("fever") || has("flu"))
    return "Infectious Disease";
  if (
    has("chest pain") ||
    has("cardio") ||
    has("hypertension") ||
    has("palpitations")
  )
    return "Cardiologist";
  if (has("abdominal") || has("nausea") || has("vomit") || has("diarrhea"))
    return "Gastroenterologist";
  if (has("headache") || has("migraine") || has("seizure") || has("numbness"))
    return "Neurologist";
  if (has("throat") || has("ear") || has("sinus")) return "Otolaryngologist";
  if (has("rash") || has("itch") || has("skin")) return "Dermatologist";
  if (has("pelvic") || has("period") || has("pregnan") || has("gyne"))
    return "Gynecologist";
  if (has("urinary") || has("urination") || has("kidney")) return "Urologist";
  if ((severity ?? 0) >= 70 && (has("breath") || has("chest")))
    return "Emergency Medicine";
  return "Primary Care Physician";
}

function generateDoctors(spec: string, seedKey: string): Doctor[] {
  const r = rand(hash(`${spec}|${seedKey}`) || 1);
  const firstNames = [
    "Ava",
    "Olivia",
    "Emma",
    "Sophia",
    "Mia",
    "Liam",
    "Noah",
    "Ethan",
    "Oliver",
    "Elijah",
    "Isabella",
    "Charlotte",
    "Amelia",
    "Harper",
    "Evelyn",
    "James",
    "Benjamin",
    "Lucas",
    "Henry",
    "Alexander",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
  ];
  const n = 6;
  const today = new Date();
  const slots = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + Math.floor(i / 2));
    const hour = [9, 11, 14, 16][i % 4];
    d.setHours(hour, [0, 30][i % 2], 0, 0);
    return d.toISOString();
  });
  return Array.from({ length: n }).map(() => {
    const name = `${firstNames[Math.floor(r() * firstNames.length)]} ${lastNames[Math.floor(r() * lastNames.length)]}, MD`;
    const exp = 4 + Math.floor(r() * 27);
    const start = Math.floor(r() * 6);
    const av = slots.slice(start, start + 5);
    return {
      id: `${spec}-${name}-${exp}`,
      name,
      specialization: spec,
      experience: exp,
      availability: av,
    };
  });
}

function fmtSlot(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Doctors() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: any };
  const analysis: string | null = state?.analysis ?? null;
  const causes: string[] = state?.causes ?? [];
  const severity: number | null = state?.severity ?? null;
  const symptoms: string = state?.symptoms ?? "";

  const specialization = useMemo(
    () => deriveSpecialization(causes, analysis, severity),
    [analysis, causes, severity],
  );
  const [doctors] = useState(() =>
    generateDoctors(specialization, symptoms || analysis || specialization),
  );

  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground">
            Doctors
          </h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        <p className="text-foreground/70 mb-6">
          Showing specialists based on your symptoms:{" "}
          <span className="font-medium">{specialization}</span>
        </p>

        <ul className="grid gap-4">
          {doctors.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{d.name}</div>
                  <div className="text-sm text-foreground/70">
                    {d.specialization} • {d.experience} years experience
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {d.availability.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 rounded-md border border-border text-xs text-foreground/80"
                    >
                      {fmtSlot(s)}
                    </span>
                  ))}
                </div>
                <div className="shrink-0">
                  <Button
                    onClick={() => navigate("/book", { state: { doctor: d } })}
                  >
                    Select Doctor
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
