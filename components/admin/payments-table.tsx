"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type EnrollmentRow = {
  id: string;
  gateway: "RAZORPAY" | "STRIPE";
  status: "PENDING" | "PAID" | "FAILED";
  amountInCents: number;
  currency: string;
  createdAt: string;
  user: { name: string | null; email: string };
  topic: { title: string; slug: string };
};

const STATUS_CLASS: Record<EnrollmentRow["status"], string> = {
  PAID: "border-green-500/40 bg-green-500/10 text-green-500",
  PENDING: "border-spy-amber/40 bg-spy-amber/10 text-spy-amber",
  FAILED: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function PaymentsTable({ initialEnrollments }: { initialEnrollments: EnrollmentRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialEnrollments;
    return initialEnrollments.filter(
      (e) =>
        e.user.email.toLowerCase().includes(q) ||
        (e.user.name ?? "").toLowerCase().includes(q) ||
        e.topic.title.toLowerCase().includes(q)
    );
  }, [initialEnrollments, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by agent or case file…"
            className="pl-9"
          />
        </div>
        <a href="/api/admin/payments/export">
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" /> Export to Excel
          </Button>
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-card/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Case File</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Gateway</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-border/40 last:border-0 hover:bg-card/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{e.user.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{e.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/case-files/${e.topic.slug}`} className="hover:text-spy-cyan">
                    {e.topic.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {(e.amountInCents / 100).toFixed(2)} {e.currency}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.gateway}</td>
                <td className="px-4 py-3">
                  <Badge className={STATUS_CLASS[e.status]}>{e.status}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(e.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No intel yet, Agent.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
