import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";

const categories = [
  { name: "Web Development", icon: "🌐", color: "from-blue-600 to-cyan-600" },
  { name: "Data Science", icon: "📊", color: "from-emerald-600 to-teal-600" },
  { name: "Design", icon: "🎨", color: "from-pink-600 to-rose-600" },
  { name: "AI & ML", icon: "🤖", color: "from-purple-600 to-violet-600" },
  { name: "Mobile Development", icon: "📱", color: "from-orange-600 to-amber-600" },
  { name: "DevOps", icon: "⚙️", color: "from-slate-600 to-zinc-600" },
];

export default async function Home() {
  const [featuredCourses, courseCount, tutorCount, studentCount] =
    await Promise.all([
      prisma.course.findMany({
        where: { published: true, featured: true },
        include: {
          tutor: { select: { id: true, name: true, avatar: true } },
          _count: { select: { enrollments: true, lessons: true } },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.count({ where: { published: true } }),
      prisma.user.count({ where: { role: "tutor" } }),
      prisma.user.count({ where: { role: "student" } }),
    ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-zinc-950 to-purple-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400 mb-8">
              <Sparkles className="h-4 w-4" />
              Platform for lifelong learners
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Learn from the{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                best
              </span>
              ,<br />
              become the{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                best
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
              Connect with expert tutors, discover curated courses, and
              accelerate your learning journey. Your next skill is just one
              course away.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2">
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                <BookOpen className="h-7 w-7 text-indigo-400" />
                {courseCount}
              </div>
              <p className="mt-1 text-sm text-zinc-400">Courses Available</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                <GraduationCap className="h-7 w-7 text-purple-400" />
                {tutorCount}
              </div>
              <p className="mt-1 text-sm text-zinc-400">Expert Tutors</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                <Users className="h-7 w-7 text-emerald-400" />
                {studentCount}
              </div>
              <p className="mt-1 text-sm text-zinc-400">Active Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Courses</h2>
            <p className="mt-1 text-zinc-400">
              Hand-picked courses to get you started
            </p>
          </div>
          <Link href="/marketplace">
            <Button variant="ghost" className="gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="group h-full hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge>{course.category}</Badge>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={course.tutor.name}
                        src={course.tutor.avatar}
                        size="sm"
                      />
                      <span className="text-sm text-zinc-300">
                        {course.tutor.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{course._count.lessons} lessons</span>
                      <span>{course._count.enrollments} enrolled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-zinc-800 bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">
              Explore by Category
            </h2>
            <p className="mt-1 text-zinc-400">
              Find the perfect course for your learning goals
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/marketplace?category=${encodeURIComponent(cat.name)}`}
              >
                <div className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${cat.color} text-xl`}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">VersaLearn</span>
            </div>
            <p className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} VersaLearn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
