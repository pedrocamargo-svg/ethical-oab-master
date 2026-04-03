import { CheckCircle } from "lucide-react";

const items = [
  "50 questões comentadas sobre a disciplina mais relevante da prova.",
  "Explicações completas com resumos e diagramas",
  "Questões com gabarito comentado de forma didática e de fácil compreensão",
  "Projetado com resumos estratégicos e design inteligente visando o maior desempenho do aluno",
  "Questões anteriores da prova da OAB para elevar seu nível.",
];

const WhatYouGetSection = () => {
  return (
    <section className="bg-section-alt py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-4">
          <span className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-sm px-6 py-2 rounded-full uppercase">
            Menor valor do ano
          </span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-12 text-foreground">
          O que você vai receber:
        </h2>
        <div className="max-w-3xl mx-auto space-y-5">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-card rounded-xl p-5 shadow-sm border border-border">
              <CheckCircle className="w-6 h-6 text-highlight flex-shrink-0 mt-0.5" />
              <p className="text-foreground text-lg">{item}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="#pricing"
            className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-lg py-4 px-10 rounded-full hover:brightness-110 transition-all shadow-lg"
          >
            QUERO GARANTIR O MEU!
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
