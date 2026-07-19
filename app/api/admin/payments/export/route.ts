import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { buildXlsxResponse } from "@/lib/export-xlsx";
import { formatDate } from "@/lib/utils";

export async function GET() {
  const staff = await requireSection("payments");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      topic: { select: { title: true } },
    },
  });

  const rows = enrollments.map((e) => ({
    Agent: e.user.name ?? "",
    Email: e.user.email,
    "Case File": e.topic.title,
    "Amount": (e.amountInCents / 100).toFixed(2),
    Currency: e.currency,
    Gateway: e.gateway,
    Status: e.status,
    "Gateway Order ID": e.gatewayOrderId ?? "",
    "Gateway Payment ID": e.gatewayPaymentId ?? "",
    Date: formatDate(e.createdAt),
  }));

  return buildXlsxResponse(rows, "Payments", "coding-spy-payments.xlsx");
}
