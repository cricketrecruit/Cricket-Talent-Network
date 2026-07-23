import bowlerImg from "@/assets/action-bowler.jpg";
import { useReveal } from "@/hooks/use-reveal";

export function QuoteParallax() {
  const ref = useReveal<HTMLDivElement>(0.2);

  return (
    <section
      className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bowlerImg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-black/80 via-ink-black/70 to-ink-black/80" />
      <div
        ref={ref}
        className="reveal relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <blockquote>
          <p className="font-display italic text-4xl md:text-5xl lg:text-6xl uppercase leading-[0.95] text-white mb-6">
            “Every ball is an audition. Every player deserves a stage.”
          </p>
          <footer className="font-mono text-xs uppercase tracking-[0.3em] text-cricket-red">
            — Cricket Recruit
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
