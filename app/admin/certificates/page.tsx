import { prisma } from "@/lib/prisma";
import { CertificateManager } from "@/components/admin/certificate-manager";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: { user: { select: { name: true, email: true } }, topic: { select: { title: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Certifications</h1>
        <p className="text-sm text-muted-foreground">Every certificate issued across all case files.</p>
      </div>
      <CertificateManager initialCertificates={JSON.parse(JSON.stringify(certificates))} />
    </div>
  );
}
