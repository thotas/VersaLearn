"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCalendarEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const color = formData.get("color") as string;

  if (!title || !startTime || !endTime) {
    return { error: "Title, start time, and end time are required" };
  }

  await prisma.calendarEvent.create({
    data: {
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color: color || "#6366f1",
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/student");
  return { success: true };
}

export async function updateCalendarEvent(
  eventId: string,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const event = await prisma.calendarEvent.findUnique({
    where: { id: eventId },
  });
  if (!event || event.userId !== session.user.id) {
    return { error: "Event not found" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const color = formData.get("color") as string;

  await prisma.calendarEvent.update({
    where: { id: eventId },
    data: {
      ...(title && { title }),
      ...(description !== null && { description }),
      ...(startTime && { startTime: new Date(startTime) }),
      ...(endTime && { endTime: new Date(endTime) }),
      ...(color && { color }),
    },
  });

  revalidatePath("/dashboard/student");
  return { success: true };
}

export async function deleteCalendarEvent(eventId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const event = await prisma.calendarEvent.findUnique({
    where: { id: eventId },
  });
  if (!event || event.userId !== session.user.id) {
    return { error: "Event not found" };
  }

  await prisma.calendarEvent.delete({ where: { id: eventId } });

  revalidatePath("/dashboard/student");
  return { success: true };
}
