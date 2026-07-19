import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeWebhookEvent } from "@/lib/payments/stripe";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  const event = getStripeWebhookEvent(rawBody, signature);
  if (!event) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; payment_intent?: string };
    await prisma.enrollment.updateMany({
      where: { gatewayOrderId: session.id },
      data: { status: "PAID", gatewayPaymentId: session.payment_intent ?? null },
    });
  }

  return NextResponse.json({ received: true });
}
