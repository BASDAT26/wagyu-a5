import { motion } from "framer-motion";
import { Button } from "@wagyu-a5/ui/components/button";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden border-b border-white/10">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          ></motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-medium tracking-tighter text-white mb-8"
            style={{ letterSpacing: "-0.04em" }}
          >
            The new standard <br className="hidden md:block" />
            <span className="text-white/40">for event ticketing.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 font-light"
          >
            A powerful, developer-first platform to manage, sell, and scale your events globally.
            Built for modern enterprises and ambitious creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-sm font-medium bg-white text-black hover:bg-white/90 rounded-md w-full sm:w-auto"
              asChild
            >
              <Link to="/register">Start building</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-sm font-medium border-white/10 bg-transparent text-white hover:bg-white/5 rounded-md w-full sm:w-auto"
              asChild
            >
              <Link to="/event">Explore events</Link>
            </Button>
          </motion.div>
        </div>

        {/* Abstract Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10 bottom-0 h-full pointer-events-none" />
          <div className="rounded-t-2xl border border-white/10 bg-[#0a0a0a] p-2 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <div className="rounded-xl border border-white/5 bg-[#111] h-100 flex items-center justify-center relative overflow-hidden">
              {/* Mockup UI elements */}
              <div className="absolute top-4 left-4 right-4 flex gap-4">
                <div className="h-32 flex-1 rounded-lg border border-white/5 bg-white/2" />
                <div className="h-32 flex-1 rounded-lg border border-white/5 bg-white/2" />
                <div className="h-32 flex-1 rounded-lg border border-white/5 bg-white/2" />
              </div>
              <div className="absolute top-40 left-4 right-4 bottom-4 rounded-lg border border-white/5 bg-white/1 flex items-end p-4 gap-2">
                {/* Fake bar chart */}
                {[40, 70, 45, 90, 65, 85, 100, 60, 40, 80].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white/10 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
