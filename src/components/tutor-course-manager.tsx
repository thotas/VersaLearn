"use client";

import { useState } from "react";
import {
  createCourse,
  togglePublishCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
} from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  published: boolean;
  lessons: {
    id: string;
    title: string;
    content: string;
    order: number;
    duration: number | null;
  }[];
  _count: { enrollments: number; lessons: number };
}

const categories = [
  "Web Development",
  "Data Science",
  "Design",
  "Mobile Development",
  "DevOps",
  "AI & ML",
];

export function TutorCourseManager({
  initialCourses,
}: {
  initialCourses: CourseData[];
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);

  async function handleCreateCourse(formData: FormData) {
    setCreating(true);
    await createCourse(formData);
    setCreating(false);
    setShowCreate(false);
  }

  async function handleTogglePublish(courseId: string) {
    await togglePublishCourse(courseId);
  }

  async function handleDeleteCourse(courseId: string) {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(courseId);
    }
  }

  async function handleAddLesson(courseId: string, formData: FormData) {
    await addLesson(courseId, formData);
    setAddingLesson(null);
  }

  async function handleDeleteLesson(lessonId: string) {
    if (confirm("Delete this lesson?")) {
      await deleteLesson(lessonId);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">My Courses</h2>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? "Cancel" : "Create Course"}
        </Button>
      </div>

      {/* Create Course Form */}
      {showCreate && (
        <Card className="border-indigo-500/30 bg-indigo-500/5">
          <CardContent className="p-6">
            <form action={handleCreateCourse} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Course Title
                  </label>
                  <Input name="title" placeholder="e.g. React Masterclass" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Description
                </label>
                <Textarea
                  name="description"
                  placeholder="What will students learn?"
                  required
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Level
                </label>
                <select
                  name="level"
                  className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <Button type="submit" disabled={creating} className="gap-2">
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Course
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Course list */}
      {initialCourses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-zinc-300">
              No courses yet
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Create your first course to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {initialCourses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{course.category}</Badge>
                      <Badge variant="secondary">{course.level}</Badge>
                      {course.published ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                      <span>{course._count.lessons} lessons</span>
                      <span>{course._count.enrollments} students</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePublish(course.id)}
                      title={course.published ? "Unpublish" : "Publish"}
                    >
                      {course.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setExpandedCourse(
                          expandedCourse === course.id ? null : course.id
                        )
                      }
                    >
                      {expandedCourse === course.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded lessons */}
                {expandedCourse === course.id && (
                  <div className="mt-6 border-t border-zinc-800 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-zinc-300">
                        Lessons
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setAddingLesson(
                            addingLesson === course.id ? null : course.id
                          )
                        }
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add Lesson
                      </Button>
                    </div>

                    {addingLesson === course.id && (
                      <form
                        action={(fd) => handleAddLesson(course.id, fd)}
                        className="mb-4 space-y-3 rounded-lg border border-zinc-700 bg-zinc-800/30 p-4"
                      >
                        <Input
                          name="title"
                          placeholder="Lesson title"
                          required
                        />
                        <Textarea
                          name="content"
                          placeholder="Lesson content..."
                          required
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Input
                            name="duration"
                            type="number"
                            placeholder="Duration (min)"
                            className="w-40"
                          />
                          <Button type="submit" size="sm">
                            Add
                          </Button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-2">
                      {course.lessons.map((lesson, i) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 rounded-lg bg-zinc-800/30 px-4 py-3"
                        >
                          <span className="text-xs font-medium text-zinc-500 w-6">
                            {i + 1}
                          </span>
                          <span className="flex-1 text-sm text-zinc-300">
                            {lesson.title}
                          </span>
                          {lesson.duration && (
                            <span className="text-xs text-zinc-500">
                              {lesson.duration}m
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {course.lessons.length === 0 && (
                        <p className="text-sm text-zinc-500 text-center py-4">
                          No lessons yet. Add your first lesson above.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
