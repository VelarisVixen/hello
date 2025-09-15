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

  const prompt = `You are a cautious medical assistant. Return a STRICT JSON object with keys: \n{"analysisHtml": string, "severityScore": number, "disclaimer": string}.\n- analysisHtml: well-structured HTML (ul/ol, p, strong) covering: top 3-5 possible causes (lay language), red-flag warnings, suggested next steps/self-care, what to tell a clinician.\n- severityScore: integer 0-100 where 0=mild, 100=critical, derived from symptoms and red-flags.\n- disclaimer: short sentence that this is not a diagnosis.\nDO NOT include any text before or after the JSON.\n\nUser info: ${age?`Age: ${age}. `:""}${sex?`Sex: ${sex}. `:""}${location?`Location: lat ${location.lat}, lon ${location.lon}${location.address?`, address ${location.address}`:""}. `:""}Symptoms: ${symptoms}`;

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }]}],
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUAL", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      }),
    });

    const json = await resp.json();
    if (!resp.ok) {
      return res.status(500).json({ error: json.error?.message || "Gemini error" });
    }

    const text: string | undefined = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: "No response from model" });

    try {
      const parsed = JSON.parse(text);
      return res.json({ analysis: parsed.analysisHtml, severity: parsed.severityScore, disclaimer: parsed.disclaimer });
    } catch {
      return res.json({ analysis: text, severity: null, disclaimer: "This is not a diagnosis. Consult a healthcare professional." });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Internal error" });
  }
};
