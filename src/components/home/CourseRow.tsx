import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Course } from "@/data/courses";
import { CourseCard } from "./CourseCard";

interface CourseRowProps {
  title: string;
  courses: Course[];
  onSelect: (course: Course) => void;
  numbered?: boolean;
}

export function CourseRow({ title, courses, onSelect, numbered }: CourseRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => setHasOverflow(el.scrollWidth > el.clientWidth + 4);
    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [courses]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!courses.length) return null;

  return (
    <section className="px-4 md:px-12 mb-10 group/row">
      <h2 className="font-display text-xl md:text-2xl mb-3 tracking-wide">{title}</h2>
      <div className="relative">
        {hasOverflow && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="hidden md:grid place-items-center absolute left-0 top-0 bottom-0 z-10 w-10 bg-background/70 hover:bg-background/90 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          ref={ref}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        >
          {courses.map((c, i) => (
            <div key={c.slug} className="flex items-end gap-2 flex-shrink-0">
              {numbered && (
                <span
                  className="font-display text-7xl md:text-9xl leading-none text-transparent select-none"
                  style={{ WebkitTextStroke: "2px oklch(0.45 0.012 270)" }}
                >
                  {i + 1}
                </span>
              )}
              <CourseCard course={c} onSelect={onSelect} />
            </div>
          ))}
        </div>

        {hasOverflow && (
          <button
            onClick={() => scroll(1)}
            aria-label="Próximo"
            className="hidden md:grid place-items-center absolute right-0 top-0 bottom-0 z-10 w-10 bg-background/70 hover:bg-background/90 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  );
}
