"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createBlogPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const tags = formData.get("tags") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  let slug = slugify(title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 200),
      tags,
      published: true,
      authorId: session.user.id,
    },
  });

  revalidatePath("/blog");
  return { success: true, slug: post.slug };
}

export async function updateBlogPost(postId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id) {
    return { error: "Post not found" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const tags = formData.get("tags") as string;

  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(excerpt && { excerpt }),
      ...(tags !== null && { tags }),
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return { success: true };
}

export async function deleteBlogPost(postId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id) {
    return { error: "Post not found" };
  }

  await prisma.blogPost.delete({ where: { id: postId } });

  revalidatePath("/blog");
  return { success: true };
}
