"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/permissions";

type Role = "ADMIN" | "LEARNER" | "SEO_MANAGER" | "SOCIAL_MEDIA_MANAGER" | "DEVELOPER";

const ALL_ROLES: Role[] = ["LEARNER", "ADMIN", "SEO_MANAGER", "SOCIAL_MEDIA_MANAGER", "DEVELOPER"];

const ROLE_BADGE_CLASS: Record<Role, string> = {
  ADMIN: "border-spy-violet/40 bg-spy-violet/10 text-spy-violet",
  LEARNER: "",
  SEO_MANAGER: "border-spy-cyan/40 bg-spy-cyan/10 text-spy-cyan",
  SOCIAL_MEDIA_MANAGER: "border-pink-400/40 bg-pink-400/10 text-pink-400",
  DEVELOPER: "border-green-500/40 bg-green-500/10 text-green-500",
};

type AgentRow = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
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

  async function changeRole(user: AgentRow, nextRole: Role) {
    if (user.id === currentUserId) {
      toast.error("You can't change your own role.");
      return;
    }
    if (nextRole === user.role) return;
    if (!confirm(`Set ${user.name ?? user.email}'s role to ${ROLE_LABELS[nextRole]}?`)) return;

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
    toast.success(`${user.name ?? user.email} is now ${ROLE_LABELS[nextRole]}.`);
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
                  <select
                    value={u.role}
                    disabled={busyId === u.id || u.id === currentUserId}
                    onChange={(e) => changeRole(u, e.target.value as Role)}
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${ROLE_BADGE_CLASS[u.role] || "border-border bg-transparent"} disabled:opacity-50`}
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">{u._count.progress}</td>
                <td className="px-4 py-3">{u._count.quizResults}</td>
                <td className="px-4 py-3">{u._count.certificates}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
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
