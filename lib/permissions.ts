import type { Role } from "@prisma/client";

export type AdminSection = "overview" | "topics" | "users" | "certificates" | "seo" | "social" | "developer";

const SECTION_ACCESS: Record<AdminSection, Role[]> = {
  overview: ["ADMIN", "SEO_MANAGER", "SOCIAL_MEDIA_MANAGER", "DEVELOPER"],
  topics: ["ADMIN", "DEVELOPER"],
  users: ["ADMIN"],
  certificates: ["ADMIN"],
  seo: ["ADMIN", "SEO_MANAGER"],
  social: ["ADMIN", "SOCIAL_MEDIA_MANAGER"],
  developer: ["ADMIN", "DEVELOPER"],
};

export function canAccessSection(role: Role | undefined, section: AdminSection): boolean {
  if (!role) return false;
  return SECTION_ACCESS[section].includes(role);
}

export function isStaffRole(role: Role | undefined): boolean {
  return !!role && role !== "LEARNER";
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  LEARNER: "Learner",
  SEO_MANAGER: "SEO Manager",
  SOCIAL_MEDIA_MANAGER: "Social Media Manager",
  DEVELOPER: "Developer",
};
