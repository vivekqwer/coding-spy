import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/requireAdmin";
import { PaymentsTable } from "@/components/admin/payments-table";

export default async function AdminPaymentsPage() {
  const staff = await requireSection("payments");
  if (!staff) redirect("/admin");

  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      topic: { select: { title: true, slug: true } },
    },
  });

  const totalRevenueCents = enrollments
    .filter((e) => e.status === "PAID")
    .reduce((sum, e) => sum + e.amountInCents, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments &amp; Purchases</h1>
        <p className="text-sm text-muted-foreground">
          Every checkout attempt across Razorpay and Stripe — {enrollments.filter((e) => e.status === "PAID").length}{" "}
          paid, total revenue {(totalRevenueCents / 100).toFixed(2)}.
        </p>
      </div>
      <PaymentsTable initialEnrollments={JSON.parse(JSON.stringify(enrollments))} />
    </div>
  );
}
