import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

function renderContent(content: string) {
  const blocks = content.split("\n\n");
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-xl font-semibold text-white mt-8 mb-3"
        >
          {block.replace("## ", "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="text-lg font-semibold text-zinc-200 mt-6 mb-2"
        >
          {block.replace("### ", "")}
        </h3>
      );
    }
    if (block.startsWith("```")) {
      const lines = block.split("\n");
      const code = lines.slice(1, -1).join("\n");
      return (
        <pre
          key={i}
          className="my-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300"
        >
          <code>{code}</code>
        </pre>
      );
    }
    return (
      <p key={i} className="text-zinc-400 leading-relaxed mb-4">
        {block}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, avatar: true, bio: true, role: true },
      },
    },
  });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/blog">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      <article>
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.split(",").map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold text-white leading-tight">
          {post.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 border-b border-zinc-800 pb-6">
          <Avatar
            name={post.author.name}
            src={post.author.avatar}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-200">
                {post.author.name}
              </span>
              {post.author.role === "tutor" && (
                <Badge variant="default" className="text-[10px]">
                  Tutor
                </Badge>
              )}
            </div>
            <span className="text-sm text-zinc-500">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="mt-8 prose-invert max-w-none">
          {renderContent(post.content)}
        </div>
      </article>
    </div>
  );
}
