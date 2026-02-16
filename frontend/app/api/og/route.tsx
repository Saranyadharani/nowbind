import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "NowBind";
  const author = searchParams.get("author") || "";
  const type = searchParams.get("type") || "default";

  const subtitle =
    type === "post" && author
      ? `by ${author}`
      : type === "author"
        ? "Author on NowBind"
        : type === "tag"
          ? "Posts on NowBind"
          : "The open-source AI-native blogging platform";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            N
          </div>
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#a1a1aa" }}>
            NowBind
          </span>
        </div>

        {/* Center: title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: title.length > 60 ? "40px" : "52px",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "900px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: "24px", color: "#a1a1aa" }}>{subtitle}</div>
          )}
        </div>

        {/* Bottom: accent gradient bar */}
        <div
          style={{
            width: "120px",
            height: "4px",
            borderRadius: "2px",
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
