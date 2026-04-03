import { CheckCircle, ShieldCheck } from "lucide-react";

const PricingSection = () => {
  return (
    <section id="pricing" className="bg-hero text-hero-foreground py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="container text-center">
        <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl mb-4 px-2">
          Como você chegou até aqui, vou te fazer uma proposta mais que especial…
        </h2>

        <div className="max-w-lg mx-auto mt-10 bg-card text-foreground rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-highlight text-highlight-foreground py-6 px-6">
            <p className="font-heading font-bold text-lg uppercase tracking-wide">Oferta especial e exclusiva</p>
            <div className="mt-2">
              <span className="inline-block bg-hero-foreground/20 rounded-full px-4 py-1 text-sm font-bold">
                60% de desconto
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="py-10 px-6">
            <div className="mb-2">
              <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-highlight">R$ 27,90</span>
              <span className="text-muted-foreground text-lg ml-2">à vista</span>
            </div>
            <p className="text-muted-foreground text-lg mb-8">
              ou <strong className="text-foreground">3x de R$ 9,90</strong>
            </p>

            <a
              href="https://pay.hub.la/7zGyU7fQEJKlvUVtk1dn"
              className="inline-block w-full max-w-sm bg-highlight text-highlight-foreground font-heading font-bold text-lg py-4 px-8 rounded-xl hover:brightness-110 transition-all animate-pulse-glow"
            >
              QUERO SER APROVADO
            </a>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              Compra 100% segura
            </div>
          </div>

          {/* Features list */}
          <div className="border-t border-border px-6 py-8 space-y-4">
            {[
              { text: "Livro digital 100% atualizado para OAB 46", bold: "" },
              { text: "Questões da disciplina que", bold: "mais pontua" },
              { text: "Domine o tema com maior incidência", bold: "" },
              { text: "Vários gabaritos comentados com tabelas, diagramas e resumos", bold: "" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-highlight flex-shrink-0" />
                <p className="text-left">
                  {item.text} {item.bold && <strong className="text-highlight">{item.bold}</strong>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
