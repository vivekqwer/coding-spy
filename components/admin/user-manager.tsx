"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash2, Download, UserPlus } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Role>("LEARNER");
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q)
    );
  }, [users, query]);

  async function addAgent() {
    if (!newName.trim() || !newEmail.trim() || newPassword.length < 8) {
      toast.error("Name, email, and an 8+ character password are required.");
      return;
    }
    setAdding(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, role: newRole }),
    });
    const data = await res.json();
    setAdding(false);
    if (!res.ok) {
      toast.error(data.error ?? "Could not create agent.");
      return;
    }
    setUsers((us) => [data, ...us]);
    toast.success(`${newName} added as ${ROLE_LABELS[newRole]}. They can sign in with the password you set.`);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("LEARNER");
    setShowAddForm(false);
    router.refresh();
  }

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
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      toast.error(data.error ?? "Could not update role.");
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
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      toast.error(data.error ?? "Could not delete agent.");
      return;
    }
    setUsers((us) => us.filter((u) => u.id !== user.id));
    toast.success("Agent removed.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents by name or email…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowAddForm((s) => !s)}>
            <UserPlus className="h-3.5 w-3.5" /> Add Agent
          </Button>
          <a href="/api/admin/users/export">
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Export to Excel
            </Button>
          </a>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <div>
              <Label>Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Agent name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="agent@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8+ characters"
              />
            </div>
            <div>
              <Label>Role</Label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="h-10 w-full rounded-lg border border-border bg-background/60 px-2 text-sm"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 lg:col-span-4">
              <Button onClick={addAgent} disabled={adding}>
                {adding ? "Creating…" : "Create Agent"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
