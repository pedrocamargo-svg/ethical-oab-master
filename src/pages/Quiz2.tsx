import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizShell, QuizTitle, QuizText, QuizButton, QuizOptions } from "@/components/quiz/QuizShell";
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

  const patch = (p: A) => setA((prev) => ({ ...prev, ...p }));
  const next = (p: A = {}) => { patch(p); setStep((s) => s + 1); };

  const budget = a.orcamento ?? 50;
  const recSlug = budget >= 80 ? "mapa-aprovacao" : budget >= 40 ? "36-tpps-etica" : "50-questoes-etica";
  const recProduct = PRODUCTS[recSlug];
  const recTier = pickTierForBudget(recProduct, budget);

  const steps: React.ReactNode[] = [
    // 0 nazareth
    <>
      <QuizTitle>Descubra o plano exato para sua aprovação na OAB</QuizTitle>
      <QuizText>Um teste rápido de 16 perguntas. No final, você recebe um plano 100% personalizado.</QuizText>
      <QuizButton onClick={() => next()}>Iniciar teste →</QuizButton>
    </>,
    // 1 situação
    <>
      <QuizTitle>Como está sua situação hoje?</QuizTitle>
      <QuizOptions>
        {["Estudando pra primeira OAB", "Já fiz e não passei", "Faz tempo que parei", "Advogado(a) inscrito(a)"].map((x) => (
          <QuizButton key={x} variant="outline" onClick={() => next({ situacao: x })}>{x}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 2 reprovações
    <>
      <QuizTitle>Quantas vezes já reprovou?</QuizTitle>
      <QuizOptions>
        {["Nenhuma", "1", "2", "3+"].map((x) => (
          <QuizButton key={x} variant="outline" onClick={() => next({ reprovacoes: x })}>{x}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 3 o que falta
    <>
      <QuizTitle>O que você acha que está faltando?</QuizTitle>
      <QuizOptions>
        {["Direcionamento", "Foco", "Material bom", "Tempo", "Método"].map((x) => (
          <QuizButton key={x} variant="outline" onClick={() => next({ falta: x })}>{x}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 4 apresentação João
    <>
      <img src={joaoPedro} alt="João Pedro" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-green-500" />
      <QuizTitle>Prazer, sou o João Pedro</QuizTitle>
      <QuizText>Criador do método OAB Estudo Direcionado. Já ajudei milhares de alunos com o método <strong className="text-green-400">Raio X da FGV</strong>.</QuizText>
      <QuizButton onClick={() => next()}>Continuar →</QuizButton>
    </>,
    // 5 nome
    <NameStep onDone={(nome) => next({ nome })} />,
    // 6 sim/não
    <>
      <QuizTitle>{a.nome ? `${a.nome}, ` : ""}você concorda que estudar sem direcionamento é o principal motivo de reprovação?</QuizTitle>
      <QuizOptions>
        <QuizButton onClick={() => next({ concorda1: "sim" })}>Sim, concordo</QuizButton>
        <QuizButton variant="outline" onClick={() => next({ concorda1: "nao" })}>Não</QuizButton>
      </QuizOptions>
    </>,
    // 7 concorda
    <>
      <QuizTitle>Você concorda que estudar só o que MAIS cai economiza semanas de estudo?</QuizTitle>
      <QuizOptions>
        <QuizButton onClick={() => next({ concorda2: "sim" })}>Com certeza</QuizButton>
        <QuizButton variant="outline" onClick={() => next({ concorda2: "nao" })}>Não</QuizButton>
      </QuizOptions>
    </>,
    // 8 aplicaria
    <>
      <QuizTitle>Se você tivesse um plano dia a dia, aplicaria?</QuizTitle>
      <QuizOptions>
        <QuizButton onClick={() => next({ aplicaria: "sim" })}>Sim, com certeza</QuizButton>
        <QuizButton variant="outline" onClick={() => next({ aplicaria: "talvez" })}>Talvez</QuizButton>
      </QuizOptions>
    </>,
    // 9 depoimentos
    <>
      <QuizTitle>Veja o que quem aplicou o método está falando</QuizTitle>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[dep1, dep2, dep3, dep4].map((d, i) => (
          <img key={i} src={d} alt="depoimento" className="w-full h-32 object-cover rounded-lg" />
        ))}
      </div>
      <QuizButton onClick={() => next()}>Continuar →</QuizButton>
    </>,
    // 10 objetivo
    <>
      <QuizTitle>Qual seu objetivo principal?</QuizTitle>
      <QuizOptions>
        {["Passar na próxima OAB", "Advogar rápido", "Ter carreira estável", "Realizar sonho da família"].map((x) => (
          <QuizButton key={x} variant="outline" onClick={() => next({ objetivo: x })}>{x}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 11 30 dias
    <>
      <QuizTitle>Se em 30 dias você tivesse dominado o principal, valeria a pena?</QuizTitle>
      <QuizOptions>
        <QuizButton onClick={() => next({ trintaDias: "sim" })}>Sim!</QuizButton>
        <QuizButton variant="outline" onClick={() => next({ trintaDias: "nao" })}>Não sei</QuizButton>
      </QuizOptions>
    </>,
    // 12 loading
    <LoadingStep onDone={() => setStep((s) => s + 1)} />,
    // 13 disposto
    <>
      <QuizTitle>Você está disposto(a) a se dedicar ao plano?</QuizTitle>
      <QuizOptions>
        <QuizButton onClick={() => next({ disposto: "sim" })}>Sim, 100%</QuizButton>
        <QuizButton variant="outline" onClick={() => next({ disposto: "parcial" })}>Um pouco</QuizButton>
      </QuizOptions>
    </>,
    // 14 orçamento
    <>
      <QuizTitle>Quanto pode investir agora na sua aprovação?</QuizTitle>
      <QuizOptions>
        {[{l:"Até R$ 30",v:30},{l:"Até R$ 60",v:60},{l:"Até R$ 100",v:100},{l:"Mais de R$ 100",v:150}].map((x) => (
          <QuizButton key={x.v} variant="outline" onClick={() => next({ orcamento: x.v })}>{x.l}</QuizButton>
        ))}
      </QuizOptions>
    </>,
    // 15 compromisso
    <>
      <QuizTitle>Assumindo o compromisso com sua aprovação?</QuizTitle>
      <QuizButton onClick={() => next({ compromisso: true })}>SIM, ME COMPROMETO →</QuizButton>
    </>,
    // 16 plano pronto
    <>
      <div className="text-center mb-4">
        <span className="inline-block bg-green-500/20 text-green-400 font-bold text-xs px-3 py-1 rounded-full uppercase">Seu plano está pronto</span>
      </div>
      <QuizTitle>{recProduct.name}</QuizTitle>
      <QuizText>Baseado nas suas respostas, esse é o material perfeito para você{a.nome ? `, ${a.nome}` : ""}.</QuizText>
      <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-green-500/30">
        <div className="text-3xl font-extrabold text-green-400 text-center mb-2">{recTier.priceLabel}</div>
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

const LoadingStep = ({ onDone }: { onDone: () => void }) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      setP((v) => { if (v >= 100) { clearInterval(int); onDone(); return 100; } return v + 2; });
    }, 40);
    return () => clearInterval(int);
  }, [onDone]);
  return (
    <>
      <QuizTitle>Montando seu plano personalizado...</QuizTitle>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-green-500 transition-all" style={{ width: `${p}%` }} />
      </div>
      <p className="text-center text-white/60 text-sm">{p}%</p>
    </>
  );
};

const NameStep = ({ onDone }: { onDone: (n: string) => void }) => {
  const [v, setV] = useState("");
  return (
    <>
      <QuizTitle>Como posso te chamar?</QuizTitle>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Seu primeiro nome"
        className="w-full bg-white/5 border-2 border-white/20 focus:border-green-500 rounded-xl px-5 py-4 text-white text-lg mb-4 outline-none"
      />
      <QuizButton onClick={() => onDone(v.trim() || "Aluno(a)")}>Continuar →</QuizButton>
    </>
  );
};

export default Quiz2;
