"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Trash2, Download, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

type CertRow = {
  id: string;
  code: string;
  issuedAt: string;
  user: { name: string | null; email: string };
  topic: { title: string; slug: string };
};

export function CertificateManager({ initialCertificates }: { initialCertificates: CertRow[] }) {
  const router = useRouter();
  const [certs, setCerts] = useState(initialCertificates);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return certs;
    return certs.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.user.email.toLowerCase().includes(q) ||
        (c.user.name ?? "").toLowerCase().includes(q) ||
        c.topic.title.toLowerCase().includes(q)
    );
  }, [certs, query]);

  async function revoke(cert: CertRow) {
    if (!confirm(`Revoke certificate ${cert.code} for ${cert.user.name ?? cert.user.email}?`)) return;
    setBusyId(cert.id);
    const res = await fetch(`/api/admin/certificates/${cert.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      toast.error("Could not revoke certificate.");
      return;
    }
    setCerts((cs) => cs.filter((c) => c.id !== cert.id));
    toast.success("Certificate revoked.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by agent, topic, or code…"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-card/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-card/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{c.user.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{c.user.email}</p>
                </td>
                <td className="px-4 py-3">{c.topic.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-spy-cyan">{c.code}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(c.issuedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/verify/${c.code}`}
                      target="_blank"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-card"
                      title="View verification page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/api/certificate/pdf/${c.code}`}
                      target="_blank"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-card"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => revoke(c)}
                      disabled={busyId === c.id}
                      className="rounded-md p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-30"
                      title="Revoke certificate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
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
