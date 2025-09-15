import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Book() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: any };
  const doctor = state?.doctor as {
    id: string;
    name: string;
    specialization: string;
    experience: number;
    availability: string[];
  } | null;

  const [slot, setSlot] = useState<string>(doctor?.availability?.[0] ?? "");
  const [confirmed, setConfirmed] = useState(false);

  const options = useMemo(
    () =>
      (doctor?.availability ?? []).map((iso) => ({
        iso,
        label: new Date(iso).toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    [doctor],
  );

  if (!doctor) {
    return (
      <section className="py-12 md:py-20">
        <div className="container max-w-2xl">
          <p className="mb-4">No doctor selected.</p>
          <Button variant="outline" onClick={() => navigate("/doctors")}>
            Go to Doctors
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-2xl">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          Back
        </Button>
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground mb-2">
          Book appointment
        </h1>
        <p className="text-foreground/70 mb-6">
          {doctor.name} • {doctor.specialization} • {doctor.experience} years
          experience
        </p>

        <div className="rounded-xl border border-border bg-background p-6">
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Choose a time
          </label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2"
          >
            {options.map((o) => (
              <option key={o.iso} value={o.iso}>
                {o.label}
              </option>
            ))}
          </select>

          {!confirmed ? (
            <Button
              className="mt-4"
              disabled={!slot}
              onClick={() => setConfirmed(true)}
            >
              Confirm appointment
            </Button>
          ) : (
            <div className="mt-4 rounded-md border border-border bg-accent p-4">
              <div className="font-medium mb-1">Appointment confirmed</div>
              <div className="text-sm text-foreground/70">
                {doctor.name} on {options.find((o) => o.iso === slot)?.label}
              </div>
              <div className="mt-4">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Go home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
