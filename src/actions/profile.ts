"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const expertise = formData.get("expertise") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name && { name }),
      ...(bio !== null && { bio }),
      ...(expertise !== null && { expertise }),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
