"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ambulance,
  BrainCircuit,
  Building2,
  HeartPulse,
  Languages,
  ShieldCheck,
  Stethoscope,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useTransition } from "react";

type WorkflowCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

type Workflow = {
  id: string;
  label: string;
  heading: string;
  cards: WorkflowCard[];
};

const workflows: Workflow[] = [
  {
    id: "emergency",
    label: "Emergency Triage",
    heading: "Experience MedConnect Dispatch",
    cards: [
      {
        title: "Citizen intake",
        description:
          "Capture the what, where, and how severe across voice, text, and image channels in one guided flow.",
        icon: HeartPulse,
        accent:
          "from-[#d6ddff] via-white to-[#f7cfe2] text-[#5b6ee1] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Ambulance routing",
        description:
          "Prioritize the closest capable unit with route intelligence, handoff readiness, and escalation policies.",
        icon: Ambulance,
        accent:
          "from-[#ffd29a] via-[#fff3dc] to-[#ffb16d] text-[#cf6b15] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Hospital acceptance",
        description:
          "Pre-match a patient to the right emergency team before arrival using capacity and specialty signals.",
        icon: Building2,
        accent:
          "from-[#daeab2] via-[#f4f8df] to-[#b5d46f] text-[#5c8724] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
    ],
  },
  {
    id: "volunteer",
    label: "Volunteer Grid",
    heading: "Coordinate trained community response",
    cards: [
      {
        title: "Responder availability",
        description:
          "Track who is nearby, certified, and ready to assist based on role, kit, and coverage policies.",
        icon: Users2,
        accent:
          "from-[#d9deff] via-white to-[#e6c7ff] text-[#6c53de] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Scene guidance",
        description:
          "Deliver AI-assisted step guidance, language translation, and supervisor escalation for safer outcomes.",
        icon: Languages,
        accent:
          "from-[#ffe2b4] via-[#fff6e5] to-[#ffc46b] text-[#c87810] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Safe handoff",
        description:
          "Package notes, vitals, and event summaries for clinicians and command staff in a consistent format.",
        icon: ShieldCheck,
        accent:
          "from-[#d8ecc8] via-[#f4f9e9] to-[#badc86] text-[#537d1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
    ],
  },
  {
    id: "hospital",
    label: "Hospital Ops",
    heading: "Give hospital teams live system awareness",
    cards: [
      {
        title: "Bed intelligence",
        description:
          "Stream live availability, overflow risk, and likely admission pathways across every receiving facility.",
        icon: Building2,
        accent:
          "from-[#d6dfff] via-white to-[#c8d3ff] text-[#5d73e8] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Clinical copilots",
        description:
          "Summarize cases, surface relevant protocols, and prepare teams with AI-generated patient context.",
        icon: Stethoscope,
        accent:
          "from-[#ffdcb7] via-[#fff5e8] to-[#ffba7a] text-[#cb6f14] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Escalation controls",
        description:
          "Route exceptions, specialist needs, and command approvals without leaving the operational workflow.",
        icon: ShieldCheck,
        accent:
          "from-[#e0edc8] via-[#f8fbef] to-[#c7de8a] text-[#5b8422] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
    ],
  },
  {
    id: "ai",
    label: "AI Guidance",
    heading: "Deploy AI systems with humans always in control",
    cards: [
      {
        title: "Multilingual voice agents",
        description:
          "Handle urgent citizen conversations in local languages, then escalate complex or critical cases immediately.",
        icon: Languages,
        accent:
          "from-[#d6ddff] via-white to-[#d9e7ff] text-[#5a6ee0] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Health reasoning layer",
        description:
          "Triage symptoms, contextualize histories, and recommend safe next actions with policy-aware safeguards.",
        icon: BrainCircuit,
        accent:
          "from-[#ffe2bf] via-[#fff7eb] to-[#ffc98a] text-[#cf7a16] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
      {
        title: "Escalation assurance",
        description:
          "Keep approval checkpoints, audit visibility, and human override pathways visible in every AI interaction.",
        icon: ShieldCheck,
        accent:
          "from-[#ddecc9] via-[#f7fbed] to-[#c6df8a] text-[#587f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      },
    ],
  },
];

export default function WorkflowShowcase() {
  const [activeId, setActiveId] = useState(workflows[0].id);
  const [isPending, startTransition] = useTransition();
  const activeWorkflow =
    workflows.find((workflow) => workflow.id === activeId) ?? workflows[0];

  return (
    <section className="scroll-mt-28 px-4 py-20 sm:py-28" id="network">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Product Flows
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
            One interface for every emergency and healthcare workflow.
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {workflows.map((workflow) => {
            const isActive = workflow.id === activeId;

            return (
              <button
                key={workflow.id}
                type="button"
                onClick={() => startTransition(() => setActiveId(workflow.id))}
                className={cn(
                  "rounded-full border px-5 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "border-[#d9e2ff] bg-[#eef3ff] text-[#384fc7] shadow-[0_12px_24px_rgba(91,110,225,0.12)]"
                    : "border-[#ece7df] bg-[#f7f5f1] text-slate-600 hover:border-[#dde3f7] hover:bg-white",
                  isPending && isActive && "opacity-90"
                )}
              >
                {workflow.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 overflow-hidden rounded-[2.25rem] border border-white/70 bg-[linear-gradient(180deg,rgba(236,241,255,0.82),rgba(255,255,255,0.74))] shadow-[0_30px_70px_rgba(35,43,73,0.08)]">
          <div className="flex items-center justify-between border-b border-[#ece5dc] px-6 py-5 sm:px-8">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              {activeWorkflow.heading}
            </h3>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 ring-1 ring-[#ece5dc]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkflow.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-5 p-6 sm:p-8 lg:grid-cols-3"
            >
              {activeWorkflow.cards.map(
                ({ title, description, icon: Icon, accent }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-[1.9rem] border border-white/80 bg-white/80 p-4 shadow-[0_16px_40px_rgba(35,43,73,0.06)]"
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-5",
                        accent
                      )}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.75),transparent_55%)]" />
                      <div className="relative flex h-44 items-center justify-center">
                        <div className="absolute h-32 w-32 rounded-[2rem] border border-white/60 bg-white/25 blur-[2px]" />
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/45 shadow-[0_12px_30px_rgba(255,255,255,0.2)]">
                          <Icon className="h-9 w-9" />
                        </div>
                      </div>
                    </div>

                    <div className="px-1 pb-2 pt-5">
                      <h4 className="text-2xl font-semibold tracking-tight text-slate-950">
                        {title}
                      </h4>
                      <p className="mt-3 text-lg leading-8 text-slate-600">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
