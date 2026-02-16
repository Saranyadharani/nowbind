import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Feed",
  description: "Posts from authors you follow on NowBind.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
