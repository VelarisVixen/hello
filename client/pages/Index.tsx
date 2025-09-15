import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const heroImg = "https://symptomate.com/_ipx/_/images/illustration-homepage.png";

const aboutTiles = [
  { title: "140,000+ hours of doctors’ work", image: "https://symptomate.com/_ipx/w_1200/images/illu-medical-knowledgebase.png" },
  { title: "23M+ interviews performed", image: "https://symptomate.com/_ipx/w_1200/images/illu-interviews.png" },
  { title: "200,000+ interviews every month", image: "https://symptomate.com/_ipx/w_1200/images/illu-development.png" },
];

const whoCards = [
  { title: "Individuals", bullets: ["5 levels of care recommendations", "simple language and common names", "educational articles"], image: "https://symptomate.com/_ipx/_/images/individuals.png" },
  { title: "Parents", bullets: ["pediatrics conditions", "symptom pair analysis", "body maps of children in different age groups"], image: "https://symptomate.com/_ipx/_/images/parents.png" },
  { title: "Family members", bullets: ["third-person mode", "instructions and explanations"], image: "https://symptomate.com/_ipx/_/images/family-members.png" },
];

const standards = [
  { title: "EU Class I medical device", image: "https://symptomate.com/images/ce-logo.svg" },
  { title: "EU GDPR compliant", image: "https://symptomate.com/images/gdpr.svg" },
  { title: "US HIPAA compliant", image: "https://symptomate.com/images/hipaa.svg" },
  { title: "ISO 13485:2016 QMS", image: "https://symptomate.com/images/iso-tuv.svg" },
];

export default function Index() {
  return (
    <div className="">
      {/* Hero */}
      <section className="relative">
        <div className="container grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[12px] font-semibold text-foreground/80 mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
              beta
            </div>
            <h1 className="text-[40px] leading-[1.1] md:text-[56px] font-serif tracking-tight text-foreground">
              The symptom checker made by doctors for <span className="text-foreground">women</span>
            </h1>
            <ul className="mt-6 space-y-2 text-[17px] text-foreground/80">
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/>Analyze your symptoms</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/>Understand your health</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/>Plan your next steps</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/>Get ready for your visit</li>
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="px-6 py-5 text-[15px] font-semibold">
                <Link to="/interview">Start interview</Link>
              </Button>
              <Button asChild variant="outline" className="px-6 py-5 text-[15px] font-semibold">
                <Link to="/be-first/chat">Try chatbot</Link>
              </Button>
            </div>
          </div>
          <div className="relative max-w-[580px] md:ml-auto">
            <img src={heroImg} alt="Symptomate hero" className="w-full h-auto"/>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24 bg-[#f8f3ee]">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground mb-10">About Symptomate</h2>
          <p className="max-w-3xl text-foreground/80 text-lg">
            Symptomate is a self-service symptom checker made by doctors for anyone looking to understand their symptoms, explore potential causes, receive guidance on next steps, or prepare for a medical appointment.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {aboutTiles.map((t) => (
              <div key={t.title} className="rounded-xl border border-border bg-background p-6">
                <img src={t.image} alt="" className="w-full h-40 object-contain mb-4" />
                <h3 className="font-semibold text-[18px] text-foreground">{t.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground">How does it work?</h2>
          <p className="mt-4 max-w-3xl text-foreground/80 text-lg">Symptomate is very easy to use. Start by adding your symptoms, answer a couple of questions, and you’ll get feedback about what the issue could be and what to do next.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Open Symptomate when you start feeling unwell",
              "Select your risk factors",
              "Add your initial symptoms",
              "Answer some complementary questions",
              "Get the most probable conditions",
              "Analyze your symptoms in just a few minutes",
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-6">
                <div className="text-primary font-semibold mb-2">Step {i + 1}</div>
                <div className="text-[17px] text-foreground/90">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-16 md:py-24 bg-[#e8f2f9]">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground mb-8">Who is this for?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {whoCards.map((c) => (
              <div key={c.title} className="rounded-2xl bg-background p-6 border border-border">
                <img src={c.image} alt="" className="w-full h-40 object-contain mb-4" />
                <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                <ul className="space-y-1 text-foreground/80">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/> {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section className="py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground">Get a symptom checker for your business!</h2>
            <p className="mt-4 text-lg text-foreground/80">Powered by Infermedica, Symptomate is used by healthcare facilities, insurance providers, and other companies to improve online, preliminary symptom assessment and triage processes.</p>
            <div className="mt-6">
              <Button asChild variant="outline" className="px-6 py-5 text-[15px] font-semibold">
                <a href="https://infermedica.com/get-in-touch" target="_blank" rel="noreferrer">Get in touch</a>
              </Button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border">
            <img src="https://symptomate.com/_ipx/_/images/podaj-swoje-objawy.png" alt="Business" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground mb-8">Complies with the highest standards of quality and data security</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {standards.map((s) => (
              <div key={s.title} className="rounded-xl bg-background border border-border p-6 flex items-center justify-center">
                <img src={s.image} alt={s.title} className="h-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12">
        <div className="container">
          <p className="text-sm text-foreground/70 max-w-4xl">Symptomate is a registered Class I medical device in the European Union. It is regulated by the FDA as a general wellness product in the US. Not a licensed medical device in all jurisdictions. It does not provide medical diagnoses.</p>
        </div>
      </section>
    </div>
  );
}
