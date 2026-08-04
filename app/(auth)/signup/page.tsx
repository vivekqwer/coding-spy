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
import { useContent } from "@/components/content-provider";

export default function SignupPage() {
  const router = useRouter();
  const c = useContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Could not create your agent profile.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    toast.success("Clearance granted. Welcome, Agent.");
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
            <CardTitle>{c("signup.title", "Request Clearance")}</CardTitle>
            <p className="text-sm text-muted-foreground">{c("signup.subtitle")}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? c("signup.submitLoading") : c("signup.submit", "Create Account")}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {c("signup.loginPrompt", "Already an agent?")}{" "}
              <Link href="/login" className="text-spy-cyan hover:underline">
                {c("signup.loginLink", "Sign in")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
