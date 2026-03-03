import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Users } from "lucide-react";
import { MarketplaceFilters } from "@/components/marketplace-filters";

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
  searchParams: Promise<{ category?: string; level?: string; q?: string }>;
}) {
  const params = await searchParams;
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

  const courses = await prisma.course.findMany({
    where,
    include: {
      tutor: { select: { id: true, name: true, avatar: true } },
      _count: { select: { enrollments: true, lessons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Course Marketplace</h1>
        <p className="mt-2 text-zinc-400">
          Discover courses from expert tutors across all disciplines
        </p>
      </div>

      <MarketplaceFilters
        categories={categories}
        levels={levels}
        currentCategory={params.category}
        currentLevel={params.level}
        currentQuery={params.q}
      />

      {courses.length === 0 ? (
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
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="group h-full hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge>{course.category}</Badge>
                    <Badge
                      variant={
                        course.level === "advanced"
                          ? "warning"
                          : course.level === "intermediate"
                          ? "default"
                          : "success"
                      }
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={course.tutor.name}
                        src={course.tutor.avatar}
                        size="sm"
                      />
                      <span className="text-sm text-zinc-300">
                        {course.tutor.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course._count.lessons}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course._count.enrollments}
                      </span>
                    </div>
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
