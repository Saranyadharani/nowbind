import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Discover trending posts, browse tags, and find great content on NowBind.",
  openGraph: {
    title: "Explore | NowBind",
    description:
      "Discover trending posts, browse tags, and find great content on NowBind.",
    url: "/explore",
    siteName: "NowBind",
    images: [
      {
        url: "/api/og?title=Explore&type=default",
        width: 1200,
        height: 630,
        alt: "Explore NowBind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore | NowBind",
    description:
      "Discover trending posts, browse tags, and find great content on NowBind.",
    images: ["/api/og?title=Explore&type=default"],
  },
  alternates: {
    canonical: "/explore",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
