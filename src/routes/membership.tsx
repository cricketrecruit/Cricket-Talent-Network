import { createFileRoute } from "@tanstack/react-router";

import { Membership } from "@/components/landing/Membership";
import { QuoteParallax } from "@/components/landing/QuoteParallax";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership — Cricket Recruit" },
      {
        name: "description",
        content:
          "Join Cricket Recruit as an Ever Free Player or apply for Franchise Scout access. Build your profile, get discovered, and unlock recruiting tools.",
      },
      { property: "og:title", content: "Membership — Cricket Recruit" },
      {
        property: "og:description",
        content:
          "Ever Free Player profiles and Franchise Scout recruiting tools for the global cricket talent network.",
      },
      { property: "og:url", content: "/membership" },
      { name: "twitter:title", content: "Membership — Cricket Recruit" },
      {
        name: "twitter:description",
        content:
          "Join Cricket Recruit as a free player or franchise scout and connect with global cricket opportunities.",
      },
    ],
    links: [{ rel: "canonical", href: "/membership" }],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  return (
    <>
      <QuoteParallax />
      <Membership />
    </>
  );
}
