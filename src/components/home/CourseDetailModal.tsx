import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, X, ChevronDown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Course } from "@/data/courses";
import { getCurrentLessonId } from "@/data/courses";

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailModal({ course, open, onOpenChange }: CourseDetailModalProps) {
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!course) return null;

  const bg = course.hero ?? course.thumb;
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const selectedModule =
    course.modules.find((m) => m.id === selectedModuleId) ?? course.modules[0];

  const handlePlay = () => {
    onOpenChange(false);
    navigate({
      to: "/ava/curso/$slug/aula/$lessonId",
      params: { slug: course.slug, lessonId: getCurrentLessonId(course) },
    });
  };

  const courseProgress = course.progress ?? 0;
  const completedInModule = Math.floor((courseProgress / 100) * selectedModule.lessons.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[870px] !w-[calc(100%-16px)] sm:!w-full p-0 overflow-hidden bg-[#15191a] border-border/40 rounded-2xl !translate-y-0 !top-2 sm:!top-[2vh] max-h-[96vh] sm:max-h-[92vh] overflow-y-auto scrollbar-hide [&>button.absolute]:hidden duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] data-[state=open]:slide-in-from-top-[60px] data-[state=closed]:slide-out-to-top-[40px] data-[state=open]:zoom-in-[0.98] data-[state=closed]:zoom-out-[0.98]">

        {/* ── Hero ── */}
        <div className="relative h-[240px] sm:h-[300px] flex-shrink-0 w-full overflow-hidden">
          {/* Background */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <img src={bg} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(102,102,102,0.6)] to-[rgba(0,0,0,0.6)]" />
          </div>

          {/* Close — absolute top-right, always visible */}
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-10 bg-[rgba(45,41,38,0.85)] w-10 h-10 rounded-full grid place-items-center hover:bg-[rgba(45,41,38,1)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Title + CTA — bottom-left */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2.5 items-start">
            <h2 className="font-display text-[32px] sm:text-[48px] leading-[0.95] tracking-[0.01em] text-[#f8f8f8] uppercase">
              {course.title}
            </h2>
            <button
              onClick={handlePlay}
              className="neon-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm sm:text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan shadow-[inset_0px_1px_0px_0px_rgba(15,246,241,0.35)]"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" aria-hidden="true" />
              {courseProgress > 0 ? "Continuar assistindo" : "Começar curso"}
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-4 sm:px-6 pt-0 pb-6 flex flex-col gap-4 sm:gap-5">

          {/* Course info + module dropdown — stack on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-white font-bold text-lg sm:text-xl leading-6 truncate">{course.title}</p>
              <p className="text-[#c4c4c4] text-xs">
                {course.modules.length} Módulos • {totalLessons} Aulas
              </p>
            </div>

            {/* Module selector — full width on mobile */}
            <div className="relative w-full sm:w-[366px] sm:flex-shrink-0">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                className="flex items-center justify-between gap-3 border border-[#6d6d6d] hover:border-foreground/60 rounded px-3 py-2 h-[44px] w-full text-white text-sm sm:text-base leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand overflow-hidden"
              >
                <span className="truncate text-left">
                  Módulo {selectedModule.id}: {selectedModule.title.replace(/^Módulo \d+ — /, "")}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {dropdownOpen && (
                <ul
                  role="listbox"
                  aria-label="Selecionar módulo"
                  className="absolute top-full left-0 right-0 mt-1 bg-[#1e2223] border border-[#6d6d6d] rounded shadow-card z-20 overflow-hidden max-h-60 overflow-y-auto scrollbar-hide animate-in fade-in-0 slide-in-from-top-1 duration-150"
                >
                  {course.modules.map((m) => (
                    <li key={m.id} role="option" aria-selected={m.id === selectedModuleId}>
                      <button
                        onClick={() => {
                          setSelectedModuleId(m.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:bg-white/10 ${
                          m.id === selectedModuleId ? "text-cyan font-semibold" : "text-white"
                        }`}
                      >
                        Módulo {m.id}: {m.title.replace(/^Módulo \d+ — /, "")}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Lesson list */}
          <div className="flex flex-col">
            {/* "N AULAS" label — outside the list, py-3 */}
            <p className="text-[#c4c4c4] text-xs py-2 leading-6">
              Módulo {selectedModule.id}: {selectedModule.title.replace(/^Módulo \d+ — /, "")} • {selectedModule.lessons.length} Aulas
            </p>

            <div className="flex flex-col">
              {selectedModule.lessons.map((lesson, index) => {
                const status: "complete" | "in-progress" | "not-started" =
                  index < completedInModule
                    ? "complete"
                    : index === completedInModule && courseProgress > 0
                      ? "in-progress"
                      : "not-started";
                const lessonProgress = status === "in-progress" ? courseProgress : 0;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      onOpenChange(false);
                      navigate({
                        to: "/ava/curso/$slug/aula/$lessonId",
                        params: { slug: course.slug, lessonId: String(lesson.id) },
                      });
                    }}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg w-full text-left transition-colors hover:bg-[#27282a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                    aria-label={`Aula ${index + 1}: ${lesson.title} — ${lesson.duration}`}
                  >
                    {/* Left: thumbnail + info */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {/* Thumbnail */}
                      <div className="relative w-[72px] h-[48px] sm:w-[120px] sm:h-[80px] rounded flex-shrink-0 overflow-hidden">
                        <img
                          src={course.thumb}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Red progress bar */}
                        {lessonProgress > 0 && (
                          <>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" />
                            <div
                              className="absolute bottom-0 left-0 h-1 bg-red-500/80"
                              style={{ width: `${lessonProgress}%` }}
                            />
                          </>
                        )}
                        {/* Play */}
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="w-8 h-8 rounded-full bg-white/95 grid place-items-center shadow-[0_0_8px_rgba(53,138,255,0.4)]">
                            <Play
                              className="w-3 h-3 fill-current text-black ml-0.5"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Title + badge */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-white font-bold text-sm sm:text-base leading-5 sm:leading-6 line-clamp-2 sm:truncate">
                          {index + 1}. {lesson.title}
                        </p>
                        {status === "complete" && (
                          <span className="inline-flex self-start items-center px-2 py-0.5 rounded text-[10px] font-bold text-[#f8f8f8] bg-[rgba(1,170,6,0.2)]">
                            COMPLETA
                          </span>
                        )}
                        {status === "in-progress" && (
                          <span className="inline-flex self-start items-center px-2 py-0.5 rounded text-[10px] font-bold text-[#f8f8f8] bg-[rgba(1,60,170,0.2)]">
                            {lessonProgress}% PARA CONCLUIR
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <span className="text-[#c4c4c4] text-xs leading-6 flex-shrink-0">
                      {lesson.duration}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
