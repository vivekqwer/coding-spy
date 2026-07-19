import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { topicSlug: string } }) {
  const topic = await prisma.topic.findUnique({
    where: { slug: params.topicSlug },
    select: { title: true, description: true, color: true },
  });

  if (!topic) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0B0F17",
          backgroundImage: `linear-gradient(135deg, ${topic.color}33 0%, #0B0F17 60%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: 28,
            fontWeight: 700,
            color: "#F8FAFC",
            marginBottom: "40px",
          }}
        >
          <span style={{ color: "#22D3EE" }}>{"</>"}</span> Coding Spy
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "#F59E0B",
            textTransform: "uppercase",
            letterSpacing: "4px",
            marginBottom: "20px",
          }}
        >
          Case File
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#F8FAFC", marginBottom: "20px" }}>
          {topic.title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94A3B8", maxWidth: "900px" }}>{topic.description}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
