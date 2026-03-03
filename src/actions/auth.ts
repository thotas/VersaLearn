"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: role === "tutor" ? "/dashboard/tutor" : "/dashboard/student",
  });
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid credentials" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo:
        user.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student",
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "type" in error &&
      error.type === "CredentialsSignin"
    ) {
      return { error: "Invalid credentials" };
    }
    throw error;
  }
}
