import { RequestHandler } from "express";
import { z } from "zod";

const Query = z.object({
  lat: z.preprocess(
    (v) => (typeof v === "string" ? parseFloat(v) : v),
    z.number().finite(),
  ),
  lon: z.preprocess(
    (v) => (typeof v === "string" ? parseFloat(v) : v),
    z.number().finite(),
  ),
  radius: z
    .preprocess(
      (v) => (typeof v === "string" ? parseInt(v, 10) : v),
      z.number().int().min(100).max(50000),
    )
    .optional()
    .default(5000),
});

export const handleNearbyHospitals: RequestHandler = async (req, res) => {
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid query", details: parsed.error.flatten() });
  }
  const { lat, lon, radius } = parsed.data as {
    lat: number;
    lon: number;
    radius: number;
  };

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return res.status(501).json({
      error:
        "GOOGLE_MAPS_API_KEY is not configured. Set it as an environment variable and restart the server.",
    });
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
  );
  url.searchParams.set("location", `${lat},${lon}`);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("type", "hospital");
  url.searchParams.set("key", key);

  try {
    const resp = await fetch(url);
    const json = await resp.json();
    if (!resp.ok) {
      return res
        .status(500)
        .json({ error: json?.error_message || "Google Places error" });
    }
    const results = Array.isArray(json.results) ? json.results : [];
    const mapped = results.map((r: any) => ({
      name: r.name as string,
      rating: typeof r.rating === "number" ? r.rating : null,
      userRatingsTotal:
        typeof r.user_ratings_total === "number" ? r.user_ratings_total : null,
      address: r.vicinity as string,
      openNow: r.opening_hours?.open_now ?? null,
      placeId: r.place_id as string,
      lat: r.geometry?.location?.lat ?? null,
      lon: r.geometry?.location?.lng ?? null,
    }));
    return res.json({ hospitals: mapped });
  } catch (e: any) {
    console.error("/api/nearby-hospitals error", e);
    return res
      .status(500)
      .json({ error: e?.message || "Failed to fetch places" });
  }
};
