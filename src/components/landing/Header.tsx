import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import cricketRecruitLogo from "@/assets/cricket-recruit-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { resolveRolePathForUser, type RoleDest } from "@/lib/role-redirect";


const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#membership", label: "Membership" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState<RoleDest>("/auth");

  useEffect(() => {
    const sync = async (userId: string | undefined) => {
      if (!userId) {
        setSignedIn(false);
        setDashboardPath("/auth");
        return;
      }
      setSignedIn(true);
      setDashboardPath(await resolveRolePathForUser(userId));
    };
    supabase.auth.getUser().then(({ data }) => sync(data.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => sync(s?.user?.id));
    return () => sub.subscription.unsubscribe();
  }, []);


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);


  return (
    <div className="sticky top-0 z-50">
      <header className="relative z-10 bg-ink-black text-white">
        <nav
          aria-label="Primary"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 hidden lg:flex items-center justify-center gap-8 font-display uppercase tracking-[0.2em] z-20"
        >
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="pointer-events-auto story-link text-white hover:text-cricket-red transition-colors text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pointer-events-none relative max-w-7xl mx-auto pr-6 flex items-stretch justify-between gap-6 h-20 z-10">
          <Link
            to="/"
            className="pointer-events-auto flex items-center justify-center shrink-0 h-20 w-20 -ml-[max(0px,calc((100vw-80rem)/2))]"
          >
            <img
              src={cricketRecruitLogo}
              alt="Cricket Recruit logo"
              width={180}
              height={60}
              className="h-16 w-16 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]"
            />
          </Link>

          <div className="pointer-events-auto flex items-center gap-3">
            <Link
              to={signedIn ? dashboardPath : "/auth"}
              className="hidden lg:inline-flex self-center text-sm font-mono uppercase tracking-widest text-white/80 hover:text-white"
            >
              {signedIn ? "Dashboard" : "Sign In"}
            </Link>
            <a
              href="/#membership"
              className="cta-press skew-tag self-center hidden lg:inline-flex bg-cricket-red text-white px-7 py-3 font-display text-lg uppercase italic tracking-wider hover:bg-white hover:text-ink-black shrink-0"
            >
              <span>Become a Member</span>
            </a>


            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-12 w-12 ring-1 ring-white/20 text-white hover:bg-white/10 transition-colors"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile / tablet menu, anchored to bottom of header */}
      <div
        id="mobile-nav"
        className={`lg:hidden absolute left-0 right-0 top-full h-[calc(100vh-5rem)] bg-ink-black/98 backdrop-blur transition-all duration-300 z-0 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col h-full px-8 py-12 gap-2 font-display uppercase tracking-[0.2em] overflow-y-auto">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-white text-3xl py-4 border-b border-white/10 hover:text-cricket-red transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            to={signedIn ? dashboardPath : "/auth"}
            onClick={() => setOpen(false)}
            className="mt-6 text-white text-2xl py-2"
          >
            {signedIn ? "Dashboard" : "Sign In"}
          </Link>
          <a
            href="/#membership"
            onClick={() => setOpen(false)}
            className="cta-press skew-tag mt-4 self-start bg-cricket-red text-white px-7 py-4 font-display text-lg uppercase italic tracking-wider"
          >
            <span>Become a Member</span>
          </a>

        </nav>
      </div>
    </div>
  );

}
