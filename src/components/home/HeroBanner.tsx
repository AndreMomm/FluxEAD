import { Play, Info } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { Course } from "@/data/courses";
import { getCurrentLessonId } from "@/data/courses";

interface HeroBannerProps {
  course: Course;
  onMoreInfo: (course: Course) => void;
}

export function HeroBanner({ course, onMoreInfo }: HeroBannerProps) {
  const navigate = useNavigate();
  const bg = course.hero ?? course.thumb;

  return (
    <section className="relative w-full h-[620px] sm:h-[729px] overflow-hidden">
      {/* Background image */}
      <img
        src={bg}
        alt={course.title}
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />

      {/* Left gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(5,6,9,0.95)] via-[rgba(5,6,9,0.5)] via-[40%] to-[rgba(5,6,9,0)] to-[80%]" />
      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-[rgba(5,6,9,0.6)] via-[35%] to-[rgba(5,6,9,0)] to-[70%]" />

      {/* Content */}
      <div className="relative h-full flex items-start pt-[120px] sm:items-center sm:pt-0 px-4 sm:px-12 max-w-[768px]">
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Label + heading + description */}
          <div className="flex flex-col gap-4">
            {/* Label + heading group */}
            <div className="flex flex-col gap-2">
              {/* "Em destaque" label */}
              <div className="flex items-center gap-0 h-4">
                <span className="w-8 h-px bg-[#358aff] flex-shrink-0" />
                <span className="ml-2 text-xs font-normal uppercase tracking-[2.4px] text-[rgba(248,248,248,0.9)]">
                  Em destaque
                </span>
              </div>

              {/* Heading */}
              <h1
                className="font-display text-[40px] sm:text-[72px] leading-[0.92] sm:leading-[68.4px] tracking-[0.72px] text-[#f8f8f8]"
                style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.15)" }}
              >
                {course.title}
              </h1>
            </div>

            {/* Description */}
            <p
              className="text-base sm:text-[18px] leading-6 sm:leading-[28px] text-[rgba(248,248,248,0.85)] max-w-[576px]"
              style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.06)" }}
            >
              {course.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <button
              onClick={() =>
                navigate({
                  to: "/ava/curso/$slug/aula/$lessonId",
                  params: { slug: course.slug, lessonId: getCurrentLessonId(course) },
                })
              }
              className="neon-btn inline-flex items-center gap-1.5 px-8 py-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan shadow-[inset_0px_1px_0px_0px_rgba(15,246,241,0.35)]"
            >
              <Play className="w-5 h-5 fill-current flex-shrink-0" aria-hidden="true" />
              Assistir
            </button>

            <button
              onClick={() => onMoreInfo(course)}
              className="inline-flex items-center gap-1.5 bg-[rgba(24,26,32,0.6)] border border-white/25 text-[#f8f8f8] px-8 py-3 rounded-full font-semibold text-base leading-6 hover:bg-[rgba(65,70,85,0.75)] hover:border-white/40 transition-colors backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Info className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
