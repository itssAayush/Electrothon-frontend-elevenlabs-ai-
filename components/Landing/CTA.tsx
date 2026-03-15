import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="scroll-mt-28 px-4 pb-24 pt-8" id="contact">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#111827] px-6 py-12 text-white shadow-[0_32px_90px_rgba(15,23,42,0.22)] sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-x-[-10%] top-[-10rem] h-72 bg-[radial-gradient(circle_at_top,rgba(255,177,108,0.34),transparent_46%)]" />
        <div className="pointer-events-none absolute right-[-8%] top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(120,148,255,0.28),transparent_62%)] blur-2xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Get Started
            </p>
            <h2 className="font-display mt-4 text-4xl leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              Bring emergency response, hospitals, volunteers, and AI into one
              operating layer.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
              Launch MedConnect as a citizen-facing assistant, dispatch command
              center, or secure healthcare intelligence stack without changing
              your existing operational systems.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-14 rounded-full bg-white px-7 text-base font-medium text-slate-950 hover:bg-[#f7f4ed]"
            >
              <Link href="/app">
                Experience MedConnect
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-white/20 bg-white/5 px-7 text-base font-medium text-white hover:bg-white/10"
            >
              <Link href="/hospitals">
                Find Hospitals Near You
                <MapPin className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-10 flex flex-wrap gap-3">
          {[
            "AI-assisted emergency triage",
            "Volunteer and responder coordination",
            "Hospital capacity intelligence",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white/80"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
