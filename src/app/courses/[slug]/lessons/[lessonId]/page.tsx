import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { updateLearningProgress } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { lessons: true } },
    },
  });

  if (!course) notFound();

  const currentLesson = course.lessons.find((l) => l.id === lessonId);
  if (!currentLesson) notFound();

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: session.user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  // Update learning progress
  await updateLearningProgress(course.id, lessonId, course.lessons.length);

  // Find previous and next lessons
  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;


  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${slug}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Course
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div>
                <p className="text-sm text-zinc-500">{course.title}</p>
                <h1 className="text-lg font-semibold text-white">{currentLesson.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {currentIndex + 1} / {course.lessons.length}
              </Badge>
              {currentLesson.duration && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {currentLesson.duration} min
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-zinc-900/30 border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>Course Progress</span>
            <span>{enrollment.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Lesson content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {currentLesson.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              {prevLesson ? (
                <Link href={`/courses/${slug}/lessons/${prevLesson.id}`}>
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous: {prevLesson.title}
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson && (
                <Link href={`/courses/${slug}/lessons/${nextLesson.id}`}>
                  <Button className="gap-2">
                    Next: {nextLesson.title}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {!nextLesson && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Course Completed!</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson list */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
              Course Content
            </h3>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => {
                const isActive = lesson.id === lessonId;
                const isAccessible = index <= course.lessons.length; // All lessons accessible

                return (
                  <Link
                    key={lesson.id}
                    href={isAccessible ? `/courses/${slug}/lessons/${lesson.id}` : "#"}
                    className={`block transition-all duration-200 ${
                      isAccessible ? "cursor-pointer hover:bg-zinc-800/50" : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    <Card
                      className={`transition-all duration-200 ${
                        isActive
                          ? "border-indigo-600 bg-indigo-600/10"
                          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-indigo-600 text-white"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium line-clamp-2 ${
                                isActive ? "text-indigo-400" : "text-zinc-300"
                              }`}
                            >
                              {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-xs text-zinc-500 mt-1">{lesson.duration} min</p>
                            )}
                          </div>
                          {enrollment.lastLessonId === lesson.id && (
                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
