import { useState } from "react";
import type { Course } from "@/data/courses";
import { CourseDetailModal } from "./CourseDetailModal";

export function useCourseModal() {
  const [course, setCourse] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);

  const show = (c: Course) => {
    setCourse(c);
    setOpen(true);
  };

  const Modal = () => (
    <CourseDetailModal course={course} open={open} onOpenChange={setOpen} />
  );

  return { show, Modal };
}
