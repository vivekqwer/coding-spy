-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "ctaButtonLabel" TEXT NOT NULL DEFAULT 'Start Your First Mission',
ADD COLUMN     "heroFeatures" TEXT NOT NULL DEFAULT 'Clearance Level tracking
Live code playground
Agent Certification
AI-powered hints',
ADD COLUMN     "heroPrimaryCtaHref" TEXT NOT NULL DEFAULT '/signup',
ADD COLUMN     "heroPrimaryCtaLabel" TEXT NOT NULL DEFAULT 'Request Clearance',
ADD COLUMN     "heroSecondaryCtaHref" TEXT NOT NULL DEFAULT '#case-files',
ADD COLUMN     "heroSecondaryCtaLabel" TEXT NOT NULL DEFAULT 'Browse Case Files',
ADD COLUMN     "labCardCode" TEXT NOT NULL DEFAULT 'function demo() {
  console.log("Welcome, Agent.");
}

demo();',
ADD COLUMN     "labCardDescription" TEXT NOT NULL DEFAULT 'Every case file ships with a live Monaco editor, sandboxed preview, real terminal, and an AI hint on request.',
ADD COLUMN     "labCardLabel" TEXT NOT NULL DEFAULT 'The Lab',
ADD COLUMN     "labCardTitle" TEXT NOT NULL DEFAULT 'Run real code, right in the browser.',
ADD COLUMN     "moreCaseFilesTitle" TEXT NOT NULL DEFAULT 'More Case Files';
