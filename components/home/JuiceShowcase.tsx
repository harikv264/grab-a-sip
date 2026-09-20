import { JuiceGlass } from "@/components/JuiceGlass";
import { Reveal } from "@/components/Reveal";

const GLASSES = [
  { name: "Small Sip Bowl", pct: 65, color: "#FFC542", garnish: "#FF6B2C", note: "17 of 26 this month" },
  { name: "ABC Everyday", pct: 88, color: "#FF3E9A", garnish: "#A855F7", note: "23 of 26 this month" },
  { name: "Classic Plan", pct: 42, color: "#38F5C9", garnish: "#C6FF4F", note: "11 of 26 this month" },
];

export function JuiceShowcase() {
  return (
    <section className="section py-24 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="chip">🥤 Your month, visualized</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            Watch your glass <span className="gradient-text">fill up</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted">
            Every subscriber gets a living glass in the app. Each fresh delivery
            tops it up a little more — so your whole month of goodness is right
            there, one satisfying sip at a time.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {GLASSES.map((g, i) => (
          <Reveal key={g.name} delay={(i % 3) * 0.1}>
            <div className="flex flex-col items-center rounded-4xl glass p-8">
              <JuiceGlass pct={g.pct} color={g.color} garnishColor={g.garnish} size={140} showPct />
              <h3 className="mt-4 text-lg font-bold">{g.name}</h3>
              <p className="text-sm text-muted">{g.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
