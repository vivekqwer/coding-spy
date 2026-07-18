"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { LogoWithWordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Access denied. Check your credentials, Agent.");
      return;
    }
    toast.success("Welcome back, Agent.");
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <LogoWithWordmark />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Agent Sign-In</CardTitle>
            <p className="text-sm text-muted-foreground">Access Mission Control and your Case Files.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying identity…" : "Sign In"}
              </Button>
            </form>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              type="button"
            >
              Continue with Google
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              New agent?{" "}
              <Link href="/signup" className="text-spy-cyan hover:underline">
                Request clearance
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
