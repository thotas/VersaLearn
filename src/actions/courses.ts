"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "tutor") {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;

  if (!title || !description || !category) {
    return { error: "Title, description, and category are required" };
  }

  let slug = slugify(title);
  const existing = await prisma.course.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description,
      category,
      level: level || "beginner",
      tutorId: session.user.id,
    },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/tutor");
  return { success: true, courseId: course.id, slug: course.slug };
}

export async function updateCourse(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "tutor") {
    return { error: "Unauthorized" };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.tutorId !== session.user.id) {
    return { error: "Course not found" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;

  await prisma.course.update({
    where: { id: courseId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(level && { level }),
    },
  });

  revalidatePath("/marketplace");
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/dashboard/tutor");
  return { success: true };
}

export async function togglePublishCourse(courseId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "tutor") {
    return { error: "Unauthorized" };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.tutorId !== session.user.id) {
    return { error: "Course not found" };
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { published: !course.published },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/tutor");
  return { success: true, published: !course.published };
}

export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "tutor") {
    return { error: "Unauthorized" };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.tutorId !== session.user.id) {
    return { error: "Course not found" };
  }

  await prisma.course.delete({ where: { id: courseId } });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/tutor");
  return { success: true };
}

export async function addLesson(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "tutor") {
    return { error: "Unauthorized" };
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { lessons: true } } },
  });
  if (!course || course.tutorId !== session.user.id) {
    return { error: "Course not found" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const duration = formData.get("duration") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  await prisma.lesson.create({
    data: {
      title,
      content,
      duration: duration ? parseInt(duration) : null,
      order: course._count.lessons + 1,
      courseId,
    },
  });

  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/dashboard/tutor");
  return { success: true };
}

export async function deleteLesson(lessonId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "tutor") {
    return { error: "Unauthorized" };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson || lesson.course.tutorId !== session.user.id) {
    return { error: "Lesson not found" };
  }

  await prisma.lesson.delete({ where: { id: lessonId } });

  revalidatePath(`/courses/${lesson.course.slug}`);
  return { success: true };
}

export async function enrollInCourse(courseId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Please log in to enroll" };
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: session.user.id,
        courseId,
      },
    },
  });

  if (existing) {
    return { error: "Already enrolled" };
  }

  await prisma.enrollment.create({
    data: {
      studentId: session.user.id,
      courseId,
    },
  });

  revalidatePath("/dashboard/student");
  return { success: true };
}

export async function unenrollFromCourse(courseId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await prisma.enrollment.delete({
    where: {
      studentId_courseId: {
        studentId: session.user.id,
        courseId,
      },
    },
  });

  revalidatePath("/dashboard/student");
  return { success: true };
}

export async function updateLearningProgress(courseId: string, lessonId: string, totalLessons: number) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Get the lesson to calculate progress
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson || lesson.courseId !== courseId) {
    return { error: "Lesson not found" };
  }

  // Calculate progress as percentage of lessons completed up to and including this lesson
  const progress = Math.min(100, Math.round((lesson.order / totalLessons) * 100));

  await prisma.enrollment.update({
    where: {
      studentId_courseId: {
        studentId: session.user.id,
        courseId,
      },
    },
    data: {
      lastLessonId: lessonId,
      progress,
    },
  });

  revalidatePath("/dashboard/student");
  revalidatePath(`/courses/${lesson.courseId}`);
  return { success: true, progress };
}
