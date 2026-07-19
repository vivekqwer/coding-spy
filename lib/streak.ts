import { prisma } from "@/lib/prisma";

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isYesterday(prev: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(prev, yesterday);
}

/** Call whenever a logged-in agent does something meaningful (view a lesson, save code, pass a quiz). */
export async function recordActivity(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveAt: true, currentStreak: true, longestStreak: true },
  });
  if (!user) return;

  const now = new Date();

  if (user.lastActiveAt && isSameDay(user.lastActiveAt, now)) {
    return; // already recorded today
  }

  const nextStreak = user.lastActiveAt && isYesterday(user.lastActiveAt, now) ? user.currentStreak + 1 : 1;

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastActiveAt: now,
      currentStreak: nextStreak,
      longestStreak: Math.max(nextStreak, user.longestStreak),
    },
  });
}
