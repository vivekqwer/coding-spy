import { redirect } from "next/navigation";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDeveloperPage() {
  const staff = await requireSection("developer");
  if (!staff) redirect("/admin");

  let dbOk = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbOk = false;
  }

  const envChecks = [
    { key: "DATABASE_URL", set: !!process.env.DATABASE_URL },
    { key: "NEXTAUTH_SECRET", set: !!process.env.NEXTAUTH_SECRET },
    { key: "GOOGLE_CLIENT_ID", set: !!process.env.GOOGLE_CLIENT_ID },
    { key: "ANTHROPIC_API_KEY", set: !!process.env.ANTHROPIC_API_KEY },
    { key: "RAZORPAY_KEY_ID", set: !!process.env.RAZORPAY_KEY_ID },
    { key: "STRIPE_SECRET_KEY", set: !!process.env.STRIPE_SECRET_KEY },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Developer Console</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Database connection</span>
              <Badge className={dbOk ? "border-green-500/40 bg-green-500/10 text-green-500" : "border-destructive/40 bg-destructive/10 text-destructive"}>
                {dbOk ? "Connected" : "Unreachable"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {envChecks.map((c) => (
              <div key={c.key} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs">{c.key}</span>
                <Badge className={c.set ? "border-green-500/40 bg-green-500/10 text-green-500" : "border-spy-amber/40 bg-spy-amber/10 text-spy-amber"}>
                  {c.set ? "Set" : "Missing"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 font-mono text-xs text-muted-foreground">
          <p>GET /api/topics — list published topics</p>
          <p>POST /api/lessons/[id]/progress — save code / mark complete</p>
          <p>POST /api/quiz/[id]/submit — submit a quiz attempt</p>
          <p>POST /api/certificate/[topicId] — issue a certificate</p>
          <p>POST /api/ai/hint, POST /api/ai/chat — AI-powered assistance</p>
          <p>GET /sitemap.xml, /robots.txt, /llms.txt — SEO/AEO endpoints</p>
        </CardContent>
      </Card>
    </div>
  );
}
