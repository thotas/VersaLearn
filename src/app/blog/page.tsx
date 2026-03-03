import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PenSquare, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function BlogPage() {
  const session = await auth();

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: {
      author: {
        select: { id: true, name: true, avatar: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog</h1>
          <p className="mt-1 text-zinc-400">
            Insights, tutorials, and stories from our community
          </p>
        </div>
        {session?.user && (
          <Link href="/blog/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Write Post
            </Button>
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <PenSquare className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">
            No posts yet
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Be the first to share your knowledge
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 mb-6">
                <CardContent className="p-6">
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.split(",").map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={post.author.name}
                        src={post.author.avatar}
                        size="sm"
                      />
                      <div>
                        <span className="text-sm text-zinc-300">
                          {post.author.name}
                        </span>
                        {post.author.role === "tutor" && (
                          <Badge variant="default" className="ml-2 text-[10px]">
                            Tutor
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
