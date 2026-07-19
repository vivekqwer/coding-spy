import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (params.id === admin.id) {
    return NextResponse.json({ error: "You cannot change your own role." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { role } = body as { role?: "ADMIN" | "LEARNER" };
  if (role !== "ADMIN" && role !== "LEARNER") {
    return NextResponse.json({ error: "role must be ADMIN or LEARNER" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json(user);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (params.id === admin.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
