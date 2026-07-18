import { useSearchParams, useParams, Navigate } from "react-router-dom";
import { CheckCircle, ShieldCheck, FileText, Mail, Lock, MessageCircle } from "lucide-react";
import { PRODUCTS, getTierFromQuery } from "@/data/products";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import FooterDisclaimer from "@/components/FooterDisclaimer";
import logo from "@/assets/logo.jpeg";

const ProductLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const product = slug ? PRODUCTS[slug] : undefined;

  if (!product) return <Navigate to="/" replace />;

  const tier = getTierFromQuery(product, params.get("t"));

  const trackAndGo = () => {
    try {
      // @ts-ignore
      window.fbq?.("track", "InitiateCheckout", { value: tier.price, currency: "BRL" });
      // @ts-ignore
      window.ttq?.track("InitiateCheckout", { value: tier.price, currency: "BRL", content_id: product.slug });
    } catch {}
    window.location.href = tier.checkoutUrl;
  };

  return (
    <main>
      {/* HERO */}
      <section className="bg-hero text-hero-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="container relative z-10 py-8 px-4 sm:px-6">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="OAB Estudo Direcionado" className="h-16 sm:h-20 md:h-24 rounded-lg" />
          </div>
          <div className="text-center mb-6">
            <span className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-xs sm:text-sm px-4 py-2 rounded-full uppercase">
              Atualizado para OAB 46
            </span>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-5xl leading-tight mb-4">
              {product.headline}{" "}
              <span className="text-highlight">{product.highlight}</span>{" "}
              {product.subheadline ? "" : null}
            </h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6">
              {product.subheadline}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { icon: ShieldCheck, label: "Garantia de 7 dias" },
              { icon: FileText, label: "Acesso digital em PDF" },
              { icon: Mail, label: "Acesso imediato por e-mail" },
              { icon: Lock, label: "Site 100% seguro" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-secondary/50 rounded-xl p-3 sm:p-4">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-highlight" />
                <span className="text-xs sm:text-sm font-semibold text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-2 bg-highlight mt-8" />
      </section>

      {/* O QUE VAI RECEBER */}
      <section className="bg-section-alt py-12 sm:py-16">
        <div className="container">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-8 text-foreground">
            O que você vai receber:
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {product.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-card rounded-xl p-4 sm:p-5 shadow-sm border border-border">
                <CheckCircle className="w-6 h-6 text-highlight flex-shrink-0 mt-0.5" />
                <p className="text-foreground text-base sm:text-lg">{b}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={trackAndGo} className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-base sm:text-lg py-3 sm:py-4 px-8 sm:px-10 rounded-full hover:brightness-110 transition-all shadow-lg">
              {product.cta}
            </button>
          </div>
        </div>
      </section>

      {/* BÔNUS (se houver) */}
      {product.bonuses && product.bonuses.length > 0 && (
        <section className="bg-hero text-hero-foreground py-12 sm:py-16">
          <div className="container">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-8">
              Bônus exclusivos inclusos
            </h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {product.bonuses.map((b, i) => (
                <div key={i} className="bg-secondary/40 rounded-xl p-6 border border-highlight/30">
                  <div className="text-highlight font-heading font-bold text-sm uppercase mb-2">Bônus 0{i + 1}</div>
                  <h3 className="font-heading font-bold text-xl mb-2">{b.title}</h3>
                  <p className="opacity-90 text-sm">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARA QUEM É */}
      <section className="bg-background py-12 sm:py-16">
        <div className="container max-w-3xl">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-8 text-foreground">
            Este material é para você que:
          </h2>
          <div className="space-y-3">
            {product.forWho.map((item, i) => (
              <div key={i} className="flex items-start gap-3 border-l-4 border-highlight bg-section-alt rounded-r-lg p-4">
                <CheckCircle className="w-5 h-5 text-highlight flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={trackAndGo} className="inline-block bg-highlight text-highlight-foreground font-heading font-bold text-base sm:text-lg py-3 sm:py-4 px-8 rounded-full hover:brightness-110 transition-all shadow-lg">
              {product.cta}
            </button>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* PRICING */}
      <section id="pricing" className="bg-hero text-hero-foreground py-12 sm:py-16 md:py-24 px-4">
        <div className="container text-center">
          <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl mb-4 px-2">
            Oferta especial para você garantir agora:
          </h2>
          <div className="max-w-lg mx-auto mt-10 bg-card text-foreground rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-highlight text-highlight-foreground py-6 px-6">
              <p className="font-heading font-bold text-lg uppercase">Oferta especial</p>
            </div>
            <div className="py-10 px-6">
              <div className="mb-2">
                <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-highlight">{tier.priceLabel}</span>
                <span className="text-muted-foreground text-lg ml-2">à vista</span>
              </div>
              <p className="text-muted-foreground text-lg mb-8">
                ou <strong className="text-foreground">{tier.installments}</strong>
              </p>
              <button
                onClick={trackAndGo}
                className="inline-block w-full max-w-sm bg-highlight text-highlight-foreground font-heading font-bold text-base sm:text-lg py-3 sm:py-4 px-6 rounded-xl hover:brightness-110 transition-all animate-pulse-glow"
              >
                {product.cta}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                Compra 100% segura
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      <FAQSection />

      {/* WhatsApp CTA final */}
      <section className="bg-section-alt py-12">
        <div className="container text-center">
          <h3 className="font-heading font-bold text-xl mb-4 text-foreground">Ainda tem dúvidas?</h3>
          <a
            href="https://wa.me/5519989535229?text=Ol%C3%A1!%20Tenho%20interesse%20no%20material"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition"
          >
            <MessageCircle className="w-5 h-5" />
            Conversar no WhatsApp
          </a>
        </div>
      </section>

      <FooterDisclaimer />
    </main>
  );
};

export default ProductLandingPage;
