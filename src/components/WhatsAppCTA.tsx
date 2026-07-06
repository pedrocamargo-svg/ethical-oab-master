import { MessageCircle } from "lucide-react";

const WhatsAppCTA = () => {
  return (
    <section className="bg-hero text-hero-foreground py-12 sm:py-16 md:py-20">
      <div className="container text-center">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl mb-4">
          Ainda tem dúvidas?
        </h2>
        <p className="text-lg opacity-90 mb-8">
          Fale agora com um de nossos atendentes!
        </p>
        <a
           href="https://api.whatsapp.com/send?phone=5519989535229&text=Olá! Tenho interesse no PDF das 50 questões comentadas sobre Ética profissional!"
           target="_blank"
           rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-success text-success-foreground font-heading font-bold text-base sm:text-lg py-3 sm:py-4 px-8 sm:px-10 rounded-full hover:brightness-110 transition-all shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
          Conversar agora no WhatsApp
        </a>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
