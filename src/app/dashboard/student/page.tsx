import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { StudentCalendar } from "@/components/student-calendar";
import { formatDate } from "@/lib/utils";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [enrollments, calendarEvents] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: session.user.id },
      include: {
        course: {
          include: {
            tutor: { select: { name: true, avatar: true } },
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.calendarEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
        <p className="mt-1 text-zinc-400">
          Track your courses and manage your schedule
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
              <p className="text-2xl font-bold text-white">
                {enrollments.length}
              </p>
              <p className="text-sm text-zinc-400">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {enrollments.length > 0
                  ? Math.round(
                      enrollments.reduce((s, e) => s + e.progress, 0) /
                        enrollments.length
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-zinc-400">Avg. Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {calendarEvents.filter(
                  (e) => new Date(e.startTime) >= new Date()
                ).length}
              </p>
              <p className="text-sm text-zinc-400">Upcoming Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Enrolled Courses */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            My Courses
          </h2>
          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-zinc-600 mb-4" />
                <h3 className="text-lg font-medium text-zinc-300">
                  No courses yet
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Browse the{" "}
                  <Link
                    href="/marketplace"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    marketplace
                  </Link>{" "}
                  to find courses
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.course.slug}`}
                >
                  <Card className="group hover:border-zinc-700 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">
                          {enrollment.course.category}
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          {enrollment.course._count.lessons} lessons
                        </span>
                      </div>
                      <h3 className="font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
                        {enrollment.course.title}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        by {enrollment.course.tutor.name}
                      </p>
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-400">Progress</span>
                          <span className="text-zinc-300 font-medium">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                            style={{
                              width: `${enrollment.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            My Calendar
          </h2>
          <StudentCalendar
            initialEvents={JSON.parse(JSON.stringify(calendarEvents))}
          />
        </div>
      </div>
    </div>
  );
}
