// courses.ts — catálogo de cursos da plataforma
// TODO: migrar isso pra uma chamada de API quando o backend estiver pronto.
//       Por enquanto os dados ficam aqui mesmo pra a gente conseguir iterar rápido no front.

import ecommerce from "@/assets/course-ecommerce.jpg";
import marketing from "@/assets/aece366525e568b29711fffc80f49da8.jpg";
import trafego from "@/assets/74c679b74ddeeac0e3c2d00f2642011b.jpg";
import copy from "@/assets/294c41d7d29333293cd6830b5b205219.jpg";
import gestao from "@/assets/course-gestao.jpg";
import vendas from "@/assets/8f57cc61c8abe81af42ca1266b854d3f.jpg";
import branding from "@/assets/26f6074a20a44e44ce2ddca24b3a144b.jpg";
import financas from "@/assets/2e32137c88eeafbe9ceb5c5dc617859b.jpg";
import produtividade from "@/assets/course-produtividade.jpg";
import heroEcom from "@/assets/hero-ecommerce.jpg";
import uiux from "@/assets/9681fdf405b6d4fb5e56d81f7dec50d3.jpg";
import portfolio from "@/assets/b7ee0447fb2776b23bc47deef370710a.jpg";

export type Lesson = { id: number; title: string; duration: string };
export type Module = { id: number; title: string; lessons: Lesson[] };
export type Course = {
  slug: string;
  title: string;
  thumb: string;
  hero?: string;
  category: string;
  year: number;
  duration: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  rating: string;
  progress?: number; // 0-100, undefined = não matriculado ainda
  isNew?: boolean;
  isTop10?: boolean;
  description: string;
  longDescription: string;
  instructor: { name: string; bio: string };
  modules: Module[];
};

// Monta um módulo a partir de um título e lista de aulas.
// Usamos IDs prefixados pelo número do módulo pra evitar colisão
// quando navegamos por slug + lessonId na rota do player.
function buildModule(moduleNum: number, title: string, lessons: Array<[string, string]>): Module {
  return {
    id: moduleNum,
    title,
    lessons: lessons.map(([lessonTitle, duration], idx) => ({
      id: moduleNum * 100 + idx,
      title: lessonTitle,
      duration,
    })),
  };
}

// Para cursos que ainda não têm conteúdo detalhado cadastrado, geramos
// módulos genéricos. Isso vai sumir quando a equipe de conteúdo alimentar o CMS.
// FIX: remover quando integrar com API de conteúdo (#204)
function placeholderModules(count: number): Module[] {
  return Array.from({ length: count }, (_, i) => buildModule(i + 1, `Módulo ${i + 1} — Em breve`, [
    ["Introdução ao módulo", "8min"],
    ["Conceitos fundamentais", "12min"],
    ["Aplicação prática", "15min"],
    ["Exercícios e revisão", "10min"],
  ]));
}

export const courses: Course[] = [
  {
    slug: "curso-de-e-commerce",
    title: "E-commerce Masterclass",
    thumb: ecommerce,
    hero: heroEcom,
    category: "Negócios Digitais",
    year: 2025,
    duration: "12h 40min",
    level: "Intermediário",
    rating: "16+",
    progress: 27,
    isTop10: true,
    description:
      "Construa, escale e otimize uma loja online lucrativa do zero ao avançado, com estratégias usadas pelos maiores e-commerces do Brasil.",
    longDescription:
      "Aprenda do planejamento estratégico à operação diária — checkout, frete, conversão, retenção, métricas e crescimento sustentável.",
    instructor: {
      name: "Carlos Nunes",
      bio: "Especialista em e-commerce, +15 anos no varejo digital, mentor de operações com mais de R$200M em GMV.",
    },
    modules: [
      buildModule(1, "Fundamentos do E-commerce", [
        ["O que é e-commerce e como o mercado funciona", "10min"],
        ["Modelos de negócio: B2C, B2B, marketplace", "12min"],
        ["Escolhendo sua plataforma de venda", "14min"],
        ["Regulamentação e CNPJ: o mínimo que você precisa saber", "8min"],
      ]),
      buildModule(2, "Produto e Nicho", [
        ["Como validar um produto antes de investir", "15min"],
        ["Análise de concorrência e posicionamento", "12min"],
        ["Precificação estratégica", "10min"],
        ["Fornecedores: nacional vs. importado", "16min"],
        ["Gestão de estoque básica", "11min"],
      ]),
      buildModule(3, "Criação da Loja", [
        ["Configurando sua loja do zero", "20min"],
        ["Design e experiência do cliente (UX)", "14min"],
        ["Páginas que vendem: produto, checkout, home", "18min"],
        ["Integrando meios de pagamento", "12min"],
        ["SEO básico para loja virtual", "15min"],
        ["Política de devolução e SAC", "9min"],
      ]),
      buildModule(4, "Tráfego e Aquisição", [
        ["Google Shopping — primeiros passos", "16min"],
        ["Meta Ads para e-commerce", "20min"],
        ["Email marketing e recuperação de carrinho", "14min"],
        ["Influenciadores e UGC", "12min"],
      ]),
      buildModule(5, "Operações e Logística", [
        ["Frete: Correios, transportadoras e Melhor Envio", "15min"],
        ["Embalagem e experiência de unboxing", "10min"],
        ["Integrações de ERP e OMS", "14min"],
        ["Gestão de devoluções", "11min"],
      ]),
      buildModule(6, "Escala e Métricas", [
        ["KPIs que realmente importam: CAC, LTV, ROAS", "18min"],
        ["CRO: como aumentar sua taxa de conversão", "20min"],
        ["Automatizando operações repetitivas", "15min"],
        ["Quando e como contratar sua primeira equipe", "12min"],
        ["Cases: o que funcionou (e o que não funcionou)", "22min"],
      ]),
    ],
  },

  {
    slug: "marketing-digital",
    title: "Marketing Digital",
    thumb: marketing,
    category: "Marketing",
    year: 2025,
    duration: "9h 20min",
    level: "Iniciante",
    rating: "L",
    progress: 62,
    isNew: true,
    description: "Do funil ao conteúdo: domine os canais que geram demanda previsível.",
    longDescription:
      "SEO, Social, E-mail, Conteúdo e Performance — uma jornada completa para profissionais que querem resultado.",
    instructor: { name: "Marina Costa", bio: "CMO e consultora de marcas DTC." },
    modules: [
      buildModule(1, "Estratégia de Conteúdo", [
        ["O que é marketing de conteúdo de verdade", "12min"],
        ["Persona e ICP: pare de falar com todo mundo", "14min"],
        ["Jornada do cliente e funil de conteúdo", "16min"],
        ["Calendário editorial que funciona na prática", "10min"],
      ]),
      buildModule(2, "SEO e Tráfego Orgânico", [
        ["Como o Google ranqueia conteúdo em 2025", "18min"],
        ["Pesquisa de palavras-chave sem complicação", "15min"],
        ["On-page SEO: os fundamentos que ninguém aplica", "14min"],
        ["Link building para quem está começando", "12min"],
        ["Medindo resultados no Search Console", "10min"],
      ]),
      buildModule(3, "Social Media e Comunidade", [
        ["Instagram, LinkedIn, TikTok: onde estar?", "14min"],
        ["Roteiro de conteúdo orgânico", "16min"],
        ["Engajamento real vs. vaidade de métricas", "12min"],
        ["Construindo comunidade no digital", "15min"],
      ]),
      buildModule(4, "Email Marketing", [
        ["Construindo uma lista de emails do zero", "14min"],
        ["Automações que vendem enquanto você dorme", "18min"],
        ["Copywriting para email: assunto e corpo", "15min"],
        ["Métricas: open rate, CTR e o que importa", "10min"],
        ["LGPD aplicada ao email marketing", "8min"],
      ]),
      buildModule(5, "Analytics e Performance", [
        ["GA4 para quem nunca usou Google Analytics", "20min"],
        ["UTMs e rastreamento de campanhas", "12min"],
        ["Dashboards simples que o time usa de verdade", "15min"],
        ["Tomando decisões com dados (sem ser cientista)", "18min"],
      ]),
    ],
  },

  {
    slug: "trafego-pago",
    title: "Tráfego Pago",
    thumb: trafego,
    category: "Performance",
    year: 2024,
    duration: "8h 10min",
    level: "Intermediário",
    rating: "L",
    progress: 0,
    isTop10: true,
    description: "Meta Ads, Google Ads e TikTok Ads com estratégias de escala.",
    longDescription: "Da estrutura de conta à criativos de alta performance.",
    instructor: { name: "Diego Almeida", bio: "Mídia paga • +R$50M em verba gerida." },
    modules: [
      buildModule(1, "Fundamentos de Mídia Paga", [
        ["Como funcionam os leilões de anúncio", "14min"],
        ["Estrutura de conta: campanha, conjunto, anúncio", "12min"],
        ["Pixels e eventos: rastreamento correto", "16min"],
        ["Budget e objetivos de campanha", "10min"],
      ]),
      buildModule(2, "Meta Ads na Prática", [
        ["Criando sua primeira campanha no Meta", "18min"],
        ["Segmentação de público: interesses e lookalike", "15min"],
        ["Criativos que convertem: estáticos e vídeo", "20min"],
        ["Teste A/B em anúncios", "14min"],
      ]),
      buildModule(3, "Google Ads", [
        ["Search Ads: palavras-chave e correspondências", "16min"],
        ["Google Shopping para e-commerce", "18min"],
        ["Display e remarketing", "14min"],
        ["YouTube Ads: formatos e estratégias", "15min"],
      ]),
      buildModule(4, "TikTok Ads e Escala", [
        ["Por que TikTok Ads está crescendo", "12min"],
        ["Formatos e criativos nativos", "16min"],
        ["Escalando campanhas sem quebrar o ROAS", "20min"],
        ["Relatórios e otimização contínua", "14min"],
        ["O que fazer quando o anúncio para de funcionar", "12min"],
      ]),
    ],
  },

  {
    slug: "copywriting",
    title: "Copywriting",
    thumb: copy,
    category: "Conteúdo",
    year: 2024,
    duration: "6h 30min",
    level: "Iniciante",
    rating: "L",
    progress: 100,
    description: "Escreva textos que vendem com gatilhos e clareza.",
    longDescription: "Frameworks PAS, AIDA e técnicas avançadas de persuasão escrita.",
    instructor: { name: "Renata Lima", bio: "Copywriter sênior, +10 anos em direct response." },
    modules: [
      buildModule(1, "A Psicologia da Persuasão", [
        ["Por que as pessoas compram: motivadores reais", "14min"],
        ["Os 6 princípios de Cialdini aplicados ao copy", "18min"],
        ["Gatilhos mentais: urgência, escassez, prova social", "16min"],
        ["Vieses cognitivos que todo copywriter deve saber", "12min"],
      ]),
      buildModule(2, "Frameworks Clássicos", [
        ["AIDA: Atenção, Interesse, Desejo, Ação", "15min"],
        ["PAS: Problema, Agitação, Solução", "13min"],
        ["FAB: Features, Advantages, Benefits", "12min"],
        ["Storytelling como técnica de vendas", "18min"],
      ]),
      buildModule(3, "Copy na Prática", [
        ["Headlines que param o scroll", "16min"],
        ["E-mails que abrem e clicam", "14min"],
        ["Landing pages de alta conversão", "20min"],
        ["Copy para anúncios (Meta, Google, TikTok)", "15min"],
        ["Revisão e edição: menos é mais", "10min"],
      ]),
    ],
  },

  {
    slug: "gestao-de-negocios",
    title: "Gestão de Negócios",
    thumb: gestao,
    category: "Negócios",
    year: 2025,
    duration: "11h 00min",
    level: "Avançado",
    rating: "L",
    description: "Estratégia, operações, pessoas e finanças para fundadores.",
    longDescription: "Visão sistêmica de empresa: do plano à execução escalável.",
    instructor: { name: "Paulo Henrique", bio: "Ex-COO, conselheiro de scale-ups." },
    // TODO: adicionar módulo de M&A quando o Paulo finalizar o material
    modules: placeholderModules(6),
  },

  {
    slug: "vendas-online",
    title: "Vendas Online",
    thumb: vendas,
    category: "Vendas",
    year: 2025,
    duration: "7h 45min",
    level: "Intermediário",
    rating: "L",
    progress: 12,
    description: "Processo comercial de alta conversão para o digital.",
    longDescription: "Prospecção, qualificação, fechamento e pós-venda.",
    instructor: { name: "Aline Rocha", bio: "Head de Vendas em SaaS B2B." },
    modules: [
      buildModule(1, "Mentalidade de Vendas", [
        ["Vendedor vs. consultor: qual você quer ser?", "12min"],
        ["Superando objeções antes que apareçam", "14min"],
        ["Rotina de alta performance", "10min"],
        ["CRM: por que 90% das equipes usam errado", "15min"],
      ]),
      buildModule(2, "Prospecção e Qualificação", [
        ["ICP: quem é seu cliente ideal?", "14min"],
        ["Cold outreach que responde", "18min"],
        ["BANT, SPIN e MEDDIC simplificados", "16min"],
        ["Discovery call: as perguntas certas", "15min"],
      ]),
      buildModule(3, "Fechamento e Pós-venda", [
        ["Proposta comercial que fecha deals", "16min"],
        ["Técnicas de fechamento sem ser chato", "14min"],
        ["Onboarding do cliente: começo do LTV", "12min"],
        ["Upsell e cross-sell sem forçar", "11min"],
      ]),
      buildModule(4, "Escala de Vendas", [
        ["Montando um playbook de vendas", "18min"],
        ["Contratando e treinando SDRs", "15min"],
        ["Métricas de funil e forecasting", "16min"],
        ["Automação sem perder o toque humano", "14min"],
      ]),
    ],
  },

  {
    slug: "branding",
    title: "Branding",
    thumb: branding,
    category: "Marca",
    year: 2024,
    duration: "5h 50min",
    level: "Iniciante",
    rating: "L",
    description: "Construa marcas memoráveis e desejadas.",
    longDescription: "Posicionamento, identidade verbal e visual, narrativa.",
    instructor: { name: "Felipe Souza", bio: "Diretor de marca e estratégia." },
    modules: placeholderModules(3),
  },

  {
    slug: "financas",
    title: "Finanças para Empreendedores",
    thumb: financas,
    category: "Finanças",
    year: 2025,
    duration: "6h 10min",
    level: "Iniciante",
    rating: "L",
    isNew: true,
    description: "Domine fluxo de caixa, precificação e indicadores.",
    longDescription: "DRE, fluxo de caixa, capital de giro e tomada de decisão.",
    instructor: { name: "Bruno Tavares", bio: "CFO consultor de PMEs." },
    modules: [
      buildModule(1, "Educação Financeira para Negócios", [
        ["Por que a maioria das empresas quebra por falta de caixa", "14min"],
        ["Separando pessoa física de jurídica de vez", "12min"],
        ["Pró-labore, dividendos e distribuição de lucros", "15min"],
        ["Lendo um DRE sem ser contador", "18min"],
      ]),
      buildModule(2, "Fluxo de Caixa e Precificação", [
        ["Fluxo de caixa direto: o mais prático", "16min"],
        ["Previsão de receita e despesa", "14min"],
        ["Precificação correta: custo + margem + mercado", "20min"],
        ["Ponto de equilíbrio e margem de contribuição", "15min"],
      ]),
      buildModule(3, "Crescimento e Captação", [
        ["Indicadores que os investidores olham", "16min"],
        ["Capital de giro: quando e como buscar crédito", "14min"],
        ["Planejamento financeiro anual simplificado", "18min"],
        ["Saída e valuation: o que é sua empresa vale?", "20min"],
      ]),
      buildModule(4, "Ferramentas e Automação", [
        ["Excel e Google Sheets para finanças", "15min"],
        ["ERP simples para PME", "14min"],
        ["Conciliação bancária automatizada", "12min"],
        ["Dashboard financeiro que o CEO usa todo dia", "16min"],
      ]),
    ],
  },

  {
    slug: "produtividade",
    title: "Produtividade",
    thumb: produtividade,
    category: "Carreira",
    year: 2024,
    duration: "4h 20min",
    level: "Iniciante",
    rating: "L",
    progress: 45,
    description: "Sistemas para foco profundo e execução consistente.",
    longDescription: "GTD, time-blocking, energia e ferramentas modernas.",
    instructor: { name: "Júlia Mendes", bio: "Coach de performance e hábitos." },
    modules: placeholderModules(3),
  },

  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    thumb: uiux,
    category: "Design",
    year: 2025,
    duration: "10h 15min",
    level: "Iniciante",
    rating: "L",
    isNew: true,
    description: "Do zero ao produto: pesquisa, wireframe, prototipagem e testes com usuários reais.",
    longDescription:
      "Aprenda a projetar interfaces intuitivas com Figma, conduzir pesquisas UX, criar fluxos de usuário e entregar protótipos de alta fidelidade prontos para desenvolvimento.",
    instructor: {
      name: "Tarun T. Das",
      bio: "UI/UX Mentor, HACA Design School — +8 anos projetando produtos digitais.",
    },
    modules: [
      buildModule(1, "Fundamentos de UX", [
        ["O que é UX e por que importa", "12min"],
        ["Design centrado no usuário na prática", "14min"],
        ["Pesquisa com usuários: entrevistas e surveys", "18min"],
        ["Personas e mapa de empatia", "15min"],
      ]),
      buildModule(2, "Arquitetura da Informação", [
        ["Hierarquia visual e organização de conteúdo", "16min"],
        ["Fluxos de usuário e user journey", "14min"],
        ["Card sorting e taxonomia", "12min"],
        ["Wireframes: do papel ao digital", "18min"],
      ]),
      buildModule(3, "UI Design com Figma", [
        ["Introdução ao Figma para quem não sabe nada", "20min"],
        ["Componentes, variantes e auto-layout", "22min"],
        ["Design systems: quando você precisa de um", "18min"],
        ["Tipografia e cor aplicadas a interfaces", "16min"],
        ["Responsividade e mobile-first", "15min"],
      ]),
      buildModule(4, "Prototipagem e Testes", [
        ["Prototipagem interativa no Figma", "18min"],
        ["Testes de usabilidade: como conduzir", "16min"],
        ["Métricas de UX: SUS, NPS, task success", "14min"],
        ["Iterando com base em feedback real", "15min"],
      ]),
      buildModule(5, "Entrega e Handoff", [
        ["Handoff para desenvolvedores sem atrito", "16min"],
        ["Documentação de design", "12min"],
        ["Construindo seu portfólio de UX", "18min"],
        ["Mercado de trabalho: freela vs. CLT vs. produto", "14min"],
      ]),
    ],
  },

  {
    slug: "portfolio-profissional",
    title: "Portfólio Profissional",
    thumb: portfolio,
    category: "Design",
    year: 2025,
    duration: "6h 30min",
    level: "Intermediário",
    rating: "L",
    isNew: true,
    description:
      "Construa um portfólio que converte: do planejamento visual à apresentação para clientes e recrutadores.",
    longDescription:
      "Masterplan, branding pessoal, identidade visual, organização de cases e estratégias para posicionamento no mercado de criação.",
    instructor: {
      name: "Teguh Oriza",
      bio: "Arquiteto e designer sênior, portfolio com projetos em 3 continentes.",
    },
    modules: placeholderModules(4),
  },
];

// Helpers usados nas rotas de home e meus-cursos.
// Nada muito complexo aqui — apenas filtros que a gente usa com frequência.
export const featuredCourse = courses[0]; // E-commerce como destaque padrão, trocar quando tiver lógica de curadoria
export const continueWatching = courses.filter((c) => (c.progress ?? 0) > 0 && (c.progress ?? 0) < 100);
export const newReleases = courses.filter((c) => c.isNew);
export const top10 = courses.filter((c) => c.isTop10);
export const allCourses = courses;

export const getCourseBySlug = (slug: string) => courses.find((c) => c.slug === slug);

/**
 * Retorna o ID da aula em que o usuário parou.
 * Lógica: progresso % total de aulas → primeira não concluída.
 * Isso é uma aproximação — quando tivermos progresso por aula no backend,
 * substituímos isso por uma query real.
 */
export function getCurrentLessonId(course: Course): string {
  const allLessons = course.modules.flatMap((m) => m.lessons);
  if (!allLessons.length) return "1";

  const progress = course.progress ?? 0;
  if (progress <= 0 || progress >= 100) return String(allLessons[0].id);

  const completedCount = Math.floor((progress / 100) * allLessons.length);
  const nextLesson = allLessons[completedCount] ?? allLessons[0];
  return String(nextLesson.id);
}
