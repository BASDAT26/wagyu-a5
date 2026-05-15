import type { Route } from "./+types/_index";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import TrendingSection from "../components/landing/TrendingSection";
import CTASection from "../components/landing/CTASection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tiktaktuk | Beli Tiket Acara Mudah & Cepat" },
    { name: "description", content: "Platform ticketing modern untuk pengalaman tak terlupakan." },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-slate-50 font-sans antialiased">
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
      <CTASection />

      <footer className="bg-black text-white/40 py-12 text-center border-t border-white/10 text-sm font-light">
        <p>© 2026 Tiktaktuk Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
