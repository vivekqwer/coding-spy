import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Team logins to create/update (idempotent — upsert by email).
const TEAM: { email: string; name: string; password: string; role: Role }[] = [
  { email: "seo@codingspy.in", name: "SEO Team", password: "Seo@Spy2026", role: "SEO_MANAGER" },
  { email: "social@codingspy.in", name: "Social Media Team", password: "Social@Spy2026", role: "SOCIAL_MEDIA_MANAGER" },
  { email: "dev@codingspy.in", name: "Developer Team", password: "Dev@Spy2026", role: "DEVELOPER" },
];

// Also reset the main admin password to a fresh one.
const ADMIN_EMAIL = "admin@codingspy.dev";
const ADMIN_NEW_PASSWORD = "Admin@Spy2026";

async function main() {
  for (const u of TEAM) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, passwordHash, role: u.role },
      create: { email: u.email, name: u.name, passwordHash, role: u.role },
    });
    console.log(`Ready: ${u.email} (${u.role})`);
  }

  const adminHash = await bcrypt.hash(ADMIN_NEW_PASSWORD, 10);
  await prisma.user.update({
    where: { email: ADMIN_EMAIL },
    data: { passwordHash: adminHash },
  });
  console.log(`Admin password reset: ${ADMIN_EMAIL}`);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
