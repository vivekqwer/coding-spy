import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireSection } from "@/lib/requireAdmin";
import { UserManager } from "@/components/admin/user-manager";

export default async function AdminUsersPage() {
  const staff = await requireSection("users");
  if (!staff) redirect("/admin");

  const session = await getServerSession(authOptions);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { progress: true, certificates: true, quizResults: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Roster</h1>
        <p className="text-sm text-muted-foreground">Every registered agent, their clearance role, and activity.</p>
      </div>
      <UserManager initialUsers={JSON.parse(JSON.stringify(users))} currentUserId={session?.user?.id ?? ""} />
    </div>
  );
}
