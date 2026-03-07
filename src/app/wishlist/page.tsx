import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/course-card";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const wishlistCourses = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          tutor: { select: { id: true, name: true, avatar: true } },
          _count: { select: { enrollments: true, lessons: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const courses = wishlistCourses.map((w) => w.course);

  // Get enrollment status for each course
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: session.user.id,
      courseId: { in: courses.map((c) => c.id) },
    },
    select: { courseId: true },
  });

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/marketplace">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
        </div>
        <p className="mt-2 text-zinc-400">
          Courses you've saved for later
        </p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Heart className="h-16 w-16 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium text-zinc-300">
              Your wishlist is empty
            </h3>
            <p className="mt-2 text-zinc-500 max-w-md">
              Browse the marketplace and click the heart icon on courses you want to save for later.
            </p>
            <Link href="/marketplace" className="mt-6">
              <Button>Explore Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-zinc-400 mb-6">
            {courses.length} {courses.length === 1 ? "course" : "courses"} saved
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                inWishlist={true}
                showEnrollButton={true}
                isEnrolled={enrolledCourseIds.has(course.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
