-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroBadge" TEXT NOT NULL DEFAULT 'Classified curriculum · 47 case files',
    "heroTitle" TEXT NOT NULL DEFAULT 'Decode. Learn. Master.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Free tutorials, live code, and hands-on missions.',
    "heroTagline" TEXT NOT NULL DEFAULT 'No sign-up needed, just start learning.',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Ready to earn your Agent Certification?',
    "ctaSubtitle" TEXT NOT NULL DEFAULT 'Finish a case file, pass the quiz at 70% or higher, and download your certificate.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
