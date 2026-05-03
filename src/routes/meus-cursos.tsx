import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { allCourses, getCurrentLessonId } from "@/data/courses";
import { useCourseModal } from "@/components/home/useCourseModal";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const EXPIRY = "11/12/2025";

const FILTERS = [
  { label: "Todos os cursos", value: "all" },
  { label: "Em andamento", value: "in-progress" },
  { label: "Concluídos", value: "completed" },
  { label: "Não iniciados", value: "not-started" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];


export const Route = createFileRoute("/meus-cursos")({
  head: () => ({
    meta: [
      { title: "Meus cursos — FluxEAD" },
      { name: "description", content: "Todos os cursos aos quais você tem acesso." },
    ],
  }),
  component: MeusCursos,
});

function MeusCursos() {
  const { show, Modal } = useCourseModal();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredCourses = allCourses.filter((c) => {
    if (filter === "all") return true;
    if (filter === "in-progress") return (c.progress ?? 0) > 0 && (c.progress ?? 0) < 100;
    if (filter === "completed") return c.progress === 100;
    if (filter === "not-started") return !c.progress || c.progress === 0;
    return true;
  });



  const currentFilterLabel = FILTERS.find((f) => f.value === filter)?.label ?? "Todos os cursos";

  return (
    <main className="pt-20 pb-16 px-4 md:px-6 max-w-5xl mx-auto" aria-label="Meus cursos">
      <h1 className="font-display text-5xl md:text-6xl mb-2">Meus cursos</h1>
      <p className="text-muted-foreground mb-8">
        {allCourses.length} cursos disponíveis. Continue de onde parou ou comece uma nova jornada.
      </p>

      <div>
        {/* ── Courses list ── */}
        <section aria-label="Lista de produtos disponíveis">
          {/* Filter */}
          <div className="relative mb-5">
            <button
              id="filter-btn"
              onClick={() => setFilterOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
              aria-controls="filter-listbox"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border/60 bg-card/60 text-sm text-foreground hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span>Filtros</span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="text-foreground">{currentFilterLabel}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </button>

            {filterOpen && (
              <ul
                id="filter-listbox"
                role="listbox"
                aria-label="Opções de filtro"
                className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border/60 bg-card shadow-card z-20 overflow-hidden"
              >
                {FILTERS.map((f) => (
                  <li key={f.value} role="option" aria-selected={filter === f.value}>
                    <button
                      onClick={() => {
                        setFilter(f.value);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:bg-muted/60 ${
                        filter === f.value ? "text-brand font-semibold" : "text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h2 className="text-sm font-semibold text-foreground/80 mb-4 uppercase tracking-wide">
            Produtos Disponíveis
          </h2>

          {filteredCourses.length === 0 ? (
            <p className="text-muted-foreground text-sm py-12 text-center" role="status">
              Nenhum curso encontrado para este filtro.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Cursos disponíveis">
              {filteredCourses.map((course) => (
                <li key={course.slug}>
                  <article
                    className="flex flex-col rounded-xl border border-border/50 bg-card/50 overflow-hidden hover:bg-card hover:border-border/80 transition-all h-full"
                    aria-label={`Curso: ${course.title}`}
                  >
                    {/* Thumbnail */}
                    <button
                      onClick={() => show(course)}
                      className="relative aspect-video w-full flex-shrink-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                      aria-label={`Ver detalhes de ${course.title}`}
                    >
                      <img
                        src={course.thumb}
                        alt={`Capa do curso ${course.title}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </button>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4 gap-3">
                      <div className="flex-1">
                        <h3 className="font-display text-xl text-foreground mb-1 leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Progress + expiry */}
                      <div>
                        <div
                          role="progressbar"
                          aria-valuenow={course.progress ?? 0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Progresso: ${course.progress ?? 0}% concluído`}
                          className="h-1.5 bg-muted rounded-full overflow-hidden mb-1"
                        >
                          <div
                            className="h-full bg-brand rounded-full transition-all"
                            style={{ width: `${course.progress ?? 0}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {course.progress ?? 0}% concluído
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Expira: <time dateTime="2025-12-11">{EXPIRY}</time>
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() =>
                          navigate({
                            to: "/ava/curso/$slug/aula/$lessonId",
                            params: { slug: course.slug, lessonId: getCurrentLessonId(course) },
                          })
                        }
                        className="neon-btn inline-flex items-center justify-center w-full rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                        style={{ height: 36 }}
                        aria-label={`Acessar curso ${course.title}`}
                      >
                        {(course.progress ?? 0) > 0 ? "Continuar assistindo" : "Acessar"}
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Modal />
    </main>
  );
}
