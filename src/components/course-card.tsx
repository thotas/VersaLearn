import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { BookOpen, Users } from "lucide-react";
import { WishlistButton } from "@/components/wishlist-button";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    level: string;
    tutor: {
      id: string;
      name: string;
      avatar: string | null;
    };
    _count?: {
      enrollments: number;
      lessons: number;
    };
  };
  inWishlist?: boolean;
  showWishlist?: boolean;
}

export function CourseCard({ course, inWishlist = false, showWishlist = true }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="group h-full hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
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
            {showWishlist && (
              <WishlistButton courseId={course.id} initialInWishlist={inWishlist} />
            )}
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
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
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {course._count?.lessons ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {course._count?.enrollments ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
