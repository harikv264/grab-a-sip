"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, ArrowRight } from "@/components/icons";
import {
  checkServiceability,
  SERVICE_CITY,
  LOCALITY_OPTIONS,
  type ServiceResult,
} from "@/lib/serviceability";
import { whatsappLink } from "@/lib/data";

// Fire-and-forget lead logging. Posts to the site's own /api/leads route,
// which forwards to the Java backend (API_BASE_URL) server-side.
function logLead(payload: Record<string, unknown>) {
  try {
    fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export function ServiceabilityCheck() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ServiceResult | null>(null);
  const [phone, setPhone] = useState("");
  const [notified, setNotified] = useState(false);

  const onCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkServiceability(value);
    setResult(res);
    setNotified(false);
    if (res.status === "serviceable" || res.status === "not_serviceable") {
      logLead({
        rawLocation: value,
        pincode: res.pincode,
        matchedArea: res.matchedArea,
        serviceable: res.status === "serviceable",
      });
    }
  };

  const onNotify = (e: React.FormEvent) => {
    e.preventDefault();
    logLead({
      rawLocation: value,
      pincode: result?.pincode,
      matchedArea: result?.matchedArea,
      serviceable: false,
      phone,
    });
    setNotified(true);
  };

  const waMessage = result?.matchedArea
    ? `Hi Grab A Sip! I'm in ${result.matchedArea} (${SERVICE_CITY}) and I'd like to start a plan.`
    : `Hi Grab A Sip! I'm in ${SERVICE_CITY} and I'd like to start a plan.`;

  return (
    <section id="check" className="section scroll-mt-24 py-20 sm:py-24">
      <div className="relative overflow-hidden rounded-5xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-aqua/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="chip">📍 Delivery check</span>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            Do we deliver to <span className="gradient-text">your door</span>?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Enter your pincode or area and find out in a second. If we&apos;re in
            your neighbourhood, you&apos;re one message away from fresh.
          </p>

          {/* Input */}
          <form
            onSubmit={onCheck}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="text"
              list="served-localities"
              autoComplete="off"
              placeholder="Your area (e.g. Gachibowli) or pincode"
              aria-label="Your area or pincode"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-cream placeholder:text-muted/70 outline-none transition focus:border-lime/60 focus:bg-white/[0.08]"
            />
            <datalist id="served-localities">
              {LOCALITY_OPTIONS.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
            <button type="submit" className="btn-primary shrink-0">
              Check
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Result */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result.status + (result.pincode ?? result.matchedArea ?? "")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-6 max-w-md"
              >
                {result.status === "ask_again" && (
                  <div className="rounded-3xl border border-mango/30 bg-mango/10 p-5 text-left">
                    <p className="text-sm font-medium text-mango">
                      {result.message ??
                        "Please enter your area (e.g. Gachibowli) or 6-digit pincode."}
                    </p>
                  </div>
                )}

                {result.status === "serviceable" && (
                  <div className="rounded-3xl border border-lime/30 bg-lime/10 p-6 text-left">
                    <div className="flex items-center gap-2 text-lime">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-lime/20">
                        <Check size={16} strokeWidth={3} />
                      </span>
                      <span className="font-display text-lg font-bold">
                        Yes! We deliver
                        {result.matchedArea ? ` to ${result.matchedArea}` : ""} 🎉
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-cream/80">
                      Message us on WhatsApp and we&apos;ll set up your fresh
                      deliveries right away.
                    </p>
                    <a
                      href={whatsappLink(waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary mt-4 w-full"
                    >
                      <MessageCircle size={18} strokeWidth={2.5} />
                      Continue on WhatsApp
                    </a>
                  </div>
                )}

                {result.status === "not_serviceable" && (
                  <div className="rounded-3xl border border-berry/30 bg-berry/10 p-6 text-left">
                    {!notified ? (
                      <>
                        <p className="font-display text-lg font-bold text-cream">
                          We&apos;re not there yet — but we&apos;re coming 🌱
                        </p>
                        <p className="mt-2 text-sm text-cream/80">
                          Leave your number and we&apos;ll message you the moment
                          Grab A Sip reaches
                          {result.pincode ? ` ${result.pincode}` : " your area"}.
                          Every request helps us decide where to expand next.
                        </p>
                        <form
                          onSubmit={onNotify}
                          className="mt-4 flex flex-col gap-3 sm:flex-row"
                        >
                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            inputMode="tel"
                            placeholder="Your WhatsApp number (optional)"
                            aria-label="Your phone number"
                            className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-cream placeholder:text-muted/70 outline-none transition focus:border-berry/60"
                          />
                          <button type="submit" className="btn-ghost shrink-0">
                            Notify me
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-lime">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-lime/20">
                          <Check size={16} strokeWidth={3} />
                        </span>
                        <span className="font-display text-lg font-bold">
                          Thanks! You&apos;re on the list 💚
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
