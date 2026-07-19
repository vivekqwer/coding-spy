"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash2, ShieldCheck, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type AgentRow = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "LEARNER";
  createdAt: string;
  _count: { progress: number; certificates: number; quizResults: number };
};

export function UserManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AgentRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q)
    );
  }, [users, query]);

  async function toggleRole(user: AgentRow) {
    if (user.id === currentUserId) {
      toast.error("You can't change your own role.");
      return;
    }
    const nextRole = user.role === "ADMIN" ? "LEARNER" : "ADMIN";
    if (!confirm(`Make ${user.name ?? user.email} ${nextRole === "ADMIN" ? "an Admin" : "a Learner"}?`)) return;

    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    setBusyId(null);
    if (!res.ok) {
      toast.error("Could not update role.");
      return;
    }
    setUsers((us) => us.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)));
    toast.success(`${user.name ?? user.email} is now ${nextRole === "ADMIN" ? "an Admin" : "a Learner"}.`);
    router.refresh();
  }

  async function deleteUser(user: AgentRow) {
    if (user.id === currentUserId) {
      toast.error("You can't delete your own account.");
      return;
    }
    if (!confirm(`Permanently delete ${user.name ?? user.email}? This removes their progress, quiz results, and certificates too.`))
      return;

    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      toast.error("Could not delete agent.");
      return;
    }
    setUsers((us) => us.filter((u) => u.id !== user.id));
    toast.success("Agent removed.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search agents by name or email…"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-card/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Lessons Done</th>
              <th className="px-4 py-3">Quizzes Taken</th>
              <th className="px-4 py-3">Certificates</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-card/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge className={u.role === "ADMIN" ? "border-spy-violet/40 bg-spy-violet/10 text-spy-violet" : ""}>
                    {u.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">{u._count.progress}</td>
                <td className="px-4 py-3">{u._count.quizResults}</td>
                <td className="px-4 py-3">{u._count.certificates}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={busyId === u.id || u.id === currentUserId}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-card disabled:opacity-30"
                      title={u.role === "ADMIN" ? "Demote to Learner" : "Promote to Admin"}
                    >
                      {u.role === "ADMIN" ? <Shield className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      disabled={busyId === u.id || u.id === currentUserId}
                      className="rounded-md p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-30"
                      title="Delete agent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
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
