"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Siren,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type InsightCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const metrics = [
  "24/7 AI triage",
  "Citizens to hospitals in one graph",
  "Regional deployment controls",
];

const railCards: InsightCard[] = [
  {
    title: "Incident prioritization",
    description:
      "Automatically classify urgency, symptoms, and next-best response with operator visibility.",
    icon: BrainCircuit,
  },
  {
    title: "Volunteer and EMS routing",
    description:
      "Coordinate the nearest trained response with live route context and readiness signals.",
    icon: Users2,
  },
  {
    title: "Hospital intake visibility",
    description:
      "Prepare receiving teams with capacity, specialty, and handoff awareness before arrival.",
    icon: Building2,
  },
];

const responseSignals = [
  {
    eyebrow: "Response fabric",
    title: "Citizens, hospitals, and responders stay in sync.",
    description:
      "MedConnect turns fragmented emergency signals into one operational story for dispatch, care teams, and AI systems.",
  },
  {
    eyebrow: "Healthcare intelligence",
    title: "Safe AI assistance with human escalation built in.",
    description:
      "Design workflows where operators and clinicians can verify, override, and approve every critical decision point.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-14 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
      <div className="absolute inset-x-0 top-[-14rem] -z-20 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(251,170,100,0.68),transparent_55%)]" />
      <div className="absolute inset-x-0 top-12 -z-10 mx-auto h-[42rem] max-w-[84rem] rounded-full bg-[radial-gradient(circle,rgba(145,169,255,0.42),rgba(247,246,242,0)_67%)] blur-3xl" />
      <div className="landing-grid absolute inset-0 -z-20 opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent_78%)]" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            className="glass-panel inline-flex items-center gap-2 rounded-full border border-white/70 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <HeartPulse className="h-3.5 w-3.5 text-[#5b6ee1]" />
            Emergency intelligence for connected care
          </motion.div>

          <motion.h1
            custom={0.1}
            variants={fadeUp}
            className="font-display mt-8 max-w-5xl text-[3.3rem] leading-[0.92] tracking-[-0.05em] text-slate-950 sm:text-[4.6rem] lg:text-[6.2rem]"
          >
            AI for emergency response,
            <span className="block text-slate-600">
              built for every care pathway.
            </span>
          </motion.h1>

          <motion.p
            custom={0.2}
            variants={fadeUp}
            className="mt-8 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
          >
            MedConnect connects citizens, volunteers, hospitals, and AI health
            systems in one operational layer, turning fragmented alerts into
            coordinated care in seconds.
          </motion.p>

          <motion.div
            custom={0.3}
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              className="h-14 rounded-full bg-[#111111] px-7 text-base font-medium text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] hover:bg-black"
            >
              <Link href="/app">
                Experience MedConnect
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-white/70 bg-white/72 px-7 text-base font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.05)] hover:bg-white"
            >
              <Link href="/hospitals">
                Find Hospitals Near You
                <MapPin className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            custom={0.38}
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            {metrics.map((metric) => (
              <div
                key={metric}
                className="rounded-full border border-white/70 bg-white/66 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur"
              >
                {metric}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]"
        >
          <div className="glass-panel relative overflow-hidden rounded-[2.1rem] border border-white/70 p-6 shadow-[0_30px_80px_rgba(35,43,73,0.12)] sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(140,166,255,0.35),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(255,184,120,0.42),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.75),rgba(244,246,255,0.6))]" />

            <div className="relative">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                    Live operations graph
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    One decision layer across emergency response and care
                    delivery.
                  </h2>
                </div>

                <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  AI synced
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#edf1ff]/82 p-6">
                  <div className="absolute left-6 top-8 rounded-2xl border border-white/70 bg-white/82 p-4 shadow-[0_16px_40px_rgba(55,66,102,0.12)]">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Siren className="h-4 w-4 text-[#5b6ee1]" />
                      Citizen emergency alert
                    </div>
                    <p className="mt-2 max-w-[11rem] text-sm leading-6 text-slate-600">
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
                    <p className="mt-2 max-w-[12rem] text-sm leading-6 text-slate-600">
                      Match patients to capacity, specialists, and equipment.
                    </p>
                  </div>

                  <div className="absolute bottom-8 left-8 rounded-2xl border border-white/70 bg-white/82 p-4 shadow-[0_16px_40px_rgba(55,66,102,0.12)]">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Users2 className="h-4 w-4 text-[#5b6ee1]" />
                      Volunteer responder grid
                    </div>
                    <p className="mt-2 max-w-[12rem] text-sm leading-6 text-slate-600">
                      Surface the nearest trained help with live ETA awareness.
                    </p>
                  </div>

                  <div className="absolute left-[24%] top-[33%] h-px w-[20%] rotate-[11deg] bg-gradient-to-r from-[#7c8fff] to-transparent" />
                  <div className="absolute right-[22%] top-[32%] h-px w-[20%] -rotate-[11deg] bg-gradient-to-l from-[#7c8fff] to-transparent" />
                  <div className="absolute bottom-[30%] left-[35%] h-px w-[16%] rotate-[26deg] bg-gradient-to-r from-[#7c8fff] to-transparent" />

                  <div className="absolute bottom-0 left-0 h-40 w-40 rounded-t-[100px] bg-[#afbeff]/72 blur-[1px]" />
                  <div className="absolute bottom-0 left-[18%] h-48 w-56 rounded-t-[140px] bg-[#8ca0ff]/78 blur-[1px]" />
                  <div className="absolute bottom-0 right-0 h-36 w-44 rounded-t-[100px] bg-[#c4ceff]/74 blur-[1px]" />
                </div>

                <div className="space-y-4">
                  {railCards.map(({ title, description, icon: Icon }) => (
                    <div
                      key={title}
                      className="rounded-[1.6rem] border border-white/70 bg-white/78 p-5 shadow-[0_14px_36px_rgba(35,43,73,0.06)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3ff] text-[#5b6ee1] ring-1 ring-[#dbe2ff]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                          {title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {responseSignals.map((signal) => (
              <div
                key={signal.title}
                className="rounded-[1.9rem] border border-white/70 bg-white/74 p-6 shadow-[0_18px_44px_rgba(35,43,73,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {signal.eyebrow}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                  {signal.title}
                </h3>
                <p className="mt-3 text-lg leading-8 text-slate-600">
                  {signal.description}
                </p>
              </div>
            ))}

            <div className="rounded-[1.9rem] border border-[#dce4ff] bg-[#eef3ff] p-6 shadow-[0_18px_44px_rgba(91,110,225,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#5b6ee1] shadow-[0_12px_30px_rgba(91,110,225,0.1)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#5b6ee1]">
                    Safety Layer
                  </p>
                  <p className="text-lg font-semibold tracking-tight text-slate-950">
                    Human review stays in the loop.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Every AI recommendation can route through operator review,
                clinical approval, or custom emergency escalation policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
