import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAiHint } from "@/lib/ai/adapter";
import { isRateLimited } from "@/lib/ai/rateLimit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const key = session?.user?.id ?? req.headers.get("x-forwarded-for") ?? "anonymous";

  if (isRateLimited(key)) {
    return NextResponse.json(
      { hint: "Too many intel requests — take a breath, Agent, and try again in a minute." },
      { status: 200 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { code, language, lessonTitle, errorText } = body as {
    code?: string;
    language?: string;
    lessonTitle?: string;
    errorText?: string;
  };

  if (!code || !language) {
    return NextResponse.json({ error: "code and language are required" }, { status: 400 });
  }

  const hint = await getAiHint({ code, language, lessonTitle, errorText });
  return NextResponse.json({ hint });
}
