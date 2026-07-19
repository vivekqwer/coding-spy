"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load payment script."));
    document.head.appendChild(script);
  });
}

export function CheckoutPanel({
  topicId,
  topicTitle,
  topicSlug,
  amountInCents,
  currency,
  agentName,
  agentEmail,
}: {
  topicId: string;
  topicTitle: string;
  topicSlug: string;
  amountInCents: number;
  currency: string;
  agentName: string;
  agentEmail: string;
}) {
  const router = useRouter();
  const [loadingGateway, setLoadingGateway] = useState<"razorpay" | "stripe" | null>(null);

  async function payWithRazorpay() {
    setLoadingGateway("razorpay");
    try {
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not start checkout.");
        return;
      }

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!window.Razorpay) {
        toast.error("Payment script failed to load.");
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Coding Spy",
        description: `${topicTitle} Case File`,
        order_id: data.orderId,
        prefill: { name: agentName, email: agentEmail },
        theme: { color: "#22D3EE" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/checkout/razorpay/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            toast.success("Payment verified — case file unlocked!");
            router.push(`/case-files/${topicSlug}`);
            router.refresh();
          } else {
            toast.error("Payment verification failed.");
          }
        },
      });
      rzp.open();
    } catch {
      toast.error("Could not reach Razorpay.");
    } finally {
      setLoadingGateway(null);
    }
  }

  async function payWithStripe() {
    setLoadingGateway("stripe");
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not start checkout.");
        setLoadingGateway(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Could not reach Stripe.");
      setLoadingGateway(null);
    }
  }

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={payWithRazorpay} disabled={!!loadingGateway}>
        {loadingGateway === "razorpay" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Pay {(amountInCents / 100).toFixed(2)} {currency} with Razorpay
      </Button>
      <Button className="w-full" variant="outline" onClick={payWithStripe} disabled={!!loadingGateway}>
        {loadingGateway === "stripe" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Pay with Stripe
      </Button>
    </div>
  );
}
