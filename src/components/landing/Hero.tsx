import { Link } from "@tanstack/react-router";

import heroImg from "@/assets/hero-stadium.jpg";
import heroVideo from "@/assets/hero-video.mp4";

const TICKER = [
  "VERIFIED SCOUTING PLATFORM",
  "13 PLAYING NATIONS",
  "TALENT MEETS OPPORTUNITY",
  "GLOBAL CRICKET ECOSYSTEM",
  "YOUTH DEVELOPMENT PATHWAYS",
  "ACADEMY AND TEAM PARTNERSHIPS",
];

export function Hero() {
  const ticker = [...TICKER, ...TICKER];

  return (
    <section id="top" className="bg-white">
      <div className="w-full">
        <div className="relative overflow-hidden bg-ink-black min-h-[calc(100svh-5rem)]">
          <video
            src={heroVideo}
            poster={heroImg}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Cricket stadium hero footage"
            className="absolute inset-0 size-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-ink-black via-ink-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cricket-red/30 via-transparent to-transparent" />

          <div className="relative h-full min-h-[calc(100svh-5rem)] max-w-7xl mx-auto flex flex-col justify-end p-8 lg:p-14 text-white gap-10">
            <div className="max-w-3xl">
              <span className="skew-tag inline-block bg-cricket-red px-4 py-1.5 text-[11px] font-display uppercase tracking-widest mb-6">
                <span>Global Cricket Scouting Network</span>
              </span>
              <h1 className="font-display italic uppercase text-5xl md:text-7xl lg:text-8xl leading-[0.88] text-white">
                Where Cricket Talent
                <br />
                <span className="text-cricket-red">Meets Opportunity.</span>
              </h1>
              <p className="mt-6 text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
                A professional cricket talent platform connecting players, coaches, scouts,
                academies, clubs, and franchise teams across the global cricket ecosystem.
                Discover opportunities with the world's leading T20 competitions, including the
                IPL, PSL, BBL, SA20, CPL, The Hundred, MLC, ILT20, BPL, LPL, NPL, and other premier
                domestic and international leagues.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/membership"
                  className="cta-press skew-tag bg-white text-ink-black px-7 py-3 font-display uppercase italic text-base tracking-wider hover:bg-cricket-red hover:text-white"
                >
                  <span>Become a Member</span>
                </Link>

                <a
                  href="/#about"
                  className="cta-press skew-tag border border-white/40 text-white px-7 py-3 font-display uppercase italic text-base tracking-wider hover:bg-white/10"
                >
                  <span>Our Story</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-ink-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-start">
          <h2 className="font-display italic uppercase text-4xl md:text-5xl lg:text-6xl leading-[0.95] text-ink-black">
            Covering all the bases of <span className="text-cricket-red">global cricket</span>.
          </h2>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="skew-tag inline-block bg-cricket-red h-1.5 w-24" />
            <p className="font-display uppercase tracking-[0.25em] text-ink-soft text-sm md:text-base">
              Scouting <span className="text-cricket-red">•</span> Development <span className="text-cricket-red">•</span> Showcases <span className="text-cricket-red">•</span> Partnerships <span className="text-cricket-red">•</span> Pathways
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-y border-ink-black/10 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-marquee-fast py-3 px-4 text-[11px] font-mono uppercase tracking-widest text-ink-soft">
          {ticker.map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              {t}
              <span className="text-cricket-red">●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
