import { Link } from "@tanstack/react-router";

import cricketRecruitLogo from "@/assets/cricket-recruit-logo.png";


const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#membership", label: "Membership" },
  { href: "/#contact", label: "Contact" },
];

const TIERS = [
  { href: "/#membership", label: "Ever Free Player" },
  { href: "/#membership", label: "Franchise Scout" },
  { href: "/#contact", label: "Become a Member" },
  { href: "/#contact", label: "Partner With Us" },
];

const SOCIALS = [
  { label: "YouTube", href: "https://www.youtube.com/@CricketRecruit" },
  { label: "Instagram", href: "https://www.instagram.com/cricketrecruitglobal" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cricket-recruit" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61593084656585" },
  { label: "X (Twitter)", href: "https://x.com/cricketrecruit" },
  { label: "TikTok", href: "https://www.tiktok.com/@cricketrecruit" },
];

export function Footer() {
  return (
    <footer className="relative bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center">
              <img
                src={cricketRecruitLogo}
                alt="Cricket Recruit logo"
                width={220}
                height={80}
                className="h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
              />
            </Link>

            <p className="text-white/70 leading-relaxed max-w-sm">
              A professional cricket scouting platform connecting verified players with franchises, sponsors, and academies through analytics, highlights, and global exposure.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span
                aria-hidden
                className="animate-ball-spin inline-block size-5 rounded-full bg-cricket-red ring-2 ring-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                Est. 2026, Washington, D.C.
              </span>
            </div>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-2" aria-label="Footer navigation">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-4 font-bold">
              Explore
            </div>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="story-link text-white/85 hover:text-cricket-red transition-colors text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Membership */}
          <nav className="lg:col-span-2" aria-label="Membership links">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-4 font-bold">
              Membership
            </div>
            <ul className="space-y-3">
              {TIERS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="story-link text-white/85 hover:text-cricket-red transition-colors text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="lg:col-span-3">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-4 font-bold">
              Global Frequency
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift border border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest hover:bg-cricket-red hover:border-cricket-red flex justify-between items-center group"
                >
                  <span>{s.label}</span>
                  <span className="text-cricket-red group-hover:text-white transition-all duration-300 group-hover:translate-x-1 inline-block">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} Cricket Recruit. All rights reserved.
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Built by{" "}
            <a
              href="https://thefreewebsiteguys.com"
              target="_blank"
              rel="noopener noreferrer"
              className="story-link text-white/70 hover:text-cricket-red transition-colors"
            >
              The Free Website Guys
            </a>
          </p>
          <div className="font-display text-2xl italic text-cricket-red tracking-tighter">CR.</div>
        </div>
      </div>
    </footer>
  );
}
