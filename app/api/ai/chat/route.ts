import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAiTutorReply, type ChatMessage } from "@/lib/ai/adapter";
import { isRateLimited } from "@/lib/ai/rateLimit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const key = session?.user?.id ?? req.headers.get("x-forwarded-for") ?? "anonymous";

  if (isRateLimited(key)) {
    return NextResponse.json(
      { reply: "Too many questions at once, Agent — take a breath and try again in a minute." },
      { status: 200 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { messages } = body as { messages?: ChatMessage[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const reply = await getAiTutorReply(messages);
  return NextResponse.json({ reply });
}
