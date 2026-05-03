import { createFileRoute } from "@tanstack/react-router";
import { Send, Edit, Circle, ArrowLeft, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { allCourses } from "@/data/courses";

export const Route = createFileRoute("/tutoria")({
  head: () => ({
    meta: [
      { title: "Tutoria — FluxEAD" },
      { name: "description", content: "Mensagens com seus tutores." },
    ],
  }),
  component: Tutoria,
});

type Message = { id: number; from: "me" | "tutor"; text: string; time: string };
type Conversation = {
  id: number;
  tutor: string;
  initials: string;
  course: string;
  thumb: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: Message[];
};

const mockConversations: Conversation[] = [
  {
    id: 1, tutor: "Carlos Nunes", initials: "CN", course: "E-commerce Masterclass",
    thumb: allCourses.find((c) => c.slug === "curso-de-e-commerce")?.thumb ?? allCourses[0].thumb,
    unread: 5, lastMessage: "Oiii", lastTime: "11/09/2025 12:03",
    messages: [
      { id: 1, from: "me",    text: "Oiii", time: "11/09/25 12:03" },
      { id: 2, from: "tutor", text: "ok",   time: "11/09/25 14:37" },
      { id: 3, from: "me",    text: "Opa",  time: "11/09/25 16:24" },
      { id: 4, from: "me",    text: "Oiii", time: "21/10/25 12:57" },
    ],
  },
  {
    id: 2, tutor: "Marina Costa", initials: "MC", course: "Marketing Digital",
    thumb: allCourses.find((c) => c.slug === "marketing-digital")?.thumb ?? allCourses[1].thumb,
    unread: 0, lastMessage: "Quando será a próxima aula ao vivo?", lastTime: "28/10/2025 09:15",
    messages: [
      { id: 1, from: "tutor", text: "Olá! Como posso ajudar?",             time: "28/10/25 09:10" },
      { id: 2, from: "me",    text: "Quando será a próxima aula ao vivo?", time: "28/10/25 09:15" },
    ],
  },
  {
    id: 3, tutor: "Diego Almeida", initials: "DA", course: "Tráfego Pago",
    thumb: allCourses.find((c) => c.slug === "trafego-pago")?.thumb ?? allCourses[2].thumb,
    unread: 2, lastMessage: "Consegui configurar a campanha!", lastTime: "02/11/2025 17:42",
    messages: [
      { id: 1, from: "me",    text: "Tenho dúvida sobre segmentação no Meta Ads.", time: "02/11/25 17:30" },
      { id: 2, from: "tutor", text: "Pode explicar melhor o cenário?",             time: "02/11/25 17:35" },
      { id: 3, from: "me",    text: "Consegui configurar a campanha!",             time: "02/11/25 17:42" },
    ],
  },
];

function Tutoria() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId]       = useState<number | null>(null);
  const [input, setInput]                 = useState("");
  const [newChatOpen, setNewChatOpen]     = useState(false);
  const [newProduct, setNewProduct]       = useState("");
  const [newTitle, setNewTitle]           = useState("");
  const [productDropOpen, setProductDropOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  const selectConversation = (id: number) => {
    setSelectedId(id);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !selectedId) return;
    const time = new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
    setConversations((prev) =>
      prev.map((c) => c.id === selectedId
        ? { ...c, lastMessage: text, lastTime: time, messages: [...c.messages, { id: Date.now(), from: "me", text, time }] }
        : c)
    );
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  const handleCreateChat = () => {
    if (!newProduct || !newTitle.trim()) return;
    const course = allCourses.find((c) => c.slug === newProduct);
    if (!course) return;
    const newId = Date.now();
    setConversations((prev) => [
      {
        id: newId,
        tutor: course.instructor.name,
        initials: course.instructor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        course: course.title,
        thumb: course.thumb,
        unread: 0,
        lastMessage: newTitle.trim(),
        lastTime: new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        messages: [{ id: 1, from: "me", text: newTitle.trim(), time: new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) }],
      },
      ...prev,
    ]);
    setSelectedId(newId);
    setNewChatOpen(false);
    setNewProduct("");
    setNewTitle("");
  };

  return (
    <main className="pt-20 pb-4 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-display text-4xl md:text-5xl mb-1">Tutoria</h1>
        <p className="text-muted-foreground text-sm">Mensagens com seus tutores especialistas.</p>
      </div>

      {/* Chat container — fixed height so inner flex works */}
      <div
        className="rounded-xl border border-border/60 overflow-hidden bg-card/40 flex"
        style={{ height: "calc(100vh - 230px)", minHeight: 400 }}
      >
        {/* ── Conversations list ── */}
        <aside
          className={`flex flex-col border-r border-border/60 flex-shrink-0
            ${selected ? "hidden lg:flex lg:w-72" : "flex w-full lg:w-72"}`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/60 flex-shrink-0">
            <h2 className="font-semibold text-base text-foreground">Mensagens</h2>
            <button
              onClick={() => setNewChatOpen(true)}
              className="neon-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              aria-label="Nova mensagem"
            >
              <Edit className="w-3 h-3" aria-hidden="true" />
              Nova mensagem
            </button>
          </div>

          <ul className="flex-1 overflow-y-auto scrollbar-hide" aria-label="Conversas">
            {conversations.map((c) => {
              const isActive = c.id === selectedId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => selectConversation(c.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border/40 last:border-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand border-l-2 ${
                      isActive ? "bg-muted/40 border-brand" : "hover:bg-muted/20 border-transparent"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={c.thumb} alt={c.course} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-sm font-semibold text-foreground truncate">{c.course}</p>
                        {c.unread > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand grid place-items-center text-[10px] font-bold text-white">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mb-0.5">{c.lastTime}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ── Chat area ── */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60 flex-shrink-0">
              <button
                onClick={() => setSelectedId(null)}
                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <div className="w-8 h-8 brand-gradient rounded-full grid place-items-center text-xs font-bold flex-shrink-0">
                {selected.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{selected.course}</p>
                <p className="text-xs text-muted-foreground truncate">{selected.tutor}</p>
              </div>
              <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 ml-auto flex-shrink-0" aria-label="Online" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 scrollbar-hide min-h-0">
              {selected.messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.from === "me" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "me" ? "bg-[#27282a] text-foreground rounded-br-sm" : "bg-brand/20 text-foreground rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-border/60 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder="Digite uma mensagem..."
                className="flex-1 bg-muted/30 border border-border/50 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Campo de mensagem"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="neon-btn inline-flex items-center gap-2 px-4 h-10 rounded-full flex-shrink-0 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                Enviar
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground text-sm">
            Selecione uma conversa para começar.
          </div>
        )}
      </div>
      {/* ── Modal Novo Chat ── */}
      {newChatOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setNewChatOpen(false)}
            aria-hidden="true"
          />
          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="novo-chat-title"
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-md bg-card border border-border/50 rounded-xl shadow-card p-6 animate-in fade-in-0 zoom-in-[0.97] duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="novo-chat-title" className="text-base font-semibold text-foreground">
                Novo Chat
              </h2>
              <button
                onClick={() => setNewChatOpen(false)}
                aria-label="Fechar"
                className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Produto Relacionado */}
            <div className="mb-5">
              <label htmlFor="novo-chat-produto" className="block text-sm text-foreground mb-2">
                Produto Relacionado
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProductDropOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={productDropOpen}
                  className="w-full flex items-center justify-between gap-2 bg-background border border-border/60 rounded-lg px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <span className={newProduct ? "text-foreground" : "text-muted-foreground"}>
                    {newProduct ? allCourses.find((c) => c.slug === newProduct)?.title : "Selecione um produto"}
                  </span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${productDropOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>

                {productDropOpen && (
                  <ul
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/60 rounded-lg shadow-card z-10 overflow-y-auto max-h-48 scrollbar-hide animate-in fade-in-0 slide-in-from-top-1 duration-150"
                  >
                    {allCourses.map((c) => (
                      <li key={c.slug} role="option" aria-selected={newProduct === c.slug}>
                        <button
                          type="button"
                          onClick={() => { setNewProduct(c.slug); setProductDropOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-muted/40 focus:outline-none focus:bg-muted/40 ${newProduct === c.slug ? "text-cyan font-semibold" : "text-foreground"}`}
                        >
                          {c.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Título */}
            <div className="mb-8">
              <label htmlFor="novo-chat-titulo" className="block text-sm text-foreground mb-2">
                Título do Chat
              </label>
              <input
                id="novo-chat-titulo"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateChat(); }}
                className="w-full bg-background border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder=""
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setNewChatOpen(false)}
                className="px-4 py-2 rounded-lg border border-border/60 text-sm text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateChat}
                disabled={!newProduct || !newTitle.trim()}
                className="neon-btn px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                Criar Tópico
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
