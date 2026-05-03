import { Trophy, Shield, Award, Star, Hexagon, Crown, Medal, Gem } from "lucide-react";

const achievements = [
  { icon: Trophy, unlocked: true, color: "text-gold" },
  { icon: Shield, unlocked: false },
  { icon: Award, unlocked: false },
  { icon: Star, unlocked: false },
  { icon: Hexagon, unlocked: false },
  { icon: Medal, unlocked: false },
  { icon: Crown, unlocked: false },
  { icon: Gem, unlocked: false },
];

export function AchievementsWidget() {
  return (
    <aside className="hidden lg:block fixed top-20 right-4 xl:right-8 z-30 w-72">
      <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-card p-4 transition-all hover:bg-card/90 ease-cinema">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 brand-gradient rounded-full grid place-items-center text-sm font-semibold">
            CN
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">Carlos Nunes</p>
            <p className="text-xs text-gold flex items-center gap-1">
              <Trophy className="w-3 h-3" /> 200 pontos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Concluídos</p>
            <p className="text-sm font-semibold">1</p>
          </div>
          <div className="rounded-md border border-border/60 px-2 py-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Progresso</p>
            <p className="text-sm font-semibold">4</p>
          </div>
        </div>

        <p className="text-xs font-medium text-muted-foreground mb-2">Suas conquistas</p>
        <div className="flex items-center gap-1.5">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-md grid place-items-center border ${
                a.unlocked
                  ? "border-gold/40 bg-gold/10"
                  : "border-border/60 bg-muted/30 opacity-40"
              }`}
            >
              <a.icon className={`w-3.5 h-3.5 ${a.unlocked ? "text-gold" : "text-muted-foreground"}`} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
