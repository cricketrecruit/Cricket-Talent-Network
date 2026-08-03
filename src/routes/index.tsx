import { createFileRoute } from "@tanstack/react-router";

import { CountryRibbon } from "@/components/landing/CountryRibbon";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { QuoteParallax } from "@/components/landing/QuoteParallax";
import { Membership } from "@/components/landing/Membership";
import { Contact } from "@/components/landing/Contact";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cricket Recruit: Scouting and Recruiting for Cricket" },
      {
        name: "description",
        content:
          "A professional cricket scouting platform connecting verified players with franchises, sponsors, and academies through analytics, highlights, and global exposure.",
      },
      { property: "og:title", content: "Cricket Recruit: Scouting and Recruiting for Cricket" },
      {
        property: "og:description",
        content:
          "A professional cricket scouting platform connecting verified players with franchises, sponsors, and academies. Join as an Ever Free Player or Franchise Scout.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Cricket Recruit" },
      {
        name: "twitter:description",
        content:
          "A professional cricket scouting platform connecting verified players with franchises, sponsors, and academies.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Cricket Recruit",
          description:
            "A professional cricket scouting platform connecting verified players with franchises, sponsors, and academies.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Washington",
            addressRegion: "DC",
            addressCountry: "US",
          },
          telephone: "+1-443-234-3331",
          email: "cricketrecruit@gmail.com",

          sameAs: [
            "https://www.youtube.com/channel/UCaH6i-qe1yOExYsIIwmoppA",
            "https://www.instagram.com/crickettalentnet",
            "https://www.linkedin.com/company/cricket-talent-network",
            "https://www.facebook.com/profile.php?id=61589314779471",
            "https://x.com/cricketalentnet",
          ],
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <CountryRibbon />
      <Hero />
      <About />
      <Services homepage />
      <QuoteParallax />
      <Membership />
      <Contact />
    </>
  );
}
