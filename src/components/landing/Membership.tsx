import { useState } from "react";
import { Link } from "@tanstack/react-router";
import stadiumImg from "@/assets/action-stadium-crowd.jpg";
import { useReveal } from "@/hooks/use-reveal";
import { ContactModal } from "./ContactModal";


const PLAYER_FEATURES = [
  "Verified digital player profile",
  "Basic performance and stat tracking",
  "Public showcase listing",
  "Showcase event alerts",
  "Highlight video uploads",
];

const SCOUT_FEATURES = [
  "Full predictive data access",
  "Advanced player filters and search",
  "Direct player and academy messaging",
  "Video breakdown and analysis tools",
  "Custom talent alerts and watchlists",
  "Tournament and showcase VIP access",
];

export function Membership() {
  const headRef = useReveal<HTMLDivElement>();
  const cardsRef = useReveal<HTMLDivElement>(0.1);
  const [modalOpen, setModalOpen] = useState(false);

  return (

    <section id="membership" className="relative bg-metric py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-[0.08] bg-cover bg-center"
        style={{ backgroundImage: `url(${stadiumImg})` }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={headRef} className="reveal text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono font-bold text-cricket-red uppercase tracking-[0.3em] mb-3">
            Membership
          </div>
          <h2 className="font-display italic text-5xl lg:text-6xl uppercase leading-[0.95] text-ink-black mb-4">
            Join the Network
          </h2>
          <p className="text-ink-soft">
            Whether you are a rising talent looking for eyes on your game, or a scout hunting for
            the next match winner, there is a tier built for you.
          </p>
        </div>

        <div ref={cardsRef} className="reveal grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <article className="lift bg-white p-8 border-t-4 border-ink-black shadow-sm flex flex-col">
            <div className="mb-6">
              <div className="font-mono text-[10px] text-cricket-red uppercase tracking-widest mb-2">
                Tier 01 / Free Forever
              </div>
              <h3 className="font-display italic text-3xl uppercase text-ink-black mb-3">
                Ever Free Player
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed">
                Create your professional profile and begin tracking your cricket journey. No cost,
                no expiration.
              </p>
            </div>
            <ul className="space-y-2.5 mb-8 flex-grow">
              {PLAYER_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-ink-black">
                  <span className="mt-1.5 size-1.5 rounded-full bg-cricket-red shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              search={{ tab: "player" }}
              className="cta-press skew-tag w-full py-3 border-2 border-ink-black text-ink-black font-display uppercase italic text-base tracking-widest hover:bg-ink-black hover:text-white flex items-center justify-center"
            >
              <span>Get Started Free</span>
            </Link>

          </article>

          <article className="lift bg-ink-black text-white p-8 border-t-4 border-cricket-red shadow-2xl flex flex-col relative overflow-hidden">
            <div className="skew-tag absolute top-4 right-4 bg-cricket-red text-[10px] px-3 py-1 font-display uppercase tracking-widest">
              <span>Pro Access</span>
            </div>
            <div className="mb-6">
              <div className="font-mono text-[10px] text-cricket-red uppercase tracking-widest mb-2">
                Tier 02 / Institutional
              </div>
              <h3 className="font-display italic text-3xl uppercase mb-3">Franchise Scout</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Advanced recruiting tools for academies, teams, franchises, and professional scouts.
              </p>
            </div>
            <ul className="space-y-2.5 mb-8 flex-grow">
              {SCOUT_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="mt-1.5 size-1.5 rounded-full bg-cricket-red shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="cta-press skew-tag w-full py-3 bg-cricket-red text-white font-display uppercase italic text-base tracking-widest hover:bg-white hover:text-ink-black animate-pulse-red"
            >
              <span>Apply for Access</span>
            </button>
          </article>

        </div>
      </div>
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>

  );
}
