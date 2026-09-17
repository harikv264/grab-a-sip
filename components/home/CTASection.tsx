import { MessageCircle } from "@/components/icons";
import { whatsappLink } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

export function CTASection() {
  return (
    <section className="section py-8 sm:py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-5xl border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-24">
          {/* glow bg */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-lime/25 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-berry/25 blur-[100px]" />
          </div>

          <h2 className="mx-auto max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-6xl">
            Ready to make fresh your{" "}
            <span className="gradient-text">default</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Send us a message, tell us where you are, and we&apos;ll handle the
            rest. Your first fresh delivery could be tomorrow morning.
          </p>
          <div className="mt-9 flex justify-center">
            <a
              href={whatsappLink("Hi Grab A Sip! I'd like to start a plan.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 text-lg"
            >
              <MessageCircle size={20} strokeWidth={2.5} />
              Grab your first sip
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
