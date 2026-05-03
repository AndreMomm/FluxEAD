import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Shield, Award, Star, Hexagon, Crown, Medal, Gem } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/gameficacao")({
  head: () => ({
    meta: [
      { title: "Gameficação — FluxEAD" },
      { name: "description", content: "Suas conquistas, pontos e ranking." },
    ],
  }),
  component: Game,
});

// A progressão é linear: cada conquista substitui a anterior.
// Índice mais alto = conquista mais difícil. Simples assim.
// TODO: quando vier do backend, esse array vira uma query paginada
const ACHIEVEMENT_ORDER = [
  { icon: Trophy,  name: "Primeiro passo"      }, // completa a 1ª aula
  { icon: Shield,  name: "Defensor"             }, // completa o 1º módulo
  { icon: Award,   name: "Estudante dedicado"   }, // 50% de um curso
  { icon: Star,    name: "Estrela"              }, // 1 curso completo
  { icon: Hexagon, name: "Hexágono"             }, // 3 cursos completos
  { icon: Medal,   name: "Medalhista"           }, // 5 cursos completos
  { icon: Crown,   name: "Coroado"              }, // todas as conquistas anteriores
  { icon: Gem,     name: "Joia rara"            }, // critério especial (a definir com o produto)
];

// Derivado do ACHIEVEMENT_ORDER pra não duplicar a lista.
// O campo `unlocked` vem do perfil do usuário logado — por ora hardcoded.
const userAchievements = ACHIEVEMENT_ORDER.map((a, i) => ({
  ...a,
  unlocked: i === 0, // Carlos só completou a primeira conquista até agora
}));

// Dados de ranking mockados enquanto não temos API.
// Quando vier do backend vai ser: GET /ranking?from=&to=&limit=50
// FIX: os pontos precisam ser calculados no servidor, não no front (#301)
const mockRanking = [
  { pos: 1, initials: "CN", name: "Carlos Nunes",     points: 200, medal: "🥇", topAchievement: 2 },
  { pos: 2, initials: "ML", name: "Marina Lima",      points: 185, medal: "🥈", topAchievement: 3 },
  { pos: 3, initials: "RA", name: "Rafael Alves",     points: 170, medal: "🥉", topAchievement: 2 },
  { pos: 4, initials: "JS", name: "Juliana Santos",   points: 145, medal: null,  topAchievement: 1 },
  { pos: 5, initials: "PO", name: "Pedro Oliveira",   points: 130, medal: null,  topAchievement: 0 },
  { pos: 6, initials: "BF", name: "Beatriz Ferreira", points: 115, medal: null,  topAchievement: 6 },
  { pos: 7, initials: "TM", name: "Thiago Melo",      points: 100, medal: null,  topAchievement: 0 },
  { pos: 8, initials: "AC", name: "Ana Carvalho",     points:  90, medal: null,  topAchievement: 7 },
];

// Identificador do usuário logado — vai vir do contexto de auth quando tivermos
const LOGGED_USER_NAME = "Carlos Nunes";

const mockAvisos = [
  { id: 1, title: "Nova aula disponível", body: "A aula 'Estratégias de escala' foi adicionada ao curso E-commerce Masterclass.", time: "Hoje, 09:14", unread: true },
  { id: 2, title: "Conquista desbloqueada!", body: "Você ganhou a conquista 'Primeiro passo' por completar sua primeira aula.", time: "Ontem, 18:30", unread: true },
  { id: 3, title: "Lembrete de progresso", body: "Você está a 3 aulas de concluir o módulo 3 do curso Marketing Digital.", time: "2d atrás", unread: false },
  { id: 4, title: "Certificado disponível", body: "Seu certificado do curso Copywriting está pronto para download.", time: "5d atrás", unread: false },
];

function Game() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");
  const [filtered, setFiltered] = useState(mockRanking);

  const handleFilter = () => {
    // mock filter — in a real app this would query an API
    setFiltered(mockRanking);
  };

  return (
    <main className="pt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
      <h1 className="font-display text-5xl md:text-6xl mb-2">Gameficação</h1>
      <p className="text-muted-foreground mb-8">
        Acumule pontos, desbloqueie conquistas e acompanhe seu progresso na plataforma.
      </p>

      <div className="flex gap-6 items-start">
      {/* ── Coluna principal ── */}
      <div className="flex-1 min-w-0">

      {/* Conquistas */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Suas conquistas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {userAchievements.map((a) => (
            <div
              key={a.name}
              className={`rounded-xl border p-4 text-center ${
                a.unlocked ? "border-gold/40 bg-gold/5" : "border-border/60 bg-card opacity-60"
              }`}
            >
              <a.icon className={`w-10 h-10 mx-auto mb-2 ${a.unlocked ? "text-gold" : "text-muted-foreground"}`} />
              <p className="text-sm font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.unlocked ? "Desbloqueada" : "Bloqueada"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ranking */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Ranking da Gamificação</h2>

        {/* Filtro por período */}
        <div className="rounded-xl border border-border/60 bg-card/50 p-5 mb-4">
          <p className="text-sm font-semibold text-foreground mb-3">Filtrar por data</p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              De:
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-muted/30 border border-border/60 rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Data inicial"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Até:
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-muted/30 border border-border/60 rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Data final"
              />
            </label>
            <button
              onClick={handleFilter}
              className="px-4 py-1.5 rounded border border-border/60 bg-muted/40 hover:bg-muted/70 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Filtrar
            </button>
          </div>
        </div>

        {/* Lista do ranking */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
          <ul aria-label="Ranking de usuários">
            {filtered.map((user, idx) => {
              const isMe = user.name === LOGGED_USER_NAME;
              return (
                <li
                  key={user.pos}
                  className={`flex items-center gap-4 px-5 py-4 border-b border-border/40 last:border-0 transition-colors ${
                    isMe ? "bg-brand/8" : "hover:bg-muted/20"
                  }`}
                >
                  {/* Position */}
                  <span
                    className={`w-8 text-sm font-bold flex-shrink-0 ${
                      user.pos === 1 ? "text-gold" :
                      user.pos === 2 ? "text-[#C0C0C0]" :
                      user.pos === 3 ? "text-[#CD7F32]" :
                      "text-muted-foreground"
                    }`}
                  >
                    {user.pos}º
                  </span>

                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full grid place-items-center text-sm font-bold flex-shrink-0 ${
                      isMe ? "brand-gradient" : "bg-muted/60"
                    }`}
                    aria-hidden="true"
                  >
                    {user.initials}
                  </div>

                  {/* Name + points + earned badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${isMe ? "text-foreground" : "text-foreground/90"}`}>
                        {user.name}
                      </p>
                      {isMe && <span className="text-xs text-brand font-normal">(você)</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">{user.points} pontos</p>

                    {/* Top achievement only */}
                    {(() => {
                      const a = ACHIEVEMENT_ORDER[user.topAchievement];
                      return (
                        <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/30 rounded px-1.5 py-0.5">
                          <a.icon className="w-3 h-3 text-gold flex-shrink-0" aria-hidden="true" />
                          <span className="text-[10px] text-gold/80 leading-none whitespace-nowrap">{a.name}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Position medal emoji */}
                  {user.medal && (
                    <span className="text-2xl flex-shrink-0" aria-label={`Medalha ${user.pos}º lugar`}>
                      {user.medal}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      </div>{/* fim coluna principal */}

      {/* ── Painel de Avisos ── */}
      <aside
        className="hidden lg:flex flex-col w-72 flex-shrink-0 sticky top-24"
        aria-label="Avisos"
      >
        <div className="rounded-xl border border-border/60 bg-card/70 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <h2 className="text-sm font-semibold text-foreground">
              Avisos{" "}
              <span className="text-muted-foreground font-normal">
                ({mockAvisos.length})
              </span>
            </h2>
            {mockAvisos.some((a) => a.unread) && (
              <span className="text-[10px] font-semibold text-brand bg-brand/15 px-2 py-0.5 rounded-full">
                {mockAvisos.filter((a) => a.unread).length} novos
              </span>
            )}
          </div>

          <ul className="divide-y divide-border/40 max-h-[420px] overflow-y-auto scrollbar-hide" aria-label="Lista de avisos">
            {mockAvisos.map((a) => (
              <li
                key={a.id}
                className={`px-4 py-3 flex gap-2.5 ${a.unread ? "bg-brand/5" : ""}`}
              >
                {a.unread && (
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-brand flex-shrink-0" aria-label="Não lido" />
                )}
                <div className={a.unread ? "" : "pl-4"}>
                  <p className="text-xs font-semibold text-foreground leading-snug mb-0.5">{a.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.body}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      </div>{/* fim flex dois colunas */}
    </main>
  );
}
