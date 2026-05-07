import { useEffect } from "react";
import { CheckCircle, Mail, ArrowLeft, MessageCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PRODUCT_VALUE = 19.9;
const PRODUCT_CURRENCY = "BRL";
const PRODUCT_ID = "oab-etica-50q";
const PRODUCT_NAME = "50 questões comentadas sobre Ética profissional";

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
    };
    fbq?: (action: string, event: string, params?: Record<string, unknown>, options?: { eventID?: string }) => void;
  }
}

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const ThankYou = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Use a stable event_id to deduplicate browser pixel + server CAPI
    const eventId = `purchase_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const value = Number(searchParams.get("value")) || PRODUCT_VALUE;
    const currency = searchParams.get("currency") || PRODUCT_CURRENCY;
    const email = searchParams.get("email") || undefined;
    const phone = searchParams.get("phone") || undefined;

    const eventParams = {
      value,
      currency,
      content_id: PRODUCT_ID,
      content_type: "product",
      content_name: PRODUCT_NAME,
      contents: [
        { content_id: PRODUCT_ID, content_type: "product", content_name: PRODUCT_NAME, quantity: 1, price: value },
      ],
    };

    // 1) Browser-side TikTok Pixel
    try {
      window.ttq?.track("CompletePayment", eventParams, { event_id: eventId });
    } catch (e) {
      console.warn("TikTok pixel error:", e);
    }

    // 2) Browser-side Meta Pixel (mantém compatibilidade com pixel já existente)
    try {
      window.fbq?.("track", "Purchase", { value, currency }, { eventID: eventId });
    } catch (e) {
      console.warn("Meta pixel error:", e);
    }

    // 3) Server-side TikTok Conversions API (deduplicado pelo event_id)
    const ttclid = searchParams.get("ttclid") || getCookie("ttclid");
    const ttp = getCookie("_ttp");

    supabase.functions
      .invoke("tiktok-purchase", {
        body: {
          value,
          currency,
          content_id: PRODUCT_ID,
          content_name: PRODUCT_NAME,
          content_type: "product",
          event_id: eventId,
          url: window.location.href,
          email,
          phone,
          ttclid,
          ttp,
        },
      })
      .then(({ error }) => {
        if (error) console.warn("TikTok CAPI error:", error);
      });
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-hero text-hero-foreground flex items-center justify-center px-4 py-12">
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
            <MessageCircle className="w-10 h-10 text-highlight" />
          </div>
          <h2 className="font-heading font-bold text-xl">
            Seu acesso já foi enviado!
          </h2>
          <p className="text-muted-foreground">
            Receba seu PDF pelo <strong className="text-foreground">WhatsApp</strong>! Clique no botão abaixo e receba o seu acesso!!
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="https://wa.me/5511978752110?text=Ol%C3%A1!%20Tenho%20interesse%20no%20PDF%20das%2050%20quest%C3%B5es%20comentadas%20sobre%20%C3%89tica%20profissional!"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center gap-3 w-full px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl md:text-2xl transition-all shadow-2xl uppercase tracking-wide animate-pulse ring-4 ring-primary/30"
          >
            <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-lg border-2 border-white">
              1
            </span>
            <MessageCircle className="w-7 h-7" />
            Acessar meu produto
          </a>
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-highlight hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
