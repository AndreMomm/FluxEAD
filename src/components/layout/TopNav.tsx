import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Bell, Search, User, LogOut, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logoSrc from "@/assets/logo.png";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/meus-cursos", label: "Meus cursos" },
  { to: "/tutoria", label: "Tutoria" },
  { to: "/certificados", label: "Certificados" },
  { to: "/gameficacao", label: "Gameficação" },
] as const;

const mockNotifs = [
  { id: 1, text: "3 aulas pendentes em E-commerce Masterclass", time: "2h atrás", unread: true },
  { id: 2, text: "Certificado de Copywriting disponível para download", time: "1d atrás", unread: true },
  { id: 3, text: "Nova aula adicionada em Marketing Digital", time: "3d atrás", unread: false },
];

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click / Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const unreadCount = mockNotifs.filter((n) => n.unread).length;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-cinema"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.08 0 0 / 0.85), oklch(0.08 0 0 / 0.4) 60%, transparent)",
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-12 h-16">
        {/* Logo + desktop nav */}
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="FluxEAD — Início">
            <img src={logoSrc} alt="FluxEAD" className="h-9 w-auto object-contain" draggable={false} />
          </Link>
          <nav className="hidden md:flex items-center gap-6" aria-label="Menu principal">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm transition-colors hover:text-foreground ${
                    active ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="text-foreground/80 hover:text-foreground transition-colors" aria-label="Buscar">
            <Search className="w-5 h-5" />
          </button>

          {/* ── Notifications ── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }}
              aria-label={`Notificações — ${unreadCount} não lidas`}
              aria-haspopup="true"
              aria-expanded={notifOpen}
              className="text-foreground/80 hover:text-foreground transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 brand-gradient text-[10px] rounded-full w-4 h-4 grid place-items-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                role="dialog"
                aria-label="Notificações"
                className="absolute right-0 top-full mt-3 w-80 bg-card border border-border/50 rounded-xl shadow-card z-50 overflow-hidden animate-in fade-in-0 zoom-in-[0.97] slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                  <p className="text-sm font-semibold text-foreground">Notificações</p>
                  <button
                    onClick={() => setNotifOpen(false)}
                    aria-label="Fechar notificações"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <ul>
                  {mockNotifs.map((n) => (
                    <li key={n.id}>
                      <button className="w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0 focus-visible:outline-none focus-visible:bg-muted/40">
                        <div className="flex items-start gap-2.5">
                          {n.unread && (
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-brand flex-shrink-0" aria-label="Não lida" />
                          )}
                          <div className={n.unread ? "" : "pl-4"}>
                            <p className="text-sm text-foreground/90 leading-snug">{n.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                {unreadCount === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma notificação nova.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── User menu ── */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }}
              aria-label="Menu do usuário"
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
              className={`rounded-md overflow-hidden ring-2 transition-all focus-visible:outline-none ${
                userMenuOpen ? "ring-brand" : "ring-transparent hover:ring-brand"
              }`}
            >
              <div className="w-8 h-8 brand-gradient grid place-items-center text-sm font-semibold">
                CN
              </div>
            </button>

            {userMenuOpen && (
              <div
                role="dialog"
                aria-label="Menu do usuário"
                className="absolute right-0 top-full mt-3 w-64 bg-card border border-border/50 rounded-xl shadow-card z-50 overflow-hidden animate-in fade-in-0 zoom-in-[0.97] slide-in-from-top-2 duration-200"
              >
                {/* Profile header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border/60">
                  <div className="w-10 h-10 brand-gradient rounded-full grid place-items-center text-sm font-bold flex-shrink-0">
                    CN
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">Carlos Nunes</p>
                    <p className="text-xs text-muted-foreground truncate">carlos@example.com</p>
                  </div>
                </div>

                {/* Nav items — mobile only shows all, desktop shows all too */}
                <div className="py-1">
                  {navItems.map((item) => {
                    const active = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:bg-muted/40 ${
                          active ? "text-brand font-medium" : "text-foreground/80"
                        }`}
                      >
                        {item.label}
                        {active && <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-border/60 py-1">
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:bg-muted/40"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    Editar perfil
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate({ to: "/" }); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors focus-visible:outline-none focus-visible:bg-red-400/10"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
