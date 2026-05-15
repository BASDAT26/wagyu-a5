import { motion } from "framer-motion";
import { Server, Activity, Lock, Globe } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Global Infrastructure",
      description: "Deploy your events on our edge network. Millisecond latency globally.",
      icon: <Globe className="w-5 h-5 text-white/70" />,
      colSpan: "md:col-span-2",
    },
    {
      title: "Real-time Analytics",
      description: "Monitor sales and attendance with sub-second accuracy.",
      icon: <Activity className="w-5 h-5 text-white/70" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Enterprise Security",
      description: "SOC2 compliant, end-to-end encryption for all transactions.",
      icon: <Lock className="w-5 h-5 text-white/70" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Scalable API",
      description: "Build custom integrations with our robust GraphQL & REST APIs.",
      icon: <Server className="w-5 h-5 text-white/70" />,
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <section className="py-32 bg-black border-b border-white/10">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2
            className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Engineered for scale.
          </h2>
          <p className="text-lg text-white/50 max-w-xl font-light">
            Everything you need to manage millions of tickets, handle traffic spikes, and deliver a
            seamless checkout experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 overflow-hidden hover:bg-[#111] transition-colors ${feature.colSpan}`}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
