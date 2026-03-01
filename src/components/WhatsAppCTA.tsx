import { MessageCircle } from "lucide-react";

const WhatsAppCTA = () => {
  return (
    <section className="bg-hero text-hero-foreground py-16 md:py-20">
      <div className="container text-center">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl mb-4">
          Ainda tem dúvidas?
        </h2>
        <p className="text-lg opacity-90 mb-8">
          Fale agora com um de nossos atendentes!
        </p>
        <a
          href="https://api.whatsapp.com/send?phone=5511978752110"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-success text-success-foreground font-heading font-bold text-lg py-4 px-10 rounded-full hover:brightness-110 transition-all shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
          Conversar agora no WhatsApp
        </a>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
