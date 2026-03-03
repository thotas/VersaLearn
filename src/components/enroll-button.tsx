"use client";

import { useState } from "react";
import { enrollInCourse } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { Check, Loader2, UserPlus } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
}

export function EnrollButton({ courseId, isEnrolled }: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    const result = await enrollInCourse(courseId);
    if (result.success) {
      setEnrolled(true);
    }
    setLoading(false);
  }

  if (enrolled) {
    return (
      <Button variant="secondary" disabled className="gap-2">
        <Check className="h-4 w-4" />
        Enrolled
      </Button>
    );
  }

  return (
    <Button onClick={handleEnroll} disabled={loading} className="gap-2">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Enroll Now
        </>
      )}
    </Button>
  );
}
