import gripImg from "@/assets/action-grip.jpg";
import ballImg from "@/assets/action-ball.jpg";
import { useReveal } from "@/hooks/use-reveal";

const PILLARS = [
  "Player Scouting & Talent Recruitment",
  "Verified Player Analytics, Rankings & Performance Insights",
  "Professional Player Profiles & Highlight Videos",
  "Talent Showcases, Trials, Contracts & Selection Events",
  "Academy, Club & Franchise Partnerships",
  "Youth Cricket Development & High-Performance Pathways",
  "Exposure to Clubs, Leagues, Franchise & Professional Opportunities",
  "Building a Global Cricket Talent & Development Ecosystem",
];

export function About() {
  const headingRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>(0.05);

  return (
    <section id="about" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-stretch">
        <div className="lg:col-span-5 reveal flex flex-col" ref={headingRef}>
          <div className="text-xs font-mono font-bold text-cricket-red uppercase tracking-[0.3em] mb-4">
            About Cricket Recruit
          </div>
          <h2 className="font-display italic text-5xl lg:text-6xl uppercase leading-[0.95] text-ink-black mb-6">
            Where talent meets opportunity, globally.
          </h2>
          <p className="text-ink-soft leading-relaxed text-base mb-8">
            Cricket Recruit is a premier global platform where talent meets opportunity.
            We bring together players, coaches, academies, scouts, recruiters, and franchise
            teams through a centralized ecosystem designed to accelerate cricket development
            and player exposure.
          </p>
          <div className="zoom-frame bg-ink-black flex-1 min-h-[480px] relative overflow-hidden">

            <img
              src={gripImg}
              alt="Cricket batsman gripping bat at the crease"
              width={1280}
              height={1600}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-5 text-ink-soft leading-relaxed text-lg mb-10">
            <p>
              Our mission is to provide aspiring cricketers with the visibility, resources, and
              connections needed to reach the next level of their careers. Through verified
              player profiles, performance analytics, scouting reports, rankings, showcases,
              and recruiting opportunities, we create a pathway for talent to be discovered and
              developed.
            </p>
            <p>
              Our vision is to become the world's leading cricket scouting and recruiting
              network, empowering youth and emerging cricketers by connecting them with coaches,
              academies, professional franchise teams, and opportunities across the global
              cricket landscape.
            </p>
            <p className="font-display italic uppercase text-ink-black text-xl tracking-wide">
              Discover Talent. <span className="text-cricket-red">Build Connections.</span> Create Opportunities.
            </p>
          </div>


          <div className="relative zoom-frame aspect-[16/9] bg-ink-black">
            <img
              src={ballImg}
              alt="Red cricket ball resting on dewy grass"
              width={1536}
              height={1024}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>

          <div
            ref={gridRef}
            className="reveal mt-10 grid sm:grid-cols-2 gap-px bg-border border border-border"
          >
            {PILLARS.map((p, i) => (
              <div
                key={p}
                className="bg-white px-5 py-4 flex items-center gap-4 hover:bg-metric transition-colors cursor-default group"
              >
                <span className="font-mono text-xs font-bold text-cricket-red w-6 transition-transform group-hover:scale-125">
                  0{i + 1}
                </span>
                <span className="text-sm font-semibold text-ink-black group-hover:translate-x-1 transition-transform">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
