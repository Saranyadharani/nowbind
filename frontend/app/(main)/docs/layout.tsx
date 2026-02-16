import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Everything you need to integrate with NowBind's Agent API, MCP server, and platform features.",
  openGraph: {
    title: "API Documentation | NowBind",
    description:
      "Everything you need to integrate with NowBind's Agent API, MCP server, and platform features.",
    url: "/docs",
    siteName: "NowBind",
    images: [
      {
        url: "/api/og?title=API%20Documentation&type=default",
        width: 1200,
        height: 630,
        alt: "NowBind API Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "API Documentation | NowBind",
    description:
      "Everything you need to integrate with NowBind's Agent API, MCP server, and platform features.",
    images: ["/api/og?title=API%20Documentation&type=default"],
  },
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
