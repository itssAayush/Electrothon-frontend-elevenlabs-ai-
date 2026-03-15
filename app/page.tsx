import CTA from "@/components/Landing/CTA";
import Footer from "@/components/Landing/Footer";
import Hero from "@/components/Landing/Hero";
import PlatformOverview from "@/components/Landing/PlatformOverview";
import TrustStrip from "@/components/Landing/TrustStrip";
import WorkflowShowcase from "@/components/Landing/WorkflowShowcase";

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden bg-[#f7f6f2] text-slate-950">
      <Hero />
      <TrustStrip />
      <PlatformOverview />
      <WorkflowShowcase />
      <CTA />
      <Footer />
    </div>
  );
}
