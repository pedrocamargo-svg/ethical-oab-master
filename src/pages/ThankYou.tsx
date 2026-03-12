import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <main className="min-h-screen bg-hero text-hero-foreground flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-highlight/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-highlight" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-heading font-bold text-3xl md:text-4xl">
            Parabéns pela sua compra! 🎉
          </h1>
          <p className="text-lg text-hero-foreground/80">
            Seja muito bem-vindo(a)! Você tomou a melhor decisão para a sua aprovação na OAB.
          </p>
        </div>

        <div className="bg-card text-foreground rounded-2xl p-8 shadow-xl space-y-4">
          <div className="flex justify-center">
            <Mail className="w-10 h-10 text-highlight" />
          </div>
          <h2 className="font-heading font-bold text-xl">
            Seu acesso já foi enviado!
          </h2>
          <p className="text-muted-foreground">
            Verifique seu <strong className="text-foreground">e-mail</strong> (inclusive a caixa de spam) para acessar o material completo das 50 questões comentadas sobre Ética Profissional.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-hero-foreground/70 text-sm">
            Caso não encontre o e-mail em alguns minutos, entre em contato pelo WhatsApp.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-highlight hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
