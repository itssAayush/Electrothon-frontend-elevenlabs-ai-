import {
  Activity,
  Building2,
  HeartPulse,
  ShieldPlus,
  Users2,
} from "lucide-react";

const participants = [
  {
    label: "Citizens",
    icon: HeartPulse,
  },
  {
    label: "Volunteer networks",
    icon: Users2,
  },
  {
    label: "Hospitals",
    icon: Building2,
  },
  {
    label: "Emergency desks",
    icon: Activity,
  },
  {
    label: "AI health systems",
    icon: ShieldPlus,
  },
];

export default function TrustStrip() {
  return (
    <section className="scroll-mt-28 px-4 pb-8 sm:pb-12" id="ecosystem">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-[#e9e2d8] bg-white/70 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Shared Network
          </p>
          <h2 className="font-display mt-3 text-3xl leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl">
            Built to connect every participant in the care graph.
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {participants.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-[#e8e7e3] bg-[#faf9f6] px-4 py-3 text-sm font-medium text-slate-700"
            >
              <Icon className="h-4 w-4 text-[#5870d8]" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
