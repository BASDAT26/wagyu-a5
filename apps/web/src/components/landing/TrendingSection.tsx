import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export default function TrendingSection() {
  const { data: eventsData = [] } = useQuery(trpc.event.event.list.queryOptions());

  const events = eventsData.slice(0, 3).map((e: any) => {
    const dt = new Date(e.event_datetime);
    const dateStr = dt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    return {
      id: e.event_id,
      title: e.event_title,
      date: dateStr,
      category: "Event",
      image: "linear-gradient(to bottom, #111, #000)",
    };
  });

  return (
    <section className="py-32 bg-black border-b border-white/10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="text-3xl md:text-4xl font-medium text-white mb-4 tracking-tight"
              style={{ letterSpacing: "-0.03em" }}
            >
              Featured Events
            </h2>
            <p className="text-white/50 font-light">
              Discover curated experiences powered by our platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/event"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group pb-1 border-b border-white/20 hover:border-white"
            >
              View all events{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.a
              href="/event"
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group block"
            >
              <div
                className="w-full aspect-4/3 rounded-lg border border-white/10 mb-4 overflow-hidden relative bg-[#0a0a0a]"
                style={{ background: event.image }}
              >
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/2 transition-colors duration-300" />

                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 rounded bg-white/10 backdrop-blur-md text-[10px] font-medium text-white tracking-wider uppercase border border-white/10">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-white group-hover:text-white/80 transition-colors tracking-tight">
                    {event.title}
                  </h3>
                </div>
                <div className="text-sm text-white/50 font-mono">{event.date}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
