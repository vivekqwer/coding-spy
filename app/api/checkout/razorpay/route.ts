import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/payments/razorpay";

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured on this server yet." }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const { topicId } = body as { topicId?: string };
  if (!topicId) return NextResponse.json({ error: "topicId required" }, { status: 400 });

  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  if (!topic.isPaid) return NextResponse.json({ error: "This case file is free." }, { status: 400 });

  const existing = await prisma.enrollment.findUnique({
    where: { userId_topicId: { userId: user.id, topicId } },
  });
  if (existing?.status === "PAID") {
    return NextResponse.json({ error: "Already enrolled." }, { status: 400 });
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_topicId: { userId: user.id, topicId } },
    update: { gateway: "RAZORPAY", amountInCents: topic.priceInCents, currency: topic.currency, status: "PENDING" },
    create: {
      userId: user.id,
      topicId,
      gateway: "RAZORPAY",
      amountInCents: topic.priceInCents,
      currency: topic.currency,
      status: "PENDING",
    },
  });

  const order = await createRazorpayOrder({
    amountInCents: topic.priceInCents,
    currency: topic.currency,
    receipt: enrollment.id,
  });

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: { gatewayOrderId: order.orderId },
  });

  return NextResponse.json({
    orderId: order.orderId,
    keyId: order.keyId,
    amount: topic.priceInCents,
    currency: topic.currency,
    enrollmentId: enrollment.id,
  });
}
