import logo from "@/assets/logo.jpeg";
import joaoPedro from "@/assets/joao-pedro.jpeg";
import mockup from "@/assets/mockup-ebook.png";
import { ShieldCheck, FileText, Mail, Lock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-hero text-hero-foreground relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.3) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container relative z-10 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="OAB Estudo Direcionado" className="h-20 md:h-28 object-contain rounded-lg" />
        </div>

        {/* Badge */}
        <div className="text-center mb-8">
          <span className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-sm md:text-base px-6 py-2 rounded-full uppercase tracking-wide">
            Atualizado para OAB 46
          </span>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              Tenha acesso as{" "}
              <span className="text-highlight">50 questões de ética profissional</span>{" "}
              mais cobradas pela FGV que sempre se repetem.
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Estude as 50 questões sobre o tema com maior incidência na OAB e{" "}
              <span className="text-highlight font-semibold">aumente seus acertos na prova.</span>
            </p>

            {/* Mockup */}
            <div className="animate-float">
              <img src={mockup} alt="Material 50 Questões OAB" className="w-full max-w-md mx-auto lg:mx-0" />
            </div>
          </div>

          {/* João Pedro photo */}
          <div className="flex justify-center">
            <img
              src={joaoPedro}
              alt="João Pedro - OAB Estudo Direcionado"
              className="w-72 md:w-96 rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: ShieldCheck, label: "Garantia de 7 dias" },
            { icon: FileText, label: "Acesso digital em PDF" },
            { icon: Mail, label: "Acesso imediato por e-mail" },
            { icon: Lock, label: "Site 100% seguro" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-secondary/50 rounded-xl p-4 backdrop-blur-sm">
              <item.icon className="w-8 h-8 text-highlight" />
              <span className="text-sm font-semibold text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Red accent bar */}
      <div className="h-2 bg-highlight mt-8" />
    </section>
  );
};

export default HeroSection;
