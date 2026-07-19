"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, Unlock } from "lucide-react";
import { Input } from "@/components/ui/input";

export function MonetizationToggle({
  topicId,
  isPaid,
  priceInCents,
  currency,
  onUpdated,
}: {
  topicId: string;
  isPaid: boolean;
  priceInCents: number;
  currency: string;
  onUpdated: (data: { isPaid: boolean; priceInCents: number; currency: string }) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [priceInput, setPriceInput] = useState((priceInCents / 100).toString());

  async function patch(data: Partial<{ isPaid: boolean; priceInCents: number; currency: string }>) {
    setSaving(true);
    const res = await fetch(`/api/admin/topics/${topicId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Could not update pricing.");
      return;
    }
    onUpdated({ isPaid, priceInCents, currency, ...data });
  }

  async function toggle() {
    const next = !isPaid;
    if (next && priceInCents === 0) {
      toast.error("Set a price before switching this case file to Paid.");
      return;
    }
    await patch({ isPaid: next });
    toast.success(next ? "Case file is now Paid." : "Case file is now Free.");
  }

  async function savePrice() {
    const cents = Math.round(parseFloat(priceInput || "0") * 100);
    if (Number.isNaN(cents) || cents < 0) {
      toast.error("Enter a valid price.");
      return;
    }
    await patch({ priceInCents: cents });
    toast.success("Price updated.");
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 p-3">
      <button
        onClick={toggle}
        disabled={saving}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
          isPaid ? "bg-spy-amber/10 text-spy-amber" : "bg-green-500/10 text-green-500"
        }`}
      >
        {isPaid ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
        {isPaid ? "Paid" : "Free"}
      </button>
      {isPaid && (
        <div className="flex items-center gap-2">
          <Input
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            onBlur={savePrice}
            className="h-8 w-24"
            placeholder="Price"
          />
          <select
            value={currency}
            onChange={(e) => patch({ currency: e.target.value })}
            className="h-8 rounded-lg border border-border bg-background/60 px-2 text-xs"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      )}
    </div>
  );
}
