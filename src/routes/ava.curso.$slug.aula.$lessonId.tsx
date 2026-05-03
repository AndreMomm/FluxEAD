import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCourseBySlug } from "@/data/courses";
import {
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  BookOpen,
  X,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ava/curso/$slug/aula/$lessonId")({
  head: () => ({
    meta: [
      { title: "Assistir aula — FluxEAD" },
      { name: "description", content: "Player de aula em destaque." },
    ],
  }),
  loader: ({ params }) => {
    const course = getCourseBySlug(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  component: Watch,
  notFoundComponent: () => (
    <main className="pt-24 px-12">
      <p>Curso não encontrado.</p>
    </main>
  ),
});

function Watch() {
  const { course } = Route.useLoaderData();
  const { lessonId } = Route.useParams();
  const currentLessonId = Number(lessonId);

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentLesson =
    allLessons.find((l) => l.id === currentLessonId) ?? allLessons[0];
  const currentModule =
    course.modules.find((m) => m.lessons.some((l) => l.id === currentLesson.id)) ??
    course.modules[0];

  const [expandedModuleId, setExpandedModuleId] = useState<number>(currentModule.id);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const courseProgress = course.progress ?? 0;
  const completedCount = Math.floor((courseProgress / 100) * allLessons.length);

  return (
    <div className="h-screen flex flex-col pt-16 overflow-hidden">
      {/* Skip link */}
      <a
        href="#player"
        className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-brand-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        Ir para o player
      </a>

      {/* Context bar */}
      <div className="flex flex-shrink-0 border-b border-border/60 bg-card/80 text-xs">
        <div className="hidden lg:flex items-center w-[380px] flex-shrink-0 px-5 py-2.5 border-r border-border/60 gap-2 truncate">
          <span className="text-muted-foreground uppercase tracking-wider text-[10px] flex-shrink-0">Você está em</span>
          <span className="text-foreground font-medium truncate">{course.title}</span>
        </div>
        <div className="flex items-center flex-1 px-4 py-2.5 gap-2 truncate">
          <span className="text-muted-foreground uppercase tracking-wider text-[10px] flex-shrink-0 hidden sm:inline">Você está assistindo</span>
          <span className="text-foreground font-medium truncate">{currentLesson.title}</span>
        </div>
        {/* Mobile: open modules drawer */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Ver módulos e aulas"
          className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 text-muted-foreground hover:text-foreground transition-colors border-l border-border/60 flex-shrink-0 focus-visible:outline-none focus-visible:bg-muted/30"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span className="text-[11px] font-medium">Módulos</span>
        </button>
      </div>

      {/* Mobile modules drawer (slide from left) */}
      {mobileSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-card flex flex-col lg:hidden animate-in slide-in-from-left duration-300"
            role="dialog"
            aria-label="Módulos e aulas"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 pt-16 pb-4 border-b border-border/60">
              <div>
                <p className="text-xs text-muted-foreground truncate">{course.title}</p>
                <div
                  role="progressbar"
                  aria-valuenow={courseProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${courseProgress}% concluído`}
                  className="mt-2 h-1.5 w-48 bg-muted rounded-full overflow-hidden"
                >
                  <div className="h-full bg-brand rounded-full" style={{ width: `${courseProgress}%` }} />
                </div>
                <p className="text-xs text-brand mt-1">{courseProgress}% concluído</p>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Fechar"
                className="w-8 h-8 rounded-full bg-muted/40 grid place-items-center hover:bg-muted/70 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Module accordion */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {course.modules.map((m) => {
                const isExpanded = expandedModuleId === m.id;
                const moduleHasCurrent = m.lessons.some((l) => l.id === currentLesson.id);
                return (
                  <div key={m.id} className="border-b border-border/40 last:border-0">
                    <button
                      onClick={() => setExpandedModuleId(isExpanded ? -1 : m.id)}
                      aria-expanded={isExpanded}
                      className={`w-full flex items-center justify-between px-5 py-3 text-left text-sm transition-colors hover:bg-muted/30 ${
                        moduleHasCurrent ? "text-foreground font-semibold" : "text-foreground/75 font-medium"
                      }`}
                    >
                      <span>Módulo {m.id}: {m.title.replace(/^Módulo \d+ — /, "")}</span>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} aria-hidden="true" />
                    </button>
                    {isExpanded && (
                      <ul className="bg-background/30 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                        {m.lessons.map((l) => {
                          const isActive = l.id === currentLesson.id;
                          const globalIdx = allLessons.findIndex((a) => a.id === l.id);
                          const isComplete = !isActive && globalIdx < completedCount;
                          return (
                            <li key={l.id}>
                              <Link
                                to="/ava/curso/$slug/aula/$lessonId"
                                params={{ slug: course.slug, lessonId: String(l.id) }}
                                onClick={() => setMobileSidebarOpen(false)}
                                aria-current={isActive ? "true" : undefined}
                                className={`flex items-center gap-3 px-5 py-2.5 text-sm border-l-2 transition-colors ${
                                  isActive
                                    ? "border-brand bg-brand/10 text-foreground"
                                    : "border-transparent hover:bg-muted/30 text-muted-foreground"
                                }`}
                              >
                                {isActive ? (
                                  <Play className="w-3.5 h-3.5 text-brand fill-current flex-shrink-0" aria-hidden="true" />
                                ) : isComplete ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" aria-hidden="true" />
                                )}
                                <span className="flex-1 leading-snug line-clamp-2">{l.title}</span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">{l.duration}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <nav
          className="hidden lg:flex flex-col w-[380px] flex-shrink-0 border-r border-border/60 bg-card/40 overflow-hidden"
          aria-label="Conteúdo do curso"
        >
          {/* Course progress */}
          <div className="px-5 py-4 border-b border-border/60 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progresso do curso</span>
              <span className="text-xs font-semibold text-brand">
                {course.progress ?? 0}% concluído
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={course.progress ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${course.progress ?? 0}% do curso concluído`}
              className="h-1.5 bg-muted rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-brand rounded-full"
                style={{ width: `${course.progress ?? 0}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div
            className="px-5 border-b border-border/60 flex-shrink-0"
            role="tablist"
            aria-label="Seções do curso"
          >
            <button
              role="tab"
              aria-selected={true}
              className="py-3 border-b-2 border-brand text-foreground font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              Aulas
            </button>
          </div>

          {/* Module accordion */}
          <div className="flex-1 overflow-y-auto scrollbar-hide" role="tabpanel">
            <p className="px-5 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              O que você vai aprender
            </p>

            {course.modules.map((m) => {
              const isExpanded = expandedModuleId === m.id;
              const moduleHasCurrent = m.lessons.some((l) => l.id === currentLesson.id);

              return (
                <div key={m.id} className="border-b border-border/40 last:border-0">
                  <button
                    onClick={() => setExpandedModuleId(isExpanded ? -1 : m.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`module-${m.id}-lessons`}
                    className={`w-full flex items-center justify-between px-5 py-3 text-left text-sm transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:bg-muted/40 ${
                      moduleHasCurrent
                        ? "text-foreground font-semibold"
                        : "text-foreground/75 font-medium"
                    }`}
                  >
                    <span>
                      Módulo {m.id}: {m.title.replace(/^Módulo \d+ — /, "")}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isExpanded && (
                    <ul id={`module-${m.id}-lessons`} role="list" className="bg-background/30 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                      {m.lessons.map((l) => {
                        const isActive = l.id === currentLesson.id;
                        const globalIdx = allLessons.findIndex((a) => a.id === l.id);
                        const isComplete = !isActive && globalIdx < completedCount;
                        return (
                          <li key={l.id}>
                            <Link
                              to="/ava/curso/$slug/aula/$lessonId"
                              params={{ slug: course.slug, lessonId: String(l.id) }}
                              aria-current={isActive ? "true" : undefined}
                              aria-label={`${l.title} — ${l.duration}${isActive ? " (aula atual)" : isComplete ? " (concluída)" : ""}`}
                              className={`flex items-center gap-3 px-5 py-2.5 text-sm border-l-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
                                isActive
                                  ? "border-brand bg-brand/10 text-foreground"
                                  : isComplete
                                    ? "border-transparent hover:bg-muted/30 text-foreground/70 hover:text-foreground"
                                    : "border-transparent hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {isActive ? (
                                <Play
                                  className="w-3.5 h-3.5 text-brand fill-current flex-shrink-0"
                                  aria-hidden="true"
                                />
                              ) : isComplete ? (
                                <CheckCircle2
                                  className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Circle
                                  className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span className="flex-1 leading-snug line-clamp-2">{l.title}</span>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {l.duration}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Back link */}
          <div className="border-t border-border/60 p-4 flex-shrink-0">
            <Link
              to="/meus-cursos"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Voltar para Meus cursos
            </Link>
          </div>
        </nav>

        {/* ── Player area ── */}
        <main
          id="player"
          className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0"
          aria-label="Player de aula"
        >
          {/* Video player — both */}
          <div className="bg-black flex-shrink-0 lg:flex-1 lg:min-h-0 overflow-hidden">
            <div className="aspect-video lg:aspect-auto lg:h-full w-full relative group">
              <img
                src={course.hero ?? course.thumb}
                alt={`Prévia da aula: ${currentLesson.title}`}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 grid place-items-center">
                <button
                  className="w-20 h-20 rounded-full bg-foreground/95 text-primary-foreground grid place-items-center hover:scale-110 active:scale-95 transition-transform shadow-glow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                  aria-label={`Reproduzir: ${currentLesson.title}`}
                >
                  <Play className="w-8 h-8 fill-current ml-1" aria-hidden="true" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <div role="progressbar" aria-valuenow={27} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da aula: 27%" className="h-1 bg-foreground/25 rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: "27%" }} />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-foreground/70">
                  <span>00:08:12</span>
                  <span>{currentLesson.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile: título + progresso + módulos ── */}
          <div className="lg:hidden flex flex-col">
            {/* Nome do curso + aula + progresso */}
            <div className="px-5 pt-4 pb-0 border-b border-[rgba(31,33,40,0.6)] flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground leading-4">
                {course.title}
              </p>
              <h1 className="font-display text-xl text-foreground leading-tight">
                {currentLesson.title}
              </h1>
              {/* Progress — Figma specs */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9c9ea5]">Progresso do curso</span>
                <span className="text-xs font-semibold text-[#358aff]">{courseProgress}% concluído</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={courseProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${courseProgress}% do curso concluído`}
                className="h-[6px] w-full bg-[#181a20] rounded-full overflow-hidden mb-px"
              >
                <div className="h-full bg-[#358aff] rounded-full" style={{ width: `${courseProgress}%` }} />
              </div>
            </div>

            {/* Módulos inline */}
            <div className="flex flex-col">
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Módulos e aulas
              </p>
              {course.modules.map((m) => {
                const isExp = expandedModuleId === m.id;
                const hasCurrent = m.lessons.some((l) => l.id === currentLesson.id);
                return (
                  <div key={m.id} className="border-b border-border/40 last:border-0">
                    <button
                      onClick={() => setExpandedModuleId(isExp ? -1 : m.id)}
                      aria-expanded={isExp}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-muted/30 ${hasCurrent ? "text-foreground font-semibold" : "text-foreground/75 font-medium"}`}
                    >
                      <span>Módulo {m.id}: {m.title.replace(/^Módulo \d+ — /, "")}</span>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${isExp ? "rotate-90" : ""}`} aria-hidden="true" />
                    </button>
                    {isExp && (
                      <ul className="bg-background/30 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                        {m.lessons.map((l) => {
                          const isActive = l.id === currentLesson.id;
                          const gIdx = allLessons.findIndex((a) => a.id === l.id);
                          const isDone = !isActive && gIdx < completedCount;
                          return (
                            <li key={l.id}>
                              <Link
                                to="/ava/curso/$slug/aula/$lessonId"
                                params={{ slug: course.slug, lessonId: String(l.id) }}
                                aria-current={isActive ? "true" : undefined}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm border-l-2 transition-colors ${isActive ? "border-brand bg-brand/10 text-foreground" : "border-transparent hover:bg-muted/30 text-muted-foreground"}`}
                              >
                                {isActive ? <Play className="w-3.5 h-3.5 text-brand fill-current flex-shrink-0" aria-hidden="true" />
                                  : isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                                  : <Circle className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" aria-hidden="true" />}
                                <span className="flex-1 leading-snug line-clamp-2">{l.title}</span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">{l.duration}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Desktop: título + instrutor + nav ── */}
          <div className="hidden lg:flex lg:flex-col flex-shrink-0">
            <div className="px-6 py-5 border-b border-border/60 flex items-start justify-between gap-6 flex-shrink-0">
              {/* Nome do curso + aula */}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{course.title}</p>
                <h1 className="font-display text-3xl text-foreground leading-tight">{currentLesson.title}</h1>
              </div>

              {/* Prev / Next — rounded-full */}
              <nav aria-label="Navegação entre aulas" className="flex items-center gap-2 flex-shrink-0 pt-1">
                {prevLesson ? (
                  <Link to="/ava/curso/$slug/aula/$lessonId" params={{ slug: course.slug, lessonId: String(prevLesson.id) }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/60 text-sm hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    aria-label={`Aula anterior: ${prevLesson.title}`}>
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Anterior
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/20 text-sm text-muted-foreground/40 cursor-not-allowed select-none" aria-disabled="true">
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Anterior
                  </span>
                )}
                {nextLesson ? (
                  <Link to="/ava/curso/$slug/aula/$lessonId" params={{ slug: course.slug, lessonId: String(nextLesson.id) }}
                    className="neon-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    aria-label={`Próxima aula: ${nextLesson.title}`}>
                    Próximo <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/20 text-sm text-muted-foreground/40 cursor-not-allowed select-none" aria-disabled="true">
                    Próximo <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                )}
              </nav>
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile: barra de navegação fixa na parte inferior ── */}
      <nav
        aria-label="Navegação entre aulas"
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden flex gap-2 px-4 py-3 bg-card/95 backdrop-blur-sm border-t border-border/60"
      >
        {prevLesson ? (
          <Link
            to="/ava/curso/$slug/aula/$lessonId"
            params={{ slug: course.slug, lessonId: String(prevLesson.id) }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-border/60 text-sm hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={`Aula anterior: ${prevLesson.title}`}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Anterior
          </Link>
        ) : (
          <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-border/20 text-sm text-muted-foreground/35 cursor-not-allowed select-none">
            <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Anterior
          </span>
        )}
        {nextLesson ? (
          <Link
            to="/ava/curso/$slug/aula/$lessonId"
            params={{ slug: course.slug, lessonId: String(nextLesson.id) }}
            className="flex-1 neon-btn inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            aria-label={`Próxima aula: ${nextLesson.title}`}
          >
            Próximo <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-border/20 text-sm text-muted-foreground/35 cursor-not-allowed select-none">
            Próximo <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </span>
        )}
      </nav>
    </div>
  );
}
