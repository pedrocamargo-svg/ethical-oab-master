import logo from "@/assets/logo.jpeg";
import mockup from "@/assets/material-capa.jpeg";
import { ShieldCheck, FileText, Mail, Lock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-hero text-hero-foreground relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.3) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container relative z-10 py-6 px-4 sm:px-6 sm:py-8">
        {/* Logo */}
        <div className="flex justify-center mb-6 md:mb-8">
          <img src={logo} alt="OAB Estudo Direcionado" className="h-16 sm:h-20 md:h-28 object-contain rounded-lg" />
        </div>

        {/* Badge */}
        <div className="text-center mb-6 md:mb-8">
          <span className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 rounded-full uppercase tracking-wide">
            Atualizado para OAB 46
          </span>
        </div>

        {/* Main content */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 sm:mb-6">
            Tenha acesso as{" "}
            <span className="text-highlight">50 questões de ética profissional</span>{" "}
            mais cobradas pela FGV que sempre se repetem.
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8">
            Estude as 50 questões sobre o tema com maior incidência na OAB e{" "}
            <span className="text-highlight font-semibold">aumente seus acertos na prova.</span>
          </p>

          {/* Mockup smaller */}
          <div className="animate-float">
            <img src={mockup} alt="Material 50 Questões OAB" className="w-40 sm:w-48 md:w-56 mx-auto rounded-lg shadow-2xl" />
          </div>

        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
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
