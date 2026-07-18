"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function NavAuthLinks({ userName }: { userName: string | null }) {
  if (userName) {
    return (
      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
      </Button>
    );
  }
  return (
    <Link href="/login">
      <Button size="sm">Agent Sign-In</Button>
    </Link>
  );
}
