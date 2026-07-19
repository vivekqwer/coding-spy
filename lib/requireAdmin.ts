import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessSection, isStaffRole, type AdminSection } from "@/lib/permissions";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user;
}

export async function requireStaff() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isStaffRole(session.user.role)) return null;
  return session.user;
}

export async function requireSection(section: AdminSection) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !canAccessSection(session.user.role, section)) return null;
  return session.user;
}
