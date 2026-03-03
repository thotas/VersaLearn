import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EnrollButton } from "@/components/enroll-button";
import { BookOpen, Clock, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      tutor: {
        select: { id: true, name: true, avatar: true, bio: true, expertise: true },
      },
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  let isEnrolled = false;
  if (session?.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId: course.id,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  const totalDuration = course.lessons.reduce(
    (sum, l) => sum + (l.duration || 0),
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/marketplace">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
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
            <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              {course.description}
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {course.lessons.length} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {totalDuration} min total
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {course._count.enrollments} enrolled
              </span>
            </div>
          </div>

          {/* Lessons */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Course Content
            </h2>
            <div className="space-y-3">
              {course.lessons.map((lesson, i) => (
                <Card key={lesson.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-medium text-zinc-400">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-zinc-200">
                        {lesson.title}
                      </h3>
                    </div>
                    {lesson.duration && (
                      <span className="text-xs text-zinc-500 shrink-0">
                        {lesson.duration} min
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
              {course.lessons.length === 0 && (
                <p className="text-sm text-zinc-500 py-8 text-center">
                  No lessons published yet. Check back soon!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enroll card */}
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Free</p>
                <p className="text-sm text-zinc-500 mt-1">
                  No payment required
                </p>
              </div>
              {session?.user ? (
                session.user.id !== course.tutorId && (
                  <EnrollButton
                    courseId={course.id}
                    isEnrolled={isEnrolled}
                  />
                )
              ) : (
                <Link href="/login">
                  <Button className="w-full">Sign in to Enroll</Button>
                </Link>
              )}

              {/* Tutor info */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  Instructor
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={course.tutor.name}
                    src={course.tutor.avatar}
                    size="lg"
                  />
                  <div>
                    <p className="font-medium text-white">
                      {course.tutor.name}
                    </p>
                    {course.tutor.expertise && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.tutor.expertise
                          .split(",")
                          .slice(0, 3)
                          .map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                {course.tutor.bio && (
                  <p className="mt-3 text-sm text-zinc-400">
                    {course.tutor.bio}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
