import { prisma } from "@/lib/prisma";

/**
 * Site-wide editable content registry.
 * Each entry defines a key, the admin group/label it shows under, its default
 * value, and whether it's a multi-line field. DB `ContentBlock` rows override
 * these defaults; anything not overridden falls back to the default here.
 *
 * To make a new piece of text editable: add an entry here and read it via
 * getContent() (server) or useContent() (client).
 */
export type ContentField = {
  key: string;
  group: string;
  label: string;
  default: string;
  multiline?: boolean;
};

export const CONTENT_REGISTRY: ContentField[] = [
  // ---------- Branding ----------
  { key: "brand.wordOne", group: "Branding", label: "Logo word 1", default: "Coding" },
  { key: "brand.wordTwo", group: "Branding", label: "Logo word 2 (gradient)", default: "Spy" },
  { key: "brand.tagline", group: "Branding", label: "Tagline", default: "Decode. Learn. Master." },

  // ---------- Navbar ----------
  { key: "nav.caseFiles", group: "Navbar", label: "Case Files label", default: "Case Files" },
  { key: "nav.certifications", group: "Navbar", label: "Certifications label", default: "Certifications" },
  { key: "nav.aiPrompt", group: "Navbar", label: "AI Prompt label", default: "AI Prompt" },
  { key: "nav.signIn", group: "Navbar", label: "Sign In label", default: "Sign In" },
  { key: "nav.signUp", group: "Navbar", label: "Sign Up label", default: "Request Clearance" },
  { key: "nav.profile", group: "Navbar", label: "Profile label", default: "Agent Profile" },
  { key: "nav.admin", group: "Navbar", label: "Admin label", default: "Mission Control" },
  { key: "nav.signOut", group: "Navbar", label: "Sign Out label", default: "Sign out" },

  // ---------- Footer ----------
  {
    key: "footer.blurb",
    group: "Footer",
    label: "About blurb",
    default:
      "Coding Spy is optimized for hands-on learning. Case files, examples, and quizzes are continually reviewed for accuracy.",
    multiline: true,
  },
  { key: "footer.col1Title", group: "Footer", label: "Column 1 title", default: "Top Case Files" },
  { key: "footer.col2Title", group: "Footer", label: "Column 2 title", default: "More Case Files" },
  { key: "footer.hqTitle", group: "Footer", label: "Agent HQ title", default: "Agent HQ" },
  { key: "footer.hqSignup", group: "Footer", label: "HQ signup link", default: "Request Clearance" },
  { key: "footer.hqLogin", group: "Footer", label: "HQ login link", default: "Agent Sign-In" },
  { key: "footer.hqAll", group: "Footer", label: "HQ all-case-files link", default: "All Case Files" },
  { key: "footer.copyright", group: "Footer", label: "Copyright line (© year auto-prepended)", default: "Coding Spy. All secrets reserved." },

  // ---------- Login page ----------
  { key: "login.title", group: "Login Page", label: "Title", default: "Agent Sign-In" },
  { key: "login.subtitle", group: "Login Page", label: "Subtitle", default: "Access Mission Control and your Case Files." },
  { key: "login.submit", group: "Login Page", label: "Submit button", default: "Sign In" },
  { key: "login.submitLoading", group: "Login Page", label: "Submit (loading)", default: "Verifying identity…" },
  { key: "login.google", group: "Login Page", label: "Google button", default: "Continue with Google" },
  { key: "login.signupPrompt", group: "Login Page", label: "Signup prompt", default: "New agent?" },
  { key: "login.signupLink", group: "Login Page", label: "Signup link", default: "Request clearance" },

  // ---------- Signup page ----------
  { key: "signup.title", group: "Signup Page", label: "Title", default: "Request Clearance" },
  { key: "signup.subtitle", group: "Signup Page", label: "Subtitle", default: "Create your agent profile to start your first case file." },
  { key: "signup.submit", group: "Signup Page", label: "Submit button", default: "Create Account" },
  { key: "signup.submitLoading", group: "Signup Page", label: "Submit (loading)", default: "Processing…" },
  { key: "signup.loginPrompt", group: "Signup Page", label: "Login prompt", default: "Already an agent?" },
  { key: "signup.loginLink", group: "Signup Page", label: "Login link", default: "Sign in" },
];

const DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_REGISTRY.map((f) => [f.key, f.default])
);

export type ContentMap = Record<string, string>;

/** Server-side: returns the full content map (defaults merged with DB overrides).
 * Falls back to defaults if the DB is unreachable (e.g. during build-time
 * prerender when DATABASE_URL isn't set), so builds never crash on content. */
export async function getContent(): Promise<ContentMap> {
  const map: ContentMap = { ...DEFAULTS };
  try {
    const rows = await prisma.contentBlock.findMany();
    for (const r of rows) map[r.key] = r.value;
  } catch {
    // DB not available (build time / cold start) — use defaults.
  }
  return map;
}

export function getDefaults(): ContentMap {
  return { ...DEFAULTS };
}
