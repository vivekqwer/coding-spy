const FALLBACK_HINTS = [
  "Check for typos in variable and function names — a single mismatch will break the whole run.",
  "Read the error line number in the terminal and look one line above it; the real cause often sits just before where it surfaces.",
  "Try breaking the problem into smaller steps and logging intermediate values to see where behavior diverges from what you expect.",
  "Double-check that every opening bracket, quote, or tag has a matching close.",
];

function pickFallback(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_HINTS[hash % FALLBACK_HINTS.length];
}

export async function getAiHint(params: {
  code: string;
  language: string;
  lessonTitle?: string;
  errorText?: string;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return pickFallback(params.code + params.language);
  }

  const system =
    "You are a coding tutor giving a SHORT hint (2-4 sentences max). " +
    "Never give the full solution or complete corrected code. Point the learner toward the concept or " +
    "line they should look at, and ask a guiding question if useful.";

  const userContent = params.errorText
    ? `Lesson: ${params.lessonTitle ?? "unknown"}\nLanguage: ${params.language}\nCode:\n${params.code}\n\nThe learner hit this error:\n${params.errorText}\n\nGive a short hint to help them debug it themselves.`
    : `Lesson: ${params.lessonTitle ?? "unknown"}\nLanguage: ${params.language}\nCode:\n${params.code}\n\nGive a short hint to help the learner move forward, without solving it for them.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 220,
        system,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!res.ok) return pickFallback(params.code + params.language);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text;
    return text?.trim() || pickFallback(params.code + params.language);
  } catch {
    return pickFallback(params.code + params.language);
  }
}

const CHAT_FALLBACK =
  "The Intel channel is offline right now (no AI key configured), Agent. Browse the case file's Tip callouts " +
  "or ask in the lesson's Request Intel button once you have some code written — that route works without a live connection too.";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function getAiTutorReply(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return CHAT_FALLBACK;

  const system =
    "You are the Coding Spy AI Tutor — a friendly, encouraging programming tutor embedded in a coding " +
    "education platform (Coding Spy: Decode. Learn. Master.) covering HTML, CSS, JavaScript, Python, SQL, " +
    "Java, and 40+ other languages/topics. Answer programming questions clearly and concisely (usually under " +
    "150 words), use short code snippets when helpful, and keep a supportive tone. If asked something " +
    "completely unrelated to learning or programming, gently redirect to coding topics.";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 400,
        system,
        messages: messages.slice(-12),
      }),
    });

    if (!res.ok) return CHAT_FALLBACK;
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text;
    return text?.trim() || CHAT_FALLBACK;
  } catch {
    return CHAT_FALLBACK;
  }
}
