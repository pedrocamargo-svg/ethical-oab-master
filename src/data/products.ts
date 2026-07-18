export type Tier = {
  price: number;
  priceLabel: string; // "R$ 27,90"
  installments: string; // "3x R$ 9,90"
  checkoutUrl: string;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  highlight: string;
  subheadline: string;
  bullets: string[];
  bonuses?: { title: string; description: string }[];
  forWho: string[];
  cta: string;
  tiers: Tier[]; // ordered ascending by price
};

export const PRODUCTS: Record<string, Product> = {
  "50-questoes-etica": {
    slug: "50-questoes-etica",
    name: "50 Questões Comentadas de Ética Profissional",
    shortName: "50 Questões de Ética",
    headline: "Tenha acesso às",
    highlight: "50 questões de ética profissional",
    subheadline:
      "As questões mais cobradas pela FGV que sempre se repetem no exame da OAB.",
    bullets: [
      "50 questões comentadas sobre a disciplina mais relevante da prova",
      "Explicações completas com resumos e diagramas",
      "Gabaritos comentados de forma didática",
      "Design inteligente para maior desempenho do aluno",
      "Questões anteriores da prova da OAB",
    ],
    forWho: [
      "Quem quer dominar a disciplina que mais pontua",
      "Quem já reprovou e busca um material direcionado",
      "Quem tem pouco tempo para estudar",
    ],
    cta: "QUERO SER APROVADO",
    tiers: [
      { price: 19.9, priceLabel: "R$ 19,90", installments: "3x R$ 7,10", checkoutUrl: "https://pay.hub.la/V5UtkibQYFxItEMLRQQl" },
      { price: 27.9, priceLabel: "R$ 27,90", installments: "3x R$ 9,90", checkoutUrl: "https://pay.hub.la/7zGyU7fQEJKlvUVtk1dn" },
      { price: 37.9, priceLabel: "R$ 37,90", installments: "3x R$ 13,50", checkoutUrl: "https://pay.hub.la/Z08MD3vV36hYF7qOcelU" },
    ],
  },
  "mapas-mentais-etica": {
    slug: "mapas-mentais-etica",
    name: "Mapas Mentais de Ética Profissional",
    shortName: "Mapas Mentais",
    headline: "Memorize a matéria que mais cai na OAB com",
    highlight: "mapas mentais visuais",
    subheadline:
      "Fixe todo o conteúdo de ética profissional em minutos — sem decoreba, sem sofrimento.",
    bullets: [
      "Mapas mentais completos de toda a matéria de Ética",
      "Formato visual que acelera a memorização",
      "Resumos estratégicos com o essencial da prova",
      "Compatível com impressão e leitura no celular",
      "Ideal para quem tem branco na hora da prova",
    ],
    forWho: [
      "Quem tem dificuldade em memorizar a matéria",
      "Quem trava e tem branco na hora da prova",
      "Quem quer revisar tudo em pouco tempo",
    ],
    cta: "QUERO OS MAPAS MENTAIS",
    tiers: [
      { price: 15.9, priceLabel: "R$ 15,90", installments: "3x R$ 5,70", checkoutUrl: "https://pay.hub.la/nTmR03njBz2YHizOUozS" },
      { price: 19.9, priceLabel: "R$ 19,90", installments: "3x R$ 7,10", checkoutUrl: "https://pay.hub.la/F9uSq7LvqJqMkHcPZE3s" },
      { price: 27.9, priceLabel: "R$ 27,90", installments: "3x R$ 9,90", checkoutUrl: "https://pay.hub.la/XkVCykxH644i6raMJjfM" },
    ],
  },
  "36-tpps-etica": {
    slug: "36-tpps-etica",
    name: "36 Temas Potenciais de Prova - Ética",
    shortName: "36 TPPs de Ética",
    headline: "Os",
    highlight: "36 temas potenciais",
    subheadline:
      "A curadoria definitiva com os temas que a FGV MAIS cobra em Ética Profissional. Estude somente o que realmente cai.",
    bullets: [
      "36 temas potenciais mapeados com base no histórico da FGV",
      "Cada tema com resumo, dicas e questões comentadas",
      "Domine o padrão FGV de cobrança",
      "Material 100% atualizado",
      "Foco absoluto no que mais cai",
    ],
    forWho: [
      "Quem não domina o padrão FGV",
      "Quem quer estudar só o essencial",
      "Quem já reprovou por falta de direcionamento",
    ],
    cta: "QUERO DOMINAR OS TEMAS",
    tiers: [
      { price: 42.9, priceLabel: "R$ 42,90", installments: "3x R$ 15,30", checkoutUrl: "https://pay.hub.la/Qq8KoEBXmFqvxeKVZShE" },
      { price: 47.9, priceLabel: "R$ 47,90", installments: "3x R$ 17,10", checkoutUrl: "https://pay.hub.la/De5kafMuHTp5fCYx0UBb" },
      { price: 57.9, priceLabel: "R$ 57,90", installments: "3x R$ 20,60", checkoutUrl: "https://pay.hub.la/XcPz5726jEH3tFjuENEs" },
    ],
  },
  "mapa-aprovacao": {
    slug: "mapa-aprovacao",
    name: "Mapa da Aprovação - 40 Dias",
    shortName: "Mapa da Aprovação",
    headline: "O plano completo para sua aprovação em",
    highlight: "40 dias",
    subheadline:
      "O material mais completo do método EDO. Um cronograma dia a dia com todo o conteúdo mastigado, focado 100% no que cai na prova.",
    bullets: [
      "Cronograma completo de 40 dias até a aprovação",
      "Cada dia com o conteúdo pronto para estudar",
      "Resumos, mapas mentais e questões integrados",
      "Método EDO aplicado do zero à aprovação",
      "Acesso vitalício e atualizações inclusas",
    ],
    forWho: [
      "Quem quer um plano completo do zero à aprovação",
      "Quem já reprovou e precisa mudar totalmente a estratégia",
      "Quem trabalha e tem pouco tempo para organizar os estudos",
    ],
    cta: "QUERO SER APROVADO EM 40 DIAS",
    tiers: [
      { price: 79.9, priceLabel: "R$ 79,90", installments: "12x R$ 8,10", checkoutUrl: "https://pay.hub.la/Wco6mtAgAKAwCQvCsxOr" },
      { price: 87.9, priceLabel: "R$ 87,90", installments: "12x R$ 8,90", checkoutUrl: "https://pay.hub.la/XiLvIOh8RzthLckSxTVz" },
      { price: 97.9, priceLabel: "R$ 97,90", installments: "12x R$ 9,90", checkoutUrl: "https://pay.hub.la/DuP2kwAWszMAxxtSO0qt" },
      { price: 127.9, priceLabel: "R$ 127,90", installments: "12x R$ 12,90", checkoutUrl: "https://pay.hub.la/iQcJ35LJetPx7qu6aKRD" },
    ],
  },
};

export function pickTierForBudget(product: Product, budget: number): Tier {
  // pick the highest tier <= budget, otherwise the cheapest
  const affordable = product.tiers.filter((t) => t.price <= budget);
  if (affordable.length > 0) return affordable[affordable.length - 1];
  return product.tiers[0];
}

export function getTierFromQuery(product: Product, param?: string | null): Tier {
  if (!param) return product.tiers[Math.floor(product.tiers.length / 2)];
  const asNumber = Number(param) / 100; // ?t=2790 -> 27.90
  const found = product.tiers.find((t) => Math.abs(t.price - asNumber) < 0.01);
  return found ?? product.tiers[Math.floor(product.tiers.length / 2)];
}

export function getMeetCta(product: Product): string {
  const starts = product.name.toLowerCase();
  const article =
    starts.startsWith("mapas") || starts.startsWith("36") ? "os" :
    starts.startsWith("50") ? "as" : "o";
  return `Quero conhecer ${article} ${product.name}`;
}
