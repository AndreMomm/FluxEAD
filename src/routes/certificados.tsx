import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { allCourses } from "@/data/courses";

export const Route = createFileRoute("/certificados")({
  head: () => ({
    meta: [
      { title: "Certificados — FluxEAD" },
      { name: "description", content: "Baixe os certificados dos cursos concluídos." },
    ],
  }),
  component: Certificados,
});

// Mock certificate metadata — start/completion dates per course slug
const certMeta: Record<string, { startDate: string; completionDate: string }> = {
  "copywriting":          { startDate: "10/01/2025", completionDate: "28/01/2025" },
  "curso-de-e-commerce":  { startDate: "05/02/2025", completionDate: "20/03/2025" },
  "marketing-digital":    { startDate: "01/04/2025", completionDate: "15/05/2025" },
  "trafego-pago":         { startDate: "18/05/2025", completionDate: "30/06/2025" },
  "branding":             { startDate: "02/07/2025", completionDate: "22/07/2025" },
  "gestao-de-negocios":   { startDate: "01/08/2025", completionDate: "30/09/2025" },
};

// Show courses that either have 100% progress or appear in certMeta (mock completed)
const certificates = allCourses
  .filter((c) => c.progress === 100 || certMeta[c.slug])
  .map((c) => ({ ...c, ...certMeta[c.slug] }));

function Certificados() {
  return (
    <main className="pt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
      <h1 className="font-display text-5xl md:text-6xl mb-3">Certificados</h1>
      <p className="text-muted-foreground mb-8">
        Você concluiu {certificates.length} curso{certificates.length === 1 ? "" : "s"}.
      </p>

      {certificates.length === 0 ? (
        <p className="text-muted-foreground">
          Conclua um curso para receber seu primeiro certificado.
        </p>
      ) : (
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label="Certificados disponíveis"
        >
          {certificates.map((cert) => (
            <li key={cert.slug}>
              <article
                className="flex flex-col rounded-xl border border-border/50 bg-card/50 overflow-hidden hover:bg-card hover:border-border/80 transition-all h-full"
                aria-label={`Certificado: ${cert.title}`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden flex-shrink-0">
                  <img
                    src={cert.thumb}
                    alt={`Capa do curso ${cert.title}`}
                    className="w-full h-full object-cover opacity-70"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-3 gap-2.5">
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-foreground mb-2 leading-tight">
                      {cert.title}
                    </h3>
                    <dl className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {cert.startDate && (
                        <div className="flex items-center justify-between">
                          <dt>Início</dt>
                          <dd className="text-foreground/80">{cert.startDate}</dd>
                        </div>
                      )}
                      {cert.completionDate && (
                        <div className="flex items-center justify-between">
                          <dt>Conclusão</dt>
                          <dd className="text-foreground/80">{cert.completionDate}</dd>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <dt>Duração</dt>
                        <dd className="text-foreground/80">{cert.duration}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Download */}
                  <button
                    className="neon-btn inline-flex items-center justify-center gap-2 w-full rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    style={{ height: 36 }}
                    aria-label={`Baixar certificado de ${cert.title}`}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Baixar certificado
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
