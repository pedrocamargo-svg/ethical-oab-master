import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import p1 from "@/assets/material-inside-1.jpeg";
import p2 from "@/assets/material-inside-2.jpeg";
import p3 from "@/assets/material-inside-3.jpeg";
import p4 from "@/assets/material-inside-4.jpeg";
import p5 from "@/assets/material-inside-5.jpeg";
import p6 from "@/assets/material-inside-6.jpeg";
import p7 from "@/assets/material-inside-7.jpeg";
import p8 from "@/assets/material-inside-8.jpeg";

const pages = [p1, p2, p3, p4, p5, p6, p7, p8];

const MaterialPreviewSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    pages.forEach((src) => { const img = new Image(); img.src = src; });
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? pages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === pages.length - 1 ? 0 : c + 1));

  return (
    <section className="bg-section-alt py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-12 text-foreground">
          Veja o material por dentro
        </h2>

        <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto relative">
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 sm:-translate-x-12 md:-translate-x-16 z-10 bg-highlight text-highlight-foreground w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <img
              src={pages[current]}
              alt={current === 0 ? "Capa do material" : `Página ${current} do material`}
              className="w-full h-auto"
            />
          </div>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 sm:translate-x-12 md:translate-x-16 z-10 bg-highlight text-highlight-foreground w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 flex-wrap">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                  i === current ? "bg-highlight scale-125" : "bg-border"
                }`}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaterialPreviewSection;
