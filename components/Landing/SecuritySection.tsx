import {
  Building2,
  Cloud,
  LockKeyhole,
  MapPinned,
  ScanSearch,
  ServerCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const assurances: Array<{
  title: string;
  icon: LucideIcon;
}> = [
  {
    title: "Encrypted by default",
    icon: LockKeyhole,
  },
  {
    title: "Audit-ready operations",
    icon: ScanSearch,
  },
  {
    title: "Regional data controls",
    icon: MapPinned,
  },
];

const deployments: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Managed cloud",
    description:
      "Deploy quickly with a secure cloud control plane designed for high-volume emergency and care workflows.",
    icon: Cloud,
  },
  {
    title: "Private network",
    description:
      "Run MedConnect inside your VPC or protected health environment while preserving operational observability.",
    icon: ServerCog,
  },
  {
    title: "Hybrid hospital edge",
    description:
      "Keep sensitive workloads and integrations close to hospitals, command centers, or public sector infrastructure.",
    icon: Building2,
  },
];

export default function SecuritySection() {
  return (
    <section className="scroll-mt-28 px-4 py-20 sm:py-28" id="security">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center gap-6">
          {assurances.map(({ title, icon: Icon }) => (
            <div
              key={title}
              className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.86),rgba(220,230,255,0.92))] text-center shadow-[0_18px_45px_rgba(35,43,73,0.08)] ring-1 ring-white/70"
            >
              <Icon className="h-8 w-8 text-slate-700" />
              <p className="mt-4 max-w-[8rem] text-xl font-semibold leading-tight tracking-tight text-slate-900">
                {title}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Deployment
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Built to run wherever healthcare operations run.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {deployments.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[1.9rem] border border-[#ebe5db] bg-white/85 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.8),rgba(210,224,255,0.95))] text-[#5b6ee1] shadow-[0_12px_30px_rgba(91,110,225,0.12)]">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                {title}
              </h3>
              <p className="mt-3 text-lg leading-8 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
