import {
  Activity,
  ArrowUpRight,
  Mail,
  ShieldPlus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const productLinks = [
  {
    label: "Platform",
    href: "/#platform",
  },
  {
    label: "Network",
    href: "/#network",
  },
  {
    label: "Experience MedConnect",
    href: "/app",
  },
];

const solutionLinks = [
  {
    label: "Emergency intelligence",
    href: "/#platform",
  },
  {
    label: "Healthcare workflows",
    href: "/#network",
  },
  {
    label: "AI care assistant",
    href: "/app",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#e7e0d7] bg-[#f3efe8] px-4 pb-10 pt-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f172a] text-white shadow-[0_10px_28px_rgba(15,23,42,0.22)]">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-slate-950">
                  MedConnect
                </div>
                <div className="text-xs uppercase tracking-[0.26em] text-slate-500">
                  Healthcare AI Platform
                </div>
              </div>
            </div>

            <p className="max-w-md text-base leading-8 text-slate-600">
              MedConnect is an AI-powered emergency response and healthcare
              intelligence platform connecting citizens, volunteers, hospitals,
              and health systems in one coordinated network.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5dfd5] bg-white/70 px-4 py-2 text-sm font-medium text-slate-700">
              <ShieldPlus className="h-4 w-4 text-[#5b6ee1]" />
              Secure, human-supervised AI workflows
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Product
            </h3>
            <div className="mt-5 space-y-3">
              {productLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-base text-slate-700 transition-colors hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Solutions
            </h3>
            <div className="mt-5 space-y-3">
              {solutionLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-base text-slate-700 transition-colors hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Contact
            </h3>
            <div className="mt-5 space-y-4">
              <a
                href="mailto:enterprise@medconnect.ai"
                className="flex items-center gap-3 text-base text-slate-700 transition-colors hover:text-slate-950"
              >
                <Mail className="h-4 w-4 text-[#5b6ee1]" />
                enterprise@medconnect.ai
              </a>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full border border-[#e5dfd5] bg-white/75 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
              >
                Open live experience
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef3ff] px-4 py-2 text-sm font-medium text-[#4660d2]">
                <Sparkles className="h-4 w-4" />
                AI healthcare intelligence
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#e1dbd1] pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MedConnect. All rights reserved.</p>
          <p className="max-w-2xl">
            For active medical emergencies, contact your local emergency
            services or the nearest hospital directly.
          </p>
        </div>
      </div>
    </footer>
  );
}
