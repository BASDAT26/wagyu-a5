import { motion } from "framer-motion";
import { Button } from "@wagyu-a5/ui/components/button";
import { Link } from "react-router";

export default function CTASection() {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Very subtle glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-100 bg-whiste/2 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl mb-8 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          <h2
            className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Ready to launch?
          </h2>
          <p className="text-lg text-white/50 mb-10 font-light">
            Join thousands of creators and organizers building the next generation of live
            experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 text-sm font-medium bg-white text-black hover:bg-white/90 rounded-md"
              asChild
            >
              <Link to="/register">Create free account</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
