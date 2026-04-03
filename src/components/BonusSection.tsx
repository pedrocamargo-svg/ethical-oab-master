import { Gift } from "lucide-react";

const BonusSection = () => {
  return (
    <section className="bg-hero text-hero-foreground py-12 sm:py-16 md:py-24">
      <div className="container text-center">
        <span className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-sm px-6 py-2 rounded-full uppercase mb-6">
          Oferta limitada
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl mb-4">
          Você terá acesso agora a um bônus especial
        </h2>
        <div className="max-w-2xl mx-auto mt-8 bg-secondary/40 rounded-2xl p-8 backdrop-blur-sm border border-highlight/30">
          <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-highlight mx-auto mb-4" />
          <h3 className="font-heading font-bold text-2xl mb-4">
            As 10 questões que mais caíram na OAB de Ética profissional nos últimos anos!
          </h3>
          <p className="text-lg opacity-90">
            Uma seção com as 10 questões com maior incidência na OAB feita para te ajudar a estudar as questões certeiras e ser aprovado no exame da ordem!
          </p>
        </div>
      </div>
    </section>
  );
};

export default BonusSection;
