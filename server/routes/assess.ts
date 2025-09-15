import { RequestHandler } from "express";
import { z } from "zod";

const Body = z.object({
  symptoms: z.string().min(5),
  age: z.number().int().min(0).max(120).optional(),
  sex: z.enum(["female", "male", "other"]).optional(),
  location: z
    .object({ lat: z.number(), lon: z.number(), accuracy: z.number().optional(), address: z.string().optional() })
    .optional(),
});

export const handleAssess: RequestHandler = async (req, res) => {
  const parse = Body.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request", details: parse.error.flatten() });
  }
  const { symptoms, age, sex, location } = parse.data;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured. Set it in environment variables and restart the server." });
  }

  const prompt = `You are a cautious medical assistant. Return a STRICT JSON object with the exact keys:\n{\n  "analysisHtml": string,\n  "causes": string[],\n  "remedies": string[],\n  "care": string[],\n  "riskScore": number,\n  "disclaimer": string\n}\nRules:\n- analysisHtml: concise HTML with sections for causes, remedies/self‑care, and when to seek care.\n- riskScore: integer 0–100 (0=mild, 100=critical).\n- remedies: actionable home care or OTC guidance when appropriate.\n- care: red‑flag actions and when to see a clinician.\n- Use clear, non-diagnostic language.\n- Output ONLY the JSON.\n\nUser info: ${age?`Age: ${age}. `:""}${sex?`Sex: ${sex}. `:""}${location?`Location: lat ${location.lat}, lon ${location.lon}${location.address?`, address ${location.address}`:""}. `:""}Symptoms: ${symptoms}`;

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }]}]
      }),
    });

    const json = await resp.json();
    if (!resp.ok) {
      return res.status(500).json({ error: json.error?.message || "Gemini error" });
    }

    const text: string | undefined = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: "No response from model" });

    const tryParse = (t: string) => {
      try { return JSON.parse(t); } catch {
        const match = t.match(/\{[\s\S]*\}/m);
        if (match) { try { return JSON.parse(match[0]); } catch {} }
        return null;
      }
    };

    const parsed = tryParse(text);
    if (parsed) {
      return res.json({
        analysis: parsed.analysisHtml ?? null,
        causes: parsed.causes ?? [],
        remedies: parsed.remedies ?? parsed.cure ?? [],
        care: parsed.care ?? parsed.whenToSeekCare ?? [],
        riskScore: parsed.riskScore ?? parsed.severityScore ?? null,
        disclaimer: parsed.disclaimer ?? "This is not a diagnosis. Consult a healthcare professional.",
      });
    }
    return res.json({
      analysis: text,
      causes: [],
      remedies: [],
      care: [],
      riskScore: null,
      disclaimer: "This is not a diagnosis. Consult a healthcare professional.",
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Internal error" });
  }
};
