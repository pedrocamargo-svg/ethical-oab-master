import { Target, BookOpen, TrendingUp, Brain, CheckCircle } from "lucide-react";

const points = [
  { icon: Target, text: "Estudantes e bacharéis em direito que querem passar na OAB" },
  { icon: BookOpen, text: "Para você que quer chegar preparado na Prova sabendo quais as questões mais cobradas de Ética profissional — o tema com maior número de questões na prova." },
  { icon: TrendingUp, text: "Para quem está cansado de bater na trave e quer ter um estudo focado no principal tema da OAB." },
  { icon: Brain, text: "Precisa de um estudo focado e direcionado." },
  { icon: CheckCircle, text: "Está cansado de estudar por materiais extensos e repetitivos." },
];

const ForWhoSection = () => {
  return (
    <section className="bg-background py-12 sm:py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-8 sm:mb-12 text-foreground">
          Para quem é o livro?
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {points.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-section-alt border border-border">
              <item.icon className="w-7 h-7 text-highlight flex-shrink-0 mt-1" />
              <p className="text-foreground text-lg">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="#pricing"
            className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-lg py-4 px-10 rounded-full hover:brightness-110 transition-all shadow-lg"
          >
            QUERO COMEÇAR AGORA!
          </a>
        </div>
      </div>
    </section>
  );
};

export default ForWhoSection;
