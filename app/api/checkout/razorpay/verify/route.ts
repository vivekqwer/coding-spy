import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { orderId, paymentId, signature } = body as {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing verification fields." }, { status: 400 });
  }

  const valid = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!valid) {
    return NextResponse.json({ error: "Signature verification failed." }, { status: 400 });
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id, gatewayOrderId: orderId },
  });
  if (!enrollment) return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: { status: "PAID", gatewayPaymentId: paymentId },
  });

  return NextResponse.json({ ok: true });
}
