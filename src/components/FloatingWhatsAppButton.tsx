import { MessageCircle } from "lucide-react";

const FloatingWhatsAppButton = () => {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=5519989535229&text=Olá! Tenho interesse no PDF das 50 questões comentadas sobre Ética profissional!"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-16 h-16 bg-success hover:bg-success/90 text-success-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in"
      aria-label="Abrir WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
};

export default FloatingWhatsAppButton;
