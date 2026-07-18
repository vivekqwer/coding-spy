import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { LogoWithWordmark } from "@/components/logo";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default async function VerifyPage({ params }: { params: { code: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { code: params.code },
    include: { user: { select: { name: true } }, topic: { select: { title: true } } },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Link href="/">
        <LogoWithWordmark />
      </Link>
      <div className="glass w-full max-w-md rounded-2xl p-8">
        {certificate ? (
          <>
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-500" />
            <h1 className="mb-1 text-xl font-semibold">Certification Verified</h1>
            <p className="text-muted-foreground">
              <strong className="text-foreground">{certificate.user.name}</strong> completed{" "}
              <strong className="text-foreground">{certificate.topic.title}</strong> on{" "}
              {formatDate(certificate.issuedAt)}.
            </p>
            <p className="mt-4 font-mono text-xs text-spy-cyan">{certificate.code}</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h1 className="mb-1 text-xl font-semibold">No Match Found</h1>
            <p className="text-muted-foreground">This verification code does not correspond to any issued certificate.</p>
          </>
        )}
      </div>
    </main>
  );
}
