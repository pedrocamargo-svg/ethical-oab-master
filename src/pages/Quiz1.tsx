import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  QuizShell,
  QuizTitle,
  QuizText,
  QuizButton,
  QuizOptions,
  QuizSlider,
} from "@/components/quiz/QuizShell";
import { initTracking, trackEvent, trackEventAndFlush } from "@/lib/tracking";
import { pixelTrack, pixelTrackCustom } from "@/lib/pixels";
import { PRODUCTS, pickTierForBudget, getMeetCta } from "@/data/products";
import joaoPedro from "@/assets/joao-pedro.jpeg";
import dep1 from "@/assets/depoimento1.jpeg";
import dep2 from "@/assets/depoimento2.jpeg";
import dep3 from "@/assets/depoimento3.jpeg";
import dep4 from "@/assets/depoimento4.jpeg";

const PRELOAD_IMGS = [joaoPedro, dep1, dep2, dep3, dep4];

type Answers = {
  jaFez?: "reprovei" | "primeira";
  reprovacoes?: number;
  dificuldade?: string;
  sonho?: string;
  sonhoOutro?: string;
  orcamento?: number;
};

const dificuldades = [
  { key: "focar", emoji: "🎯", label: "Tenho dificuldade em focar nos estudos" },
  { key: "branco", emoji: "🧠", label: "Tenho branco na hora da prova" },
  { key: "etica", emoji: "⚖️", label: "Tenho dificuldade em Ética" },
  { key: "fgv", emoji: "📚", label: "Não domino o padrão da FGV" },
  { key: "tempo", emoji: "⏰", label: "Trabalho e não tenho tempo de estudar" },
];

const sonhos = [
  { emoji: "👨‍👩‍👧", label: "Quero dar um futuro melhor para minha família" },
  { emoji: "💰", label: "Quero ganhar mais dinheiro sendo advogado" },
  { emoji: "🏢", label: "Sair do meu emprego e construir meu escritório" },
  { emoji: "⚖️", label: "Já trabalho com advocacia mas preciso da OAB para outras tarefas" },
  { emoji: "✍️", label: "Outro" },
];

function recommend(dificuldade?: string, orcamento?: number): { slug: string; price: number } {
  const budget = orcamento ?? 30;
  // baseado na parte #4 conforme instrução do João
  let candidates: string[] = [];
  switch (dificuldade) {
    case "focar":
      candidates = budget >= 80 ? ["mapa-aprovacao"] : ["mapas-mentais-etica", "50-questoes-etica"];
      break;
    case "branco":
      candidates = budget >= 80 ? ["mapa-aprovacao"] : ["mapas-mentais-etica"];
      break;
    case "etica":
      candidates = ["50-questoes-etica", "36-tpps-etica"];
      break;
    case "fgv":
      candidates = budget >= 80 ? ["mapa-aprovacao", "36-tpps-etica"] : ["36-tpps-etica"];
      break;
    case "tempo":
      candidates = budget >= 80 ? ["mapa-aprovacao"] : ["50-questoes-etica", "mapas-mentais-etica"];
      break;
    default:
      candidates = ["50-questoes-etica"];
  }
  // escolhe o primeiro candidato cujo tier mais próximo p/baixo caiba
  for (const slug of candidates) {
    const tier = pickTierForBudget(PRODUCTS[slug], budget);
    if (tier.price <= budget) return { slug, price: tier.price };
  }
  const slug = candidates[0];
  const tier = pickTierForBudget(PRODUCTS[slug], budget);
  return { slug, price: tier.price };
}

const Quiz1 = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const [reprovSlider, setReprovSlider] = useState(1);
  const [budgetSlider, setBudgetSlider] = useState(50);
  const [sonhoOutro, setSonhoOutro] = useState("");

  useEffect(() => {
    initTracking({ funnel: "quiz1" });
    pixelTrackCustom("QuizStart", { funnel: "quiz1" });
    pixelTrack("Lead", { funnel: "quiz1" });
    PRELOAD_IMGS.forEach((src) => { const img = new Image(); img.src = src; });
  }, []);
  useEffect(() => { trackEvent("quiz_step", { funnel: "quiz1", step, answers: a }); }, [step]);

  const advance = (patch: Partial<Answers> = {}) => {
    setA((prev) => ({ ...prev, ...patch }));
    setStep((s) => s + 1);
  };

  const steps: React.ReactNode[] = [
    // Parte 1 - intro
    <>
      <QuizTitle>
        O que vou te mostrar agora vai <span className="text-green-400">MUDAR SEU JOGO</span> e você nunca mais vai estudar para OAB da mesma maneira.
      </QuizTitle>
      <QuizText>
        Eu já estive no seu lugar, e sei como é frustrante aquele sentimento de estudar como nunca, se dedicar, dar a vida nos estudos e quando chega a hora da prova… é assim como grande parte dos candidatos você reprova.
      </QuizText>
      <QuizText>
        Por isso eu estou aqui para te guiar até a aprovação. Traduzindo: eu vou literalmente pegar na sua mão e te dar o caminho validado para você finalmente se tornar advogado. Vamos lá?
      </QuizText>
      <QuizButton onClick={() => advance()}>Vamos</QuizButton>
    </>,

    // Parte 2
    <>
      <QuizTitle>Me diz, você já fez a OAB antes ou vai fazer a primeira vez?</QuizTitle>
      <QuizOptions>
        <QuizButton variant="outline" onClick={() => advance({ jaFez: "reprovei" })}>Já reprovei antes</QuizButton>
        <QuizButton variant="outline" onClick={() => advance({ jaFez: "primeira" })}>Farei minha primeira vez</QuizButton>
      </QuizOptions>
    </>,

    // Parte 3A ou 3B
    a.jaFez === "reprovei" ? (
      <>
        <QuizTitle>Não desista!!</QuizTitle>
        <QuizText>
          80% dos candidatos reprovam, os que passam são aqueles que não desistem. E CONFIE EM MIM, hoje isso vai mudar de uma vez por todas. Você vai passar a utilizar a minha metodologia de estudo exclusiva e vai ser aprovado(a) de uma vez por todas.
        </QuizText>
        <p className="text-center text-white/90 mb-4">
          Para eu te ajudar da melhor maneira e criar um plano de estudo que realmente funcione para o seu caso, preciso saber de uma coisa: <strong>Quantas vezes você já reprovou?</strong>
        </p>
        <QuizSlider
          min={0}
          max={10}
          value={reprovSlider}
          onChange={setReprovSlider}
          format={(v) => (v >= 10 ? "+10 vezes" : v === 1 ? "1 vez" : `${v} vezes`)}
        />
        <QuizButton onClick={() => advance({ reprovacoes: reprovSlider })}>Avançar</QuizButton>
      </>
    ) : (
      <>
        <QuizTitle>Perfeito!!</QuizTitle>
        <QuizText>
          Se é a sua primeira vez melhor ainda! Nada melhor do que começar do jeito certo e já passar de primeira com segurança seguindo a minha metodologia exclusiva de estudo que vou te passar.
        </QuizText>
        <QuizButton onClick={() => advance()}>Ótimo!!</QuizButton>
      </>
    ),

    // Parte 4
    <>
      <QuizTitle>O que mais vem atrapalhando seus estudos?</QuizTitle>
      <QuizText>
        Muito obrigado pelo seu tempo até aqui, prometo que já estamos acabando. Para finalizar, preciso saber qual vem sendo a sua maior dificuldade na hora de estudar.
      </QuizText>
      <QuizOptions>
        {dificuldades.map((d) => (
          <QuizButton key={d.key} variant="outline" onClick={() => advance({ dificuldade: d.key })}>
            <span className="mr-2">{d.emoji}</span>{d.label}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,

    // Parte 5
    <>
      <QuizTitle>Vamos sonhar?</QuizTitle>
      <QuizText>Me diz rapidinho, o que te motiva a passar na OAB? Por que você quer tanto ser aprovado(a)?</QuizText>
      <QuizOptions>
        {sonhos.slice(0, 4).map((s) => (
          <QuizButton key={s.label} variant="outline" onClick={() => advance({ sonho: s.label })}>
            <span className="mr-2">{s.emoji}</span>{s.label}
          </QuizButton>
        ))}
        <input
          value={sonhoOutro}
          onChange={(e) => setSonhoOutro(e.target.value)}
          placeholder="✍️ Outro — digite aqui"
          className="w-full bg-white/5 border-2 border-white/20 focus:border-green-500 rounded-xl px-5 py-4 text-white text-base outline-none"
        />
        {sonhoOutro.trim() && (
          <QuizButton onClick={() => advance({ sonho: "Outro", sonhoOutro })}>Avançar →</QuizButton>
        )}
      </QuizOptions>
    </>,

    // Parte 6 - loading
    <LoadingStep onDone={() => setStep((s) => s + 1)} />,

    // Parte 7
    <>
      <img src={joaoPedro} alt="João Pedro" className="w-32 h-32 rounded-full object-cover object-top mx-auto mb-6 border-4 border-green-500" />
      <QuizTitle>Quem sou eu?</QuizTitle>
      <QuizText>
        Prazer, meu nome é <strong className="text-green-400">João Pedro</strong>, fundador da metodologia EDO (Estudo Direcionado OAB). Já trabalho com a aprovação de alunos no exame da ordem há +5 anos, e já são +1 mil alunos aprovados com uma taxa de aprovação de 85% em meus treinamentos.
      </QuizText>
      <QuizText>
        Aqui embaixo você pode ver alguns prints dos meus alunos aprovados. <strong>Relaxa, você será um deles.</strong>
      </QuizText>
      <DepoimentosCarousel />
      <QuizButton onClick={() => advance()}>Beleza!!</QuizButton>
    </>,

    // Parte 8
    <>
      <QuizTitle>Quanto você tem disponível hoje para ir atrás do seu sonho?</QuizTitle>
      <QuizText>
        Imagine quanto dinheiro você já gastou ou vai gastar com taxa de inscrição, quanto tempo e energia dedicados para sempre bater na trave. Hoje isso acaba e a sua aprovação passará a ser questão de tempo, não de sorte.
      </QuizText>
      <QuizSlider
        min={20}
        max={150}
        step={5}
        value={budgetSlider}
        onChange={setBudgetSlider}
        format={(v) => `R$ ${v}`}
      />
      <QuizButton onClick={() => advance({ orcamento: budgetSlider })}>Ver minha recomendação →</QuizButton>
    </>,

    // Parte 9
    <RecommendationStep answers={a} onGo={async (slug, price) => {
      await trackEventAndFlush("quiz_recommend", { funnel: "quiz1", slug, price, answers: a });
      nav(`/produto/${slug}?t=${Math.round(price * 100)}`);
    }} />,
  ];

  const progress = Math.round(((step + 1) / steps.length) * 100);
  return <QuizShell progress={progress}>{steps[step]}</QuizShell>;
};

const LoadingStep = ({ onDone }: { onDone: () => void }) => {
  const messages = ["Cruzando dados…", "Analisando perfil de estudo…", "Plano criado!! ✅"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setI(1), 1200);
    const t2 = setTimeout(() => setI(2), 2600);
    const t3 = setTimeout(() => onDone(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <>
      <QuizTitle>Criando seu plano personalizado</QuizTitle>
      <div className="flex flex-col items-center gap-6 py-6">
        {i < 2 && (
          <div className="w-12 h-12 border-4 border-white/10 border-t-green-500 rounded-full animate-spin" />
        )}
        <p className={"text-xl sm:text-2xl text-center " + (i === 2 ? "text-green-400 font-bold" : "text-white/80")}>{messages[i]}</p>
      </div>
    </>
  );
};

const DepoimentosCarousel = () => {
  const imgs = [dep1, dep2, dep3, dep4];
  const [idx, setIdx] = useState(0);
  return (
    <div className="mb-6">
      <div className="relative bg-white/5 rounded-2xl p-3 sm:p-4">
        <img
          src={imgs[idx]}
          alt={`Depoimento ${idx + 1}`}
          className="w-full h-auto max-h-[420px] object-contain rounded-lg mx-auto"
        />
        <button
          onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-xl"
        >
          ‹
        </button>
        <button
          onClick={() => setIdx((i) => (i + 1) % imgs.length)}
          aria-label="Próximo"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-xl"
        >
          ›
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {imgs.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={"w-2 h-2 rounded-full " + (i === idx ? "bg-green-500" : "bg-white/30")} />
        ))}
      </div>
    </div>
  );
};

const RecommendationStep = ({ answers, onGo }: { answers: Answers; onGo: (slug: string, price: number) => void }) => {
  const rec = recommend(answers.dificuldade, answers.orcamento);
  const product = PRODUCTS[rec.slug];
  return (
    <>
      <div className="text-center mb-4">
        <span className="inline-block bg-green-500/20 text-green-400 font-bold text-xs px-3 py-1 rounded-full uppercase">Nossa recomendação personalizada para o seu caso</span>
      </div>
      <QuizTitle>{product.name}</QuizTitle>
      <QuizText>{product.subheadline}</QuizText>
      <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-green-500/30">
        <div className="text-3xl sm:text-4xl font-extrabold text-green-400 text-center mb-2">R$ {rec.price.toFixed(2).replace(".", ",")}</div>
        <p className="text-center text-white/60 text-sm">Oferta personalizada para o seu perfil</p>
      </div>
      <QuizButton onClick={() => onGo(rec.slug, rec.price)}>{getMeetCta(product)} →</QuizButton>
    </>
  );
};

export default Quiz1;
