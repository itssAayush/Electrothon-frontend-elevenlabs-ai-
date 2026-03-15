"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Building2,
  ShieldCheck,
  Siren,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const pillars: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "AI-guided citizen intake",
    description:
      "Capture voice, text, image, and location signals with multilingual triage that prioritizes the right response path instantly.",
    icon: BrainCircuit,
  },
  {
    title: "Responder and volunteer coordination",
    description:
      "Route alerts to the nearest capable volunteer, ambulance, or command team with live readiness and ETA awareness.",
    icon: Users2,
  },
  {
    title: "Hospital-aware orchestration",
    description:
      "Synchronize hospital capacity, specialist availability, and escalation queues before a patient reaches the front desk.",
    icon: Building2,
  },
  {
    title: "Human-in-the-loop oversight",
    description:
      "Keep clinicians, operators, and public health teams in control with approvals, audit trails, and safe escalation points.",
    icon: ShieldCheck,
  },
];

const transition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
};

export default function PlatformOverview() {
  return (
    <section className="scroll-mt-28 px-4 py-20 sm:py-28" id="platform">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Platform
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Coordinate emergency response like one intelligent system.
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={transition}
            className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-[#eef2ff]/75 p-6 shadow-[0_30px_80px_rgba(35,43,73,0.11)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(144,172,255,0.36),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(255,188,132,0.42),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(238,242,255,0.74))]" />

            <div className="relative min-h-[420px] overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/45 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    MedConnect Orchestration
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    The shared operating layer for connected care.
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-[#dbe5ff]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live capacity signals
                </div>
              </div>

              <div className="relative mt-8 h-[300px] overflow-hidden rounded-[1.6rem] border border-white/60 bg-[linear-gradient(180deg,rgba(248,250,255,0.95),rgba(227,235,255,0.84))]">
                <div className="absolute left-6 top-8 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_16px_40px_rgba(55,66,102,0.12)]">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Siren className="h-4 w-4 text-[#5b6ee1]" />
                    Citizen emergency alert
                  </div>
                  <p className="mt-2 max-w-[11rem] text-sm text-slate-600">
                    AI captures symptoms, location, and urgency in one pass.
                  </p>
                </div>

                <div className="absolute left-1/2 top-[44%] z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-[#6e80ef] text-white shadow-[0_20px_50px_rgba(75,95,190,0.35)]">
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/75">
                      AI Core
                    </p>
                    <p className="mt-1 text-base font-semibold">Triage + route</p>
                  </div>
                </div>

                <div className="absolute right-6 top-10 rounded-2xl border border-white/70 bg-white/82 p-4 shadow-[0_16px_40px_rgba(55,66,102,0.12)]">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Building2 className="h-4 w-4 text-[#5b6ee1]" />
                    Hospital readiness graph
                  </div>
                  <p className="mt-2 max-w-[12rem] text-sm text-slate-600">
                    Match patients to capacity, specialists, and equipment.
                  </p>
                </div>

                <div className="absolute bottom-8 left-8 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_16px_40px_rgba(55,66,102,0.12)]">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Users2 className="h-4 w-4 text-[#5b6ee1]" />
                    Volunteer responder grid
                  </div>
                  <p className="mt-2 max-w-[12rem] text-sm text-slate-600">
                    Surface the nearest trained help with live ETA awareness.
                  </p>
                </div>

                <div className="absolute left-[22%] top-[32%] h-px w-[22%] rotate-[12deg] bg-gradient-to-r from-[#7e90ff] to-transparent" />
                <div className="absolute right-[20%] top-[32%] h-px w-[22%] -rotate-[12deg] bg-gradient-to-l from-[#7e90ff] to-transparent" />
                <div className="absolute bottom-[28%] left-[34%] h-px w-[18%] rotate-[24deg] bg-gradient-to-r from-[#7e90ff] to-transparent" />

                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-t-[100px] bg-[#a9b9ff]/70 blur-[1px]" />
                <div className="absolute bottom-0 left-[18%] h-48 w-56 rounded-t-[140px] bg-[#849cff]/75 blur-[1px]" />
                <div className="absolute bottom-0 right-0 h-36 w-44 rounded-t-[100px] bg-[#bac7ff]/70 blur-[1px]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ ...transition, delay: 0.08 }}
            className="glass-panel rounded-[2.25rem] border border-white/70 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
          >
            <div className="space-y-8">
              {pillars.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="flex gap-4 border-b border-[#ebe7de] pb-8 last:border-b-0 last:pb-0"
                >
                  <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#5b6ee1] ring-1 ring-[#dbe3ff]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                      {title}
                    </h3>
                    <p className="mt-3 text-lg leading-8 text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
