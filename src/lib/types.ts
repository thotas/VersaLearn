import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

export type UserRole = "student" | "tutor";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseWithTutor {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  thumbnail: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  tutorId: string;
  tutor: {
    id: string;
    name: string;
    avatar: string | null;
    expertise: string | null;
  };
  _count?: {
    enrollments: number;
    lessons: number;
  };
}

export interface BlogPostWithAuthor {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  tags: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
  };
}
