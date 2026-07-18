import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CertificateDocument } from "@/components/certificate/CertificateDocument";

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { code: params.code },
    include: { user: true, topic: true },
  });
  if (!certificate) return new Response("Not found", { status: 404 });

  const buffer = await renderToBuffer(
    CertificateDocument({
      agentName: certificate.user.name ?? "Agent",
      topicTitle: certificate.topic.title,
      issuedAt: formatDate(certificate.issuedAt),
      code: certificate.code,
    })
  );

  return new Response(buffer, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="coding-spy-${certificate.code}.pdf"`,
    },
  });
}
