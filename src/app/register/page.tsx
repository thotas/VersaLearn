"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, GraduationCap, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"student" | "tutor">("student");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    formData.set("role", role);
    const result = await registerUser(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join VersaLearn as a student or tutor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200",
                  role === "student"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600"
                )}
              >
                <User className="h-6 w-6" />
                <span className="text-sm font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("tutor")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200",
                  role === "tutor"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600"
                )}
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-sm font-medium">Tutor</span>
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                Full Name
              </label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Sign up as ${role === "tutor" ? "Tutor" : "Student"}`
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
