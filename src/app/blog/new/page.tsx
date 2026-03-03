"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createBlogPost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PenSquare } from "lucide-react";

export default function NewBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    const result = await createBlogPost(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.slug) {
      router.push(`/blog/${result.slug}`);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PenSquare className="h-6 w-6 text-indigo-400" />
            Write a Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Title</label>
              <Input
                name="title"
                placeholder="Your post title"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Content
              </label>
              <Textarea
                name="content"
                placeholder="Write your post content here... Use ## for headings and ``` for code blocks."
                required
                rows={15}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Excerpt
              </label>
              <Textarea
                name="excerpt"
                placeholder="Brief summary (optional — auto-generated if empty)"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Tags</label>
              <Input
                name="tags"
                placeholder="e.g. react,typescript,web-development"
              />
              <p className="text-xs text-zinc-500">
                Comma-separated tags
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Publish
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
