import stadiumImg from "@/assets/action-stadium-crowd.jpg";
import joinNetworkVideo from "@/assets/join-network-bg.mp4";
import { useReveal } from "@/hooks/use-reveal";

export function Contact() {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="contact" className="relative bg-ink-black text-white overflow-hidden">
      <video
        src={joinNetworkVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={stadiumImg}
        aria-hidden
        className="absolute inset-0 -z-0 size-full object-cover opacity-70"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-gradient-to-t from-ink-black/80 via-ink-black/50 to-ink-black/30"
      />

      <div ref={headRef} className="reveal relative max-w-7xl mx-auto px-6 py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-8">
            <div className="text-xs font-mono font-bold text-cricket-red uppercase tracking-[0.3em] mb-6">
              Connect
            </div>
            <h2 className="font-display text-5xl lg:text-7xl uppercase leading-[0.9]">
              Step up to the
              <br />
              <span className="text-cricket-red italic">crease.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <a
              href="/#membership"
              className="cta-press skew-tag inline-block bg-cricket-red text-white px-7 py-4 font-display text-lg uppercase italic tracking-wider hover:bg-white hover:text-ink-black"
            >
              <span>Join the Network</span>

            </a>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3 border-t border-white/10 pt-12">
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-bold">
              Headquarters
            </div>
            <address className="not-italic text-white/85 leading-relaxed">
              Washington D.C, USA
            </address>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-bold">
              Direct Line
            </div>
            <a
              href="tel:+14432343331"
              className="story-link text-white/85 hover:text-cricket-red transition-colors"
            >
              +1 (443) 234-3331
            </a>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-bold">
              Email
            </div>
            <a
              href="mailto:cricketrecruit@gmail.com"
              className="story-link text-white/85 hover:text-cricket-red transition-colors break-all"
            >
              cricketrecruit@gmail.com
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
