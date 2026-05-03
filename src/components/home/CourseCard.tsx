import type { Course } from "@/data/courses";
import { getCurrentLessonId } from "@/data/courses";
import { Play, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

const PANEL_W = 300;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(v, hi));
}

function getPanelPos(rect: DOMRect) {
  const left = clamp(
    rect.left + rect.width / 2 - PANEL_W / 2,
    8,
    window.innerWidth - PANEL_W - 8,
  );
  // align panel top near card top, keep within viewport
  const top = clamp(rect.top - 8, 72, window.innerHeight - 340);
  return { left, top };
}

// ── Hover panel (rendered into document.body via portal) ────────────────────

interface PanelProps {
  course: Course;
  pos: { left: number; top: number };
  onEnter: () => void;
  onLeave: () => void;
  onSelect: (c: Course) => void;
  onPlay: () => void;
}

function HoverPanel({ course, pos, onEnter, onLeave, onSelect, onPlay }: PanelProps) {
  const bg = course.hero ?? course.thumb;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: PANEL_W, zIndex: 9999 }}
      className="rounded-xl overflow-hidden bg-card border border-border/40 shadow-[0_36px_90px_-12px_oklch(0_0_0/0.95),_0_0_50px_oklch(0.66_0.22_260/0.15)] animate-in fade-in-0 zoom-in-[0.94] slide-in-from-bottom-2 duration-300 [animation-timing-function:cubic-bezier(0.22,1,0.36,1)]"
    >
      {/* ── Thumbnail ── */}
      <div className="relative aspect-video">
        <img src={bg} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />

          {/* Title overlay */}
        <div className="absolute bottom-3 left-4 right-12">
          <p className="font-display text-2xl leading-tight drop-shadow-2xl">{course.title}</p>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="neon-btn w-10 h-10 rounded-full grid place-items-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            aria-label={`Assistir ${course.title}`}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(course);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold text-foreground/80 hover:text-foreground border border-foreground/25 hover:border-foreground/60 rounded-full px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={`Ver detalhes de ${course.title}`}
          >
            Ver detalhes
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Meta badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {course.progress != null && course.progress > 0 && course.progress < 100 && (
            <span className="text-emerald-400 font-semibold">{course.progress}% concluído</span>
          )}
          {course.progress === 100 && (
            <span className="text-brand font-semibold">Concluído</span>
          )}
          {course.isNew && !course.progress && (
            <span className="text-brand font-semibold">Novo</span>
          )}
          <span className="text-muted-foreground">{course.year}</span>
          <span className="text-muted-foreground">{course.duration}</span>
          <span className="bg-white/10 backdrop-blur-sm text-[#f8f8f8] text-[10px] font-bold px-2 py-1 rounded leading-[10px] border border-white/15">
            {course.level}
          </span>
        </div>

        {/* Tags */}
        <p className="text-xs text-foreground/60 leading-relaxed">
          {course.category} • {course.instructor.name}
        </p>
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function CourseCard({ course, onSelect }: CourseCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();

  const isHoverDevice = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const scheduleOpen = () => {
    if (!isHoverDevice()) return;
    clearTimeout(closeTimer.current);
    if (!panelOpen) {
      openTimer.current = setTimeout(() => {
        if (cardRef.current) {
          setRect(cardRef.current.getBoundingClientRect());
          setPanelOpen(true);
        }
      }, 320);
    }
  };

  const scheduleClose = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setPanelOpen(false), 200);
  };

  const cancelClose = () => clearTimeout(closeTimer.current);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    [],
  );

  // Close on scroll so panel doesn't drift
  useEffect(() => {
    if (!panelOpen) return;
    const close = () => setPanelOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [panelOpen]);

  const pos = rect ? getPanelPos(rect) : null;

  return (
    <>
      <button
        ref={cardRef}
        onClick={() => onSelect(course)}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        className="group/card relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] aspect-[2/3] rounded-md overflow-hidden bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label={course.title}
        aria-haspopup="true"
        aria-expanded={panelOpen}
      >
        <img
          src={course.thumb}
          alt={course.title}
          loading="lazy"
          width={512}
          height={768}
          className="w-full h-full object-cover transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.05]"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {course.isTop10 && (
            <span className="bg-red-600/70 backdrop-blur-sm text-[#f8f8f8] text-[10px] font-bold px-2 py-1 rounded leading-[10px]">
              TOP 10
            </span>
          )}
          {course.isNew && (
            <span className="bg-cyan/70 backdrop-blur-sm text-[#f8f8f8] text-[10px] font-bold px-2 py-1 rounded leading-[10px]">
              NOVO
            </span>
          )}
        </div>

        {/* Progress bar */}
        {course.progress != null && course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
            <div className="h-full bg-destructive" style={{ width: `${course.progress}%` }} />
          </div>
        )}
      </button>

      {panelOpen &&
        pos &&
        createPortal(
          <HoverPanel
            course={course}
            pos={pos}
            onEnter={cancelClose}
            onLeave={scheduleClose}
            onSelect={(c) => {
              setPanelOpen(false);
              onSelect(c);
            }}
            onPlay={() => {
              setPanelOpen(false);
              navigate({
                to: "/ava/curso/$slug/aula/$lessonId",
                params: { slug: course.slug, lessonId: getCurrentLessonId(course) },
              });
            }}
          />,
          document.body,
        )}
    </>
  );
}
