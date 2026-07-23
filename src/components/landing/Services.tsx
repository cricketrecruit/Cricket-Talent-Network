import { useReveal } from "@/hooks/use-reveal";
import stadiumImg from "@/assets/action-stadium-crowd.jpg";

const SERVICES = [
  {
    title: "Scouting and Recruiting",
    body: "Direct connection to scouts from major T20 franchises, colleges, and professional leagues.",
  },
  {
    title: "Verified Analytics",
    body: "Performance metrics and rankings validated by certified officials and match data.",
  },
  {
    title: "Video Highlights",
    body: "High-definition reels with technical breakdowns and match-winning impact moments.",
  },
  {
    title: "Showcase Events",
    body: "Exclusive combines and assessment events for elite player exposure.",
  },
  {
    title: "Academy Partnerships",
    body: "Integration with local and international cricket academies for full-cycle development.",
  },
  {
    title: "Youth Pathways",
    body: "Structured development tiers from grassroots to elite emerging prospects.",
  },
  {
    title: "Pro Exposure",
    body: "Pathways to college, league, and professional contracts across playing nations.",
  },
  {
    title: "Global Ecosystem",
    body: "A centralized talent network connecting 13 cricketing nations and growing.",
  },
];

export function Services({ homepage = false }: { homepage?: boolean }) {
  const headRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>(0.05);

  return (
    <section id="services" className="bg-metric">
      <div
        ref={headRef}
        className="reveal relative bg-ink-black overflow-hidden min-h-[70vh] flex items-center"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={stadiumImg}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-black/70 via-ink-black/80 to-ink-black" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Oversized watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]" aria-hidden="true">
          <span className="font-['Kanit'] font-black italic uppercase text-[18vw] text-white whitespace-nowrap leading-none">
            CR PERFORMANCE
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-cricket-red" />
              <span className="text-cricket-red font-['Space_Mono'] text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold">
                Core Services
              </span>
            </div>
            <h2
              className={`italic uppercase text-5xl md:text-7xl lg:text-8xl text-white leading-[0.88] mb-8 ${
                homepage ? "font-display" : "font-['Kanit'] font-black tracking-tighter leading-[0.9]"
              }`}
            >
              Precision
              <br />
              <span className={homepage ? "text-cricket-red" : "text-white/30"}>Offerings</span>
            </h2>
            <p className="max-w-2xl text-white/70 text-base md:text-lg leading-relaxed font-light">
              Cricket Recruit is a premier global scouting, recruiting, and player
              development platform. We connect talented cricketers with academies, recruiters,
              franchise teams, and professional opportunities worldwide through verified
              profiles, analytics, video highlights, and recruiting tools.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div
          ref={gridRef}
          className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="group bg-white p-7 lg:p-8 border-t-4 border-cricket-red flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:bg-ink-black hover:-translate-y-1 hover:shadow-xl cursor-default"
            >
              <div>
                <span className="font-mono text-xs font-bold text-cricket-red/60 group-hover:text-cricket-red mb-4 block transition-colors">
                  / 0{i + 1}
                </span>
                <h3 className="font-display italic text-2xl uppercase text-ink-black mb-3 group-hover:text-white transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed group-hover:text-white/70 transition-colors">
                  {s.body}
                </p>
              </div>
              <div className="mt-6 h-px w-8 bg-cricket-red/30 group-hover:bg-cricket-red group-hover:w-20 transition-all duration-500" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
