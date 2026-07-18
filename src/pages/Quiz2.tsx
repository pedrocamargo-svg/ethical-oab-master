import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  QuizShell,
  QuizTitle,
  QuizText,
  QuizButton,
  QuizOptions,
  QuizBigChoice,
} from "@/components/quiz/QuizShell";
import { initTracking, trackEvent } from "@/lib/tracking";
import { PRODUCTS, pickTierForBudget } from "@/data/products";
import joaoPedro from "@/assets/joao-pedro.jpeg";
import dep1 from "@/assets/depoimento1.jpeg";
import dep2 from "@/assets/depoimento2.jpeg";
import dep3 from "@/assets/depoimento3.jpeg";
import dep4 from "@/assets/depoimento4.jpeg";

type A = Record<string, any>;

const Quiz2 = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<A>({});

  useEffect(() => { initTracking({ funnel: "quiz2" }); }, []);
  useEffect(() => { trackEvent("quiz_step", { funnel: "quiz2", step, answers: a }); }, [step]);

  const next = (p: A = {}) => { setA((prev) => ({ ...prev, ...p })); setStep((s) => s + 1); };

  // recomendação baseada no orçamento (parte #14)
  const budget = a.orcamento ?? 50;
  let recSlug = "50-questoes-etica";
  if (budget >= 80) recSlug = "mapa-aprovacao";
  else if (budget >= 50) recSlug = "36-tpps-etica";
  else if (budget >= 30) recSlug = "50-questoes-etica";
  else recSlug = "mapas-mentais-etica";
  const recProduct = PRODUCTS[recSlug];
  const recTier = pickTierForBudget(recProduct, budget);

  const steps: React.ReactNode[] = [
    // #1
    <>
      <QuizTitle>
        Vou te dar o passo a passo completo para você passar na OAB como a <span className="text-green-400">Dona Nazareth de 78 anos</span> conseguiu.
      </QuizTitle>
      <QuizButton onClick={() => next()}>Quero muito</QuizButton>
    </>,
    // #2
    <>
      <QuizTitle>Qual sua situação atual na hora de estudar para OAB?</QuizTitle>
      <QuizOptions>
        {[
          { e: "❓", l: "Não sei como estudar" },
          { e: "🧠", l: "Tenho branco na hora da prova" },
          { e: "⏰", l: "Não tenho tempo e disponibilidade para estudar" },
          { e: "😞", l: "Já tentei de tudo mas não fui aprovado(a)" },
        ].map((x) => (
          <QuizButton key={x.l} variant="outline" onClick={() => next({ situacao: x.l })}>
            <span className="mr-2">{x.e}</span>{x.l}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,
    // #3
    <>
      <QuizTitle>Para eu entender melhor, quantas vezes você já reprovou?</QuizTitle>
      <QuizOptions>
        {[
          { e: "😰", l: "+ de 7 vezes" },
          { e: "😓", l: "Entre 5 e 7 vezes" },
          { e: "😕", l: "Entre 3 e 5 vezes" },
          { e: "🌱", l: "Vou fazer minha primeira vez" },
        ].map((x) => (
          <QuizButton key={x.l} variant="outline" onClick={() => next({ reprovacoes: x.l })}>
            <span className="mr-2">{x.e}</span>{x.l}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,
    // #4
    <>
      <QuizTitle>Me diz, o que você ACHA que falta para destravar sua aprovação?</QuizTitle>
      <QuizOptions>
        {[
          { e: "🗺️", l: "Um material visual e fácil de memorizar para não esquecer na hora da prova." },
          { e: "🎯", l: "Ter mais direcionamento e estudar somente aquilo que cai" },
          { e: "⚡", l: "Sempre bato na trave, preciso de algo simples, rápido e eficiente para passar." },
        ].map((x) => (
          <QuizButton key={x.l} variant="outline" onClick={() => next({ falta: x.l })}>
            <span className="mr-2">{x.e}</span>{x.l}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,
    // #5 apresentação + nome
    <ApresentacaoStep onDone={(nome) => next({ nome })} />,

    // #6
    <>
      <QuizTitle>
        {a.nome ? `${a.nome}, ` : ""}você está pronto para começar a estudar do <span className="underline decoration-green-500 font-bold">jeito certo</span> e fazer a última OAB da sua vida?
      </QuizTitle>
      <QuizBigChoice
        options={[
          { emoji: "🔥", label: "SIM!!", value: "sim" },
          { emoji: "🤔", label: "Não sei", value: "nao" },
        ]}
        onSelect={(v) => next({ pronto: v })}
      />
    </>,
    // #7
    <>
      <QuizTitle>
        Você concorda que a maioria dos cursos ou treinamentos te fazem estudar todos os conteúdos sem levar em conta os temas que mais caem e são mais importantes?
      </QuizTitle>
      <QuizBigChoice
        options={[
          { emoji: "✅", label: "Concordo!", value: "sim" },
          { emoji: "❌", label: "Não concordo", value: "nao" },
        ]}
        onSelect={(v) => next({ concorda1: v })}
      />
    </>,
    // #8
    <>
      <QuizTitle>
        E se você tivesse acesso a materiais prontos que te guiam do absoluto zero até a aprovação estudando somente aquilo que mais cai, tudo pronto e mastigado para você começar a aplicar ainda hoje? Você aplicaria?
      </QuizTitle>
      <QuizBigChoice
        options={[
          { emoji: "🚀", label: "Sim! Com certeza", value: "sim" },
          { emoji: "👍", label: "Provavelmente sim", value: "talvez" },
        ]}
        onSelect={(v) => next({ aplicaria: v })}
      />
    </>,
    // #9 depoimentos
    <>
      <QuizTitle>Todos eles começaram como você e olha como estão hoje</QuizTitle>
      <div className="flex flex-col gap-4 mb-6">
        {[dep1, dep2].map((d, i) => (
          <img key={i} src={d} alt={`Depoimento ${i + 1}`} className="w-full h-auto max-h-[380px] object-contain rounded-lg bg-white/5 p-2" />
        ))}
      </div>
      <QuizButton onClick={() => next()}>Continuar →</QuizButton>
    </>,
    // #10
    <>
      <QuizTitle>
        {a.nome ? `${a.nome}, ` : ""}se o sistema EDO funcionar para você como funcionou com essas pessoas — qual seria seu maior objetivo ao passar na OAB?
      </QuizTitle>
      <QuizText>Seja sincero, é muito importante…</QuizText>
      <QuizOptions>
        {[
          { e: "👨‍👩‍👧", l: "Dar um futuro melhor para minha família" },
          { e: "💰", l: "Ganhar mais e realizar meus sonhos" },
          { e: "📈", l: "Alavancar minha carreira" },
          { e: "⚖️", l: "Ter a honra de ser advogado(a)" },
        ].map((x) => (
          <QuizButton key={x.l} variant="outline" onClick={() => next({ objetivo: x.l })}>
            <span className="mr-2">{x.e}</span>{x.l}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,
    // #11
    <>
      <QuizTitle>Daqui 30 dias, como você quer estar?</QuizTitle>
      <QuizText>Pode sonhar…</QuizText>
      <QuizOptions>
        {[
          { e: "🎯", l: "Estudando somente aquilo que cai e aprendendo de verdade." },
          { e: "⚡", l: "Estudando menos e aprendendo mais." },
          { e: "🧘", l: "Com tranquilidade em relação à minha aprovação. Que passará a ser questão de tempo e não mais de sorte." },
          { e: "🏆", l: "Feliz porque irei fazer a última OAB da minha vida" },
        ].map((x) => (
          <QuizButton key={x.l} variant="outline" onClick={() => next({ trintaDias: x.l })}>
            <span className="mr-2">{x.e}</span>{x.l}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,
    // #12 loading + perfil
    <LoadingProfile onDone={() => setStep((s) => s + 1)} nome={a.nome} />,

    // #13
    <>
      <QuizTitle>
        O sistema EDO é 100% focado nos temas que caem de verdade na hora da prova, sem perda de tempo. Você está disposto a aplicá-lo em seus estudos?
      </QuizTitle>
      <QuizOptions>
        {[
          { e: "🔥", l: "Sim com certeza!" },
          { e: "🤔", l: "Talvez" },
          { e: "😅", l: "Irei tentar mas não sei…" },
        ].map((x) => (
          <QuizButton key={x.l} variant="outline" onClick={() => next({ disposto: x.l })}>
            <span className="mr-2">{x.e}</span>{x.l}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,
    // #14
    <>
      <QuizTitle>Quanto você tem disponível para investir no seu sonho?</QuizTitle>
      <QuizOptions>
        {[
          { e: "💵", l: "Menos de 30 reais", v: 25 },
          { e: "💰", l: "Entre 30 e 50 reais", v: 45 },
          { e: "💎", l: "Entre 50 e 80 reais", v: 75 },
          { e: "🚀", l: "Mais de 80 reais", v: 120 },
        ].map((x) => (
          <QuizButton key={x.l} variant="outline" onClick={() => next({ orcamento: x.v })}>
            <span className="mr-2">{x.e}</span>{x.l}
          </QuizButton>
        ))}
      </QuizOptions>
    </>,
    // #15 compromisso
    <>
      <QuizTitle>
        Você se compromete a seguir o plano que vou desenvolver para você usando o sistema EDO e começar a aplicar o quanto antes?
      </QuizTitle>
      <QuizBigChoice
        options={[
          { emoji: "🤝", label: "Sim, me comprometo", value: "sim" },
          { emoji: "😔", label: "Não sei se vou conseguir", value: "nao" },
        ]}
        onSelect={(v) => next({ compromisso: v })}
      />
    </>,
    // #15b perfil ideal
    <PerfilIdealStep onNext={() => setStep((s) => s + 1)} />,

    // #16 plano
    <>
      <div className="text-center mb-4">
        <span className="inline-block bg-green-500/20 text-green-400 font-bold text-xs px-3 py-1 rounded-full uppercase">Seu plano está pronto</span>
      </div>
      <QuizTitle>
        Baseado no seu perfil{a.nome ? `, ${a.nome}` : ""}, <span className="text-green-400">desenvolvi um plano exclusivamente para você</span>
      </QuizTitle>
      <TimelineAprovacao />
      <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-green-500/30">
        <p className="text-white/70 text-sm text-center mb-2">Material recomendado para você</p>
        <p className="text-xl sm:text-2xl font-bold text-center mb-3">{recProduct.name}</p>
        <div className="text-3xl sm:text-4xl font-extrabold text-green-400 text-center mb-1">{recTier.priceLabel}</div>
        <p className="text-center text-white/60 text-sm">ou {recTier.installments}</p>
      </div>
      <QuizButton onClick={() => {
        trackEvent("quiz_recommend", { funnel: "quiz2", slug: recSlug, price: recTier.price, answers: a });
        nav(`/produto/${recSlug}?t=${Math.round(recTier.price * 100)}`);
      }}>QUERO ACESSAR AGORA →</QuizButton>
    </>,
  ];

  const progress = Math.round(((step + 1) / steps.length) * 100);
  return <QuizShell progress={progress}>{steps[step]}</QuizShell>;
};

const ApresentacaoStep = ({ onDone }: { onDone: (n: string) => void }) => {
  const [v, setV] = useState("");
  return (
    <>
      <img src={joaoPedro} alt="João Pedro" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-top mx-auto mb-6 border-4 border-green-500" />
      <QuizTitle>Antes de continuar, deixa eu me apresentar</QuizTitle>
      <QuizText>
        Sou o <strong className="text-green-400">João Pedro</strong>. Nos últimos 10 anos, ajudei +1 mil alunos a serem aprovados no exame da ordem e conto com uma taxa de aprovação de 85% em meus treinamentos — e passei boa parte desse tempo estudando por que alunos tão dedicados simplesmente não conseguiam ser aprovados no exame da ordem.
      </QuizText>
      <QuizText>
        O que descobri foi surpreendente: o problema nunca era falta de dedicação. Era falta de um sistema para direcionar essa dedicação e energia nos temas que caem de verdade na hora da prova — um jeito rápido, simples e sem precisar se matar de estudar.
      </QuizText>
      <QuizText>
        Foi aí que criei o <strong>método EDO</strong>: um método com materiais prontos e visuais, com tudo mastigado e pronto para você sentar e estudar, 100% focado naquilo que vai cair na hora do seu exame. Você senta, lê o conteúdo, faz o exercício e sai com tudo fixado. Simples.
      </QuizText>
      <QuizText>Mas antes de continuar e montar seu plano personalizado…</QuizText>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Digite seu nome aqui"
        className="w-full bg-white/5 border-2 border-white/20 focus:border-green-500 rounded-xl px-5 py-4 text-white text-lg mb-4 outline-none"
      />
      <QuizButton disabled={!v.trim()} onClick={() => onDone(v.trim())}>Continuar →</QuizButton>
    </>
  );
};

const LoadingProfile = ({ onDone, nome }: { onDone: () => void; nome?: string }) => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!done) {
    return (
      <>
        <QuizTitle>Analisando suas respostas…</QuizTitle>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="w-14 h-14 border-4 border-white/10 border-t-green-500 rounded-full animate-spin" />
          <div className="w-full space-y-2 text-white/70 text-center">
            <p>✓ Cruzando dados do seu perfil</p>
            <p>✓ Identificando pontos de bloqueio</p>
            <p className="text-green-400">→ Montando estratégia personalizada…</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <QuizTitle>{nome ? `${nome}, ` : ""}vamos criar seu plano personalizado?</QuizTitle>
      <div className="bg-green-500/10 border border-green-500/40 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div><div className="text-3xl font-extrabold text-green-400">37%</div><div className="text-xs text-white/60">Nível de preparo</div></div>
          <div><div className="text-3xl font-extrabold text-green-400">42%</div><div className="text-xs text-white/60">Foco atual</div></div>
          <div><div className="text-3xl font-extrabold text-green-400">28%</div><div className="text-xs text-white/60">Direcionamento</div></div>
          <div><div className="text-3xl font-extrabold text-green-400">85%</div><div className="text-xs text-white/60">Potencial</div></div>
        </div>
      </div>
      <QuizText>Responda as próximas 3 perguntas e receba seu plano completo.</QuizText>
      <QuizButton onClick={onDone}>Continuar →</QuizButton>
    </>
  );
};

const PerfilIdealStep = ({ onNext }: { onNext: () => void }) => {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const int = setInterval(() => setP((v) => {
      if (v >= 100) { clearInterval(int); setDone(true); return 100; }
      return v + 4;
    }), 100);
    return () => clearInterval(int);
  }, []);
  if (!done) {
    return (
      <>
        <QuizTitle>Carregando seu plano personalizado…</QuizTitle>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-green-500 transition-all" style={{ width: `${p}%` }} />
        </div>
        <p className="text-center text-white/60 text-sm">{p}%</p>
      </>
    );
  }
  return (
    <>
      <QuizTitle>
        Você tem o <span className="text-green-400">PERFIL IDEAL</span> de quem pode ser aprovado no próximo exame com o método EDO!!
      </QuizTitle>
      <div className="mb-6">
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: "88%" }} />
        </div>
        <p className="text-right text-green-400 text-sm mt-1 font-bold">Você está aqui ▲</p>
      </div>
      <QuizButton onClick={onNext}>Ótimo!!</QuizButton>
    </>
  );
};

const TimelineAprovacao = () => (
  <div className="space-y-3 mb-6">
    {[
      { label: "Hoje você está aqui…", emoji: "📍" },
      { label: "3 dias — começa a perceber diferença no seu estudo", emoji: "✨" },
      { label: "15 dias — já pega o ritmo de estudo e se acostuma com a metodologia", emoji: "🚀" },
      { label: "Próximo exame: APROVAÇÃO", emoji: "🏆" },
    ].map((s, i) => (
      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
        <span className="text-2xl">{s.emoji}</span>
        <span className="text-sm sm:text-base">{s.label}</span>
      </div>
    ))}
  </div>
);

export default Quiz2;
