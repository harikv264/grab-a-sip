"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Sparkles } from "@/components/icons";
import { whatsappLink } from "@/lib/data";

const floaters = [
  { emoji: "🍊", className: "left-[6%] top-[24%]", anim: "animate-float" },
  { emoji: "🥭", className: "right-[8%] top-[16%]", anim: "animate-float-slow" },
  { emoji: "🍓", className: "left-[12%] bottom-[14%]", anim: "animate-float-slow" },
  { emoji: "🥥", className: "right-[10%] bottom-[20%]", anim: "animate-float" },
  { emoji: "🫐", className: "left-[46%] top-[8%]", anim: "animate-float" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-28">
      {/* animated blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[10%] h-96 w-96 animate-blob rounded-full bg-berry/25 blur-[110px]" />
        <div className="absolute right-[-8%] top-[30%] h-[28rem] w-[28rem] animate-blob rounded-full bg-lime/20 blur-[120px] [animation-delay:4s]" />
        <div className="absolute bottom-[-10%] left-[30%] h-80 w-80 animate-blob rounded-full bg-grape/25 blur-[110px] [animation-delay:8s]" />
      </div>

      {/* floating fruit */}
      {floaters.map((f, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute hidden select-none text-4xl opacity-80 md:block lg:text-5xl ${f.className} ${f.anim}`}
          style={{ animationDelay: `${i * 0.7}s` }}
        >
          {f.emoji}
        </div>
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="section text-center"
      >
        <motion.div variants={item} className="flex justify-center">
          <span className="chip">
            <Sparkles size={14} className="text-lime" />
            Fresh juices & fruit bowls, delivered daily
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-bold leading-[1.02] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Your daily dose of <span className="gradient-text">fresh</span>,
          <br className="hidden sm:block" /> delivered before you wake up.
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl"
        >
          Cold-pressed juices and loaded fruit bowls, made fresh every morning
          and dropped at your door six days a week. No prep, no sugar, no
          excuses — just grab a sip.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={whatsappLink("Hi Grab A Sip! I'd like to start a plan.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto"
          >
            <MessageCircle size={18} strokeWidth={2.5} />
            Start on WhatsApp
          </a>
          <Link href="/plans" className="btn-ghost w-full sm:w-auto">
            See the plans
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* stats */}
        <motion.div
          variants={item}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { n: "6", l: "days a week" },
            { n: "26", l: "boxes / month" },
            { n: "0", l: "added sugar" },
            { n: "5", l: "pause days" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-3xl glass px-4 py-5 text-center"
            >
              <div className="font-display text-3xl font-bold text-lime sm:text-4xl">
                {s.n}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
