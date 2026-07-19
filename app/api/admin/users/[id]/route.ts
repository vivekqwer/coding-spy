import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const VALID_ROLES = new Set(Object.values(Role));

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (params.id === admin.id) {
    return NextResponse.json({ error: "You cannot change your own role." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { role } = body as { role?: string };
  if (!role || !VALID_ROLES.has(role as Role)) {
    return NextResponse.json({ error: `role must be one of: ${Array.from(VALID_ROLES).join(", ")}` }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id }, select: { role: true } });
  if (target?.role === "ADMIN" && role !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Can't demote the last remaining Admin. Promote another agent to Admin first." },
        { status: 400 }
      );
    }
  }

  const user = await prisma.user.update({ where: { id: params.id }, data: { role: role as Role } });
  return NextResponse.json(user);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (params.id === admin.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id }, select: { role: true } });
  if (target?.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Can't delete the last remaining Admin. Promote another agent to Admin first." },
        { status: 400 }
      );
    }
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
