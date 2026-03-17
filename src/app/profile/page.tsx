"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, User } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);
    const result = await updateProfile(formData);
    if (result?.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6 text-indigo-400" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
            <Avatar name={session.user.name} src={session.user.image} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-white">
                {session.user.name}
              </h2>
              <p className="text-sm text-zinc-400">{session.user.email}</p>
              <Badge
                variant={
                  session.user.role === "tutor" ? "default" : "secondary"
                }
                className="mt-1"
              >
                {session.user.role === "tutor" ? "Tutor" : "Student"}
              </Badge>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            {success && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                Profile updated successfully!
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Name</label>
              <Input
                name="name"
                defaultValue={session.user.name}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Bio</label>
              <Textarea
                name="bio"
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
            {session.user.role === "tutor" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Expertise
                </label>
                <Input
                  name="expertise"
                  placeholder="e.g. React, TypeScript, Node.js"
                />
                <p className="text-xs text-zinc-500">
                  Comma-separated skills
                </p>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
