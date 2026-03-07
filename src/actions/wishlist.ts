"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(courseId: string) {
  const session = await auth();

  if (!session?.user) {
    return { error: "You must be logged in to use the wishlist" };
  }

  const userId = session.user.id;

  // Check if already in wishlist
  const existingWishlist = await prisma.wishlist.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingWishlist) {
    // Remove from wishlist
    await prisma.wishlist.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/marketplace");
    revalidatePath("/");
    revalidatePath("/wishlist");
    return { success: true, inWishlist: false };
  } else {
    // Add to wishlist
    await prisma.wishlist.create({
      data: {
        userId,
        courseId,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/marketplace");
    revalidatePath("/");
    revalidatePath("/wishlist");
    return { success: true, inWishlist: true };
  }
}

export async function getWishlistStatus(courseId: string) {
  const session = await auth();

  if (!session?.user) {
    return { inWishlist: false };
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  return { inWishlist: !!wishlist };
}

export async function getWishlistCourses() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const wishlist = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      course: {
        include: {
          tutor: { select: { id: true, name: true, avatar: true } },
          _count: { select: { enrollments: true, lessons: true } },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return wishlist.map((w) => w.course);
}

export async function getWishlistCount() {
  const session = await auth();

  if (!session?.user) {
    return 0;
  }

  const count = await prisma.wishlist.count({
    where: {
      userId: session.user.id,
    },
  });

  return count;
}
