import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizShell, QuizTitle, QuizText, QuizButton, QuizOptions } from "@/components/quiz/QuizShell";
import { initTracking, trackEvent } from "@/lib/tracking";
import { PRODUCTS, pickTierForBudget } from "@/data/products";
import joaoPedro from "@/assets/joao-pedro.jpeg";
import dep1 from "@/assets/depoimento1.jpeg";
import dep2 from "@/assets/depoimento2.jpeg";
import dep3 from "@/assets/depoimento3.jpeg";

type Answers = {
  fezOab?: "sim" | "nao";
  reprovacoes?: string;
  dificuldade?: string;
  sonho?: string;
  orcamento?: number;
};

const dificuldades = [
  { key: "focar", label: "Dificuldade em focar nos estudos" },
  { key: "branco", label: "Dou branco na hora da prova" },
  { key: "etica", label: "Tenho dificuldade em Ética" },
  { key: "fgv", label: "Não domino o padrão FGV" },
  { key: "tempo", label: "Trabalho e não tenho tempo" },
];

const sonhos = [
  "Ser aprovado(a) na OAB",
  "Advogar e ter minha carreira",
  "Provar para mim e minha família",
  "Ter estabilidade financeira",
];

const orcamentos = [
  { label: "Até R$ 20,00", value: 20 },
  { label: "Até R$ 30,00", value: 30 },
  { label: "Até R$ 50,00", value: 50 },
  { label: "Até R$ 100,00", value: 100 },
  { label: "Mais de R$ 100,00", value: 200 },
];

function recommend(dificuldade?: string, orcamento?: number): { slug: string; price: number } {
  const budget = orcamento ?? 30;
  let slug = "50-questoes-etica";
  switch (dificuldade) {
    case "focar":
    case "branco":
      slug = "mapas-mentais-etica";
      break;
    case "etica":
      slug = "50-questoes-etica";
      break;
    case "fgv":
      slug = "36-tpps-etica";
      break;
    case "tempo":
      slug = budget >= 80 ? "mapa-aprovacao" : "50-questoes-etica";
      break;
  }
  if (budget >= 80) slug = "mapa-aprovacao";
  const tier = pickTierForBudget(PRODUCTS[slug], budget);
  return { slug, price: tier.price };
}

const Quiz1 = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});

  useEffect(() => {
    initTracking({ funnel: "quiz1" });
  }, []);

  useEffect(() => {
    trackEvent("quiz_step", { funnel: "quiz1", step, answers: a });
  }, [step]);

  const advance = (patch: Partial<Answers> = {}) => {
    setA((prev) => ({ ...prev, ...patch }));
    setStep((s) => s + 1);
  };

  const totalSteps = 9;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const steps = [
    // 0 - intro
    <>
      <QuizTitle>Descubra em 2 minutos o material perfeito para sua aprovação</QuizTitle>
      <QuizText>Responda algumas perguntas rápidas e vou te mostrar o caminho mais curto para a OAB.</QuizText>
      <QuizButton onClick={() => advance()}>Começar agora →</QuizButton>
    </>,
    // 1 - já fez OAB?
    <>
      <QuizTitle>Você já fez a prova da OAB?</QuizTitle>
      <QuizOptions>
        <QuizButton onClick={() => advance({ fezOab: "sim" })}>Sim, já fiz</QuizButton>
        <QuizButton variant="outline" onClick={() => advance({ fezOab: "nao" })}>Ainda não fiz</QuizButton>
      </QuizOptions>
    </>,
    // 2 - reprovações OU boas-vindas
    a.fezOab === "sim" ? (
      <>
        <QuizTitle>Quantas vezes você já foi reprovado(a)?</QuizTitle>
        <QuizOptions>
          {["Nenhuma", "1 vez", "2 vezes", "3 ou mais"].map((r) => (
            <QuizButton key={r} variant="outline" onClick={() => advance({ reprovacoes: r })}>{r}</QuizButton>
          ))}
        </QuizOptions>
      </>
    ) : (
      <>
        <QuizTitle>Que bom te ter aqui! 🎯</QuizTitle>
        <QuizText>Começar com um material direcionado é a melhor decisão pra passar de primeira.</QuizText>
        <QuizButton onClick={() => advance()}>Continuar →</QuizButton>
      </>
    ),
    // 3 - dificuldade
    <>
      <QuizTitle>Qual sua maior dificuldade hoje?</QuizTitle>
      <QuizOptions>
        {dificuldades.map((d) => (
          <QuizButton key={d.key} variant="outline" onClick={() => advance({ dificuldade: d.key })}>{d.label}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 4 - sonho
    <>
      <QuizTitle>Qual seu maior sonho ao ser aprovado?</QuizTitle>
      <QuizOptions>
        {sonhos.map((s) => (
          <QuizButton key={s} variant="outline" onClick={() => advance({ sonho: s })}>{s}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 5 - loading
    <LoadingStep onDone={() => setStep((s) => s + 1)} />,
    // 6 - sobre João Pedro
    <>
      <img src={joaoPedro} alt="João Pedro" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-green-500" />
      <QuizTitle>Prazer, sou o João Pedro 👋</QuizTitle>
      <QuizText>
        Criei o método <strong className="text-green-400">OAB Estudo Direcionado</strong> depois de ajudar milhares de alunos a passarem
        estudando só o que realmente cai. Deixa eu te mostrar o material ideal pro seu caso.
      </QuizText>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[dep1, dep2, dep3].map((d, i) => (
          <img key={i} src={d} alt="depoimento" className="w-full h-24 object-cover rounded-lg" />
        ))}
      </div>
      <QuizButton onClick={() => advance()}>Ver minha recomendação →</QuizButton>
    </>,
    // 7 - orçamento
    <>
      <QuizTitle>Quanto você pode investir hoje na sua aprovação?</QuizTitle>
      <QuizText>Vou escolher o material que cabe no seu bolso.</QuizText>
      <QuizOptions>
        {orcamentos.map((o) => (
          <QuizButton key={o.value} variant="outline" onClick={() => advance({ orcamento: o.value })}>{o.label}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 8 - recomendação
    <RecommendationStep answers={a} onGo={(slug, price) => {
      trackEvent("quiz_recommend", { funnel: "quiz1", slug, price, answers: a });
      const tierParam = Math.round(price * 100);
      nav(`/produto/${slug}?t=${tierParam}`);
    }} />,
  ];

  return <QuizShell progress={progress}>{steps[step]}</QuizShell>;
};

const LoadingStep = ({ onDone }: { onDone: () => void }) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      setP((v) => {
        if (v >= 100) { clearInterval(int); onDone(); return 100; }
        return v + 2;
      });
    }, 40);
    return () => clearInterval(int);
  }, [onDone]);
  return (
    <>
      <QuizTitle>Analisando seu perfil...</QuizTitle>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-green-500 transition-all" style={{ width: `${p}%` }} />
      </div>
      <p className="text-center text-white/60 text-sm">{p}%</p>
    </>
  );
};

const RecommendationStep = ({ answers, onGo }: { answers: Answers; onGo: (slug: string, price: number) => void }) => {
  const rec = recommend(answers.dificuldade, answers.orcamento);
  const product = PRODUCTS[rec.slug];
  return (
    <>
      <div className="text-center mb-4">
        <span className="inline-block bg-green-500/20 text-green-400 font-bold text-xs px-3 py-1 rounded-full uppercase">Sua recomendação</span>
      </div>
      <QuizTitle>{product.name}</QuizTitle>
      <QuizText>{product.subheadline}</QuizText>
      <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-green-500/30">
        <div className="text-3xl font-extrabold text-green-400 text-center mb-2">R$ {rec.price.toFixed(2).replace(".", ",")}</div>
        <p className="text-center text-white/60 text-sm">Oferta personalizada para o seu perfil</p>
      </div>
      <QuizButton onClick={() => onGo(rec.slug, rec.price)}>QUERO ESSE MATERIAL →</QuizButton>
    </>
  );
};

export default Quiz1;
