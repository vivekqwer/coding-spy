import Stripe from "stripe";

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

let stripeClient: Stripe | null = null;

function getClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

export async function createStripeCheckoutSession(params: {
  amountInCents: number;
  currency: string;
  topicTitle: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}): Promise<{ url: string | null; sessionId: string }> {
  const client = getClient();
  const session = await client.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          product_data: { name: `Coding Spy — ${params.topicTitle} Case File` },
          unit_amount: params.amountInCents,
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
  return { url: session.url, sessionId: session.id };
}

export function getStripeWebhookEvent(rawBody: string, signature: string): Stripe.Event | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return null;
  try {
    return getClient().webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return null;
  }
}
