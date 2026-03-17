import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Search, Heart } from "lucide-react";
import { MarketplaceFilters } from "@/components/marketplace-filters";
import { CourseCard } from "@/components/course-card";

const categories = [
  "All",
  "Web Development",
  "Data Science",
  "Design",
  "Mobile Development",
  "DevOps",
  "AI & ML",
];

const levels = ["All", "beginner", "intermediate", "advanced"];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; level?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  const sort = params.sort || "newest";

  const where: Record<string, unknown> = { published: true };

  if (params.category && params.category !== "All") {
    where.category = params.category;
  }
  if (params.level && params.level !== "All") {
    where.level = params.level;
  }
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
    ];
  }

  // Build orderBy based on sort parameter
  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "title_asc") {
    orderBy = { title: "asc" };
  }
  // For popularity and lessons, we'll sort after fetching since they require _count

  const courses = await prisma.course.findMany({
    where,
    include: {
      tutor: { select: { id: true, name: true, avatar: true } },
      _count: { select: { enrollments: true, lessons: true } },
    },
    orderBy,
  });

  // Sort by enrollments or lessons count for non-date sorts
  const sortedCourses = [...courses];
  if (sort === "popular") {
    sortedCourses.sort((a, b) => b._count.enrollments - a._count.enrollments);
  } else if (sort === "lessons") {
    sortedCourses.sort((a, b) => b._count.lessons - a._count.lessons);
  }

  // Get user's wishlist if logged in
  let wishlistCourseIds: string[] = [];
  if (session?.user) {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    });
    wishlistCourseIds = wishlist.map((w) => w.courseId);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Marketplace</h1>
          <p className="mt-2 text-zinc-400">
            Discover courses from expert tutors across all disciplines
          </p>
        </div>
        {session?.user && (
          <Link href="/wishlist">
            <Button variant="outline" className="gap-2">
              <Heart className="h-4 w-4" />
              My Wishlist
            </Button>
          </Link>
        )}
      </div>

      <MarketplaceFilters
        categories={categories}
        levels={levels}
        currentCategory={params.category}
        currentLevel={params.level}
        currentQuery={params.q}
        currentSort={sort}
      />

      {sortedCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">
            No courses found
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              inWishlist={wishlistCourseIds.includes(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
