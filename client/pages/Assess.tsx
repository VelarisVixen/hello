import { useState } from "react";
import { Button } from "@/components/ui/button";

type Coords = { lat: number; lon: number; accuracy?: number; address?: string };

export default function Assess() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState("female");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locStatus, setLocStatus] = useState<string>("Location not requested");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [causes, setCauses] = useState<string[]>([]);
  const [remedies, setRemedies] = useState<string[]>([]);
  const [care, setCare] = useState<string[]>([]);

  const requestLocation = async (): Promise<Coords | null> => {
    if (!("geolocation" in navigator)) {
      setLocStatus("Geolocation not supported");
      return null;
    }
    setLocStatus("Requesting permission...");
    return await new Promise<Coords | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const c: Coords = {
            lat: latitude,
            lon: longitude,
            accuracy,
          };
          setCoords(c);
          setLocStatus("Location captured");
          resolve(c);
        },
        (err) => {
          setLocStatus(err.message || "Location denied");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSeverity(null);
    try {
      let loc = coords;
      if (!loc) {
        try {
          loc = await requestLocation();
        } catch {}
      }
      const apiUrl = window.location.origin + "/api/assess";
      let res: Response;
      try {
        res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            symptoms,
            age: age ? Number(age) : undefined,
            sex,
            location: loc ?? undefined,
          }),
        });
      } catch (networkErr: any) {
        throw new Error(
          "Network error: failed to reach the server. " +
            (networkErr?.message || ""),
        );
      }

      // Read response safely: clone once to capture raw text for logging/parsing
      let rawText: string | undefined;
      try {
        const cloned = res.clone();
        rawText = await cloned.text();
      } catch (e) {
        // cloning or reading clone may fail in rare cases; leave rawText undefined
      }

      let data: any = null;
      try {
        // Prefer structured JSON when possible
        data = await res.json();
      } catch (e) {
        // Fallback to parsing rawText if json() failed
        if (rawText) {
          try {
            data = JSON.parse(rawText);
          } catch {
            data = { error: rawText };
          }
        } else {
          data = { error: 'Failed to read response body' };
        }
      }

      if (!res.ok) {
        const serverMessage = data?.error || `${res.status} ${res.statusText}`;
        throw new Error(serverMessage);
      }

      setAnalysis(data.analysis ?? null);
      if (typeof data.riskScore === "number") setSeverity(data.riskScore);
      else if (typeof data.severity === "number") setSeverity(data.severity);
      if (data.disclaimer) setDisclaimer(data.disclaimer);
      setCauses(Array.isArray(data.causes) ? data.causes : []);
      setRemedies(
        Array.isArray(data.remedies)
          ? data.remedies
          : Array.isArray(data.cure)
            ? data.cure
            : [],
      );
      setCare(Array.isArray(data.care) ? data.care : []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground mb-2">
          Start assessing
        </h1>
        <p className="text-foreground/70 mb-8">
          We use your approximate location to tailor guidance (e.g., seasonal
          illnesses). You can still continue without it.
        </p>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="text-sm text-foreground/70">
            {coords
              ? `📍 ${coords.address ?? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`}`
              : locStatus}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={requestLocation}
            className="border-primary text-primary hover:bg-primary/5 px-3 py-2 h-auto"
          >
            Share location
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Your symptoms
            </label>
            <textarea
              required
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., sore throat, mild fever for 2 days, dry cough, headache"
              className="w-full min-h-[160px] rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Age
              </label>
              <input
                type="number"
                min={0}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 34"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Sex
              </label>
              <div className="flex gap-2">
                {(["female", "male", "other"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`px-3 py-2 rounded-md border ${sex === s ? "border-primary text-primary bg-primary/5" : "border-border text-foreground/80 hover:bg-accent"}`}
                  >
                    {s[0].toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || !symptoms.trim()}
              className="px-6 py-5 text-[15px] font-semibold"
            >
              {loading ? "Analyzing…" : "Start assessing"}
            </Button>
          </div>
        </form>

        {severity !== null && (
          <div className="mt-8">
            <div className="mb-2 text-sm font-medium text-foreground/80">
              Severity score
            </div>
            <div className="h-3 w-full rounded-full bg-accent">
              <div
                className="h-3 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, Math.max(0, severity))}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-foreground/60">
              {severity}/100 (0=mild, 100=critical)
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {(analysis || causes.length || remedies.length || care.length) && (
          <div className="mt-8 rounded-xl border border-border bg-background p-6">
            <h2 className="text-xl font-semibold mb-3">Preliminary analysis</h2>
            {analysis && (
              <div
                className="prose prose-slate max-w-none mb-6"
                dangerouslySetInnerHTML={{
                  __html: analysis.replace(/\n/g, "<br/>"),
                }}
              />
            )}
            {causes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Relevant causes</h3>
                <ul className="list-disc pl-5 space-y-1 text-foreground/90">
                  {causes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {remedies.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Remedies and care</h3>
                <ul className="list-disc pl-5 space-y-1 text-foreground/90">
                  {remedies.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {care.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold mb-2">
                  When to seek medical help
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-foreground/90">
                  {care.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {disclaimer && (
              <p className="mt-4 text-sm text-foreground/60">{disclaimer}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
