import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Assess() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState("female");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, age: age ? Number(age) : undefined, sex }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to analyze");
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground mb-2">Start assessing</h1>
        <p className="text-foreground/70 mb-8">Describe your symptoms in your own words and get an AI-generated overview of possible causes and next steps. This is not a diagnosis.</p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Your symptoms</label>
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
              <label className="block text-sm font-medium text-foreground/80 mb-2">Age</label>
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
              <label className="block text-sm font-medium text-foreground/80 mb-2">Sex</label>
              <div className="flex gap-2">
                {(["female","male","other"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`px-3 py-2 rounded-md border ${sex===s?"border-primary text-primary bg-primary/5":"border-border text-foreground/80 hover:bg-accent"}`}
                  >
                    {s[0].toUpperCase()+s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} className="px-6 py-5 text-[15px] font-semibold">
              {loading ? "Analyzing..." : "Start assessing"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-8 rounded-xl border border-border bg-background p-6">
            <h2 className="text-xl font-semibold mb-3">Preliminary analysis</h2>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, "<br/>") }} />
          </div>
        )}
      </div>
    </section>
  );
}
