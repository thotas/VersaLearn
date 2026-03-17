import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Eye } from "lucide-react";
import { TutorCourseManager } from "@/components/tutor-course-manager";

export default async function TutorDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "tutor") {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    where: { tutorId: session.user.id },
    include: {
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true, lessons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce(
    (sum, c) => sum + c._count.enrollments,
    0
  );
  const publishedCount = courses.filter((c) => c.published).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tutor Dashboard</h1>
        <p className="mt-1 text-zinc-400">
          Manage your courses and track your students
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20">
              <BookOpen className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{courses.length}</p>
              <p className="text-sm text-zinc-400">Total Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalStudents}</p>
              <p className="text-sm text-zinc-400">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
              <Eye className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{publishedCount}</p>
              <p className="text-sm text-zinc-400">Published</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <TutorCourseManager
        initialCourses={JSON.parse(JSON.stringify(courses))}
      />
    </div>
  );
}
