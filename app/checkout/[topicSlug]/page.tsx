import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutPanel } from "@/components/checkout-panel";
import { Lock } from "lucide-react";

export default async function CheckoutPage({ params }: { params: { topicSlug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/login?callbackUrl=/checkout/${params.topicSlug}`);

  const topic = await prisma.topic.findUnique({ where: { slug: params.topicSlug } });
  if (!topic) notFound();
  if (!topic.isPaid) redirect(`/case-files/${topic.slug}`);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_topicId: { userId: session.user.id, topicId: topic.id } },
  });
  if (enrollment?.status === "PAID") redirect(`/case-files/${topic.slug}`);

  return (
    <>
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-spy-amber/10">
              <Lock className="h-5 w-5 text-spy-amber" />
            </div>
            <CardTitle>Unlock {topic.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{topic.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">
              {(topic.priceInCents / 100).toFixed(2)} <span className="text-base text-muted-foreground">{topic.currency}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              One-time payment. Full access to every lesson, the Lab playground, quiz, and Agent Certification for
              this case file.
            </p>
            <CheckoutPanel
              topicId={topic.id}
              topicTitle={topic.title}
              topicSlug={topic.slug}
              amountInCents={topic.priceInCents}
              currency={topic.currency}
              agentName={session.user.name ?? ""}
              agentEmail={session.user.email ?? ""}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
