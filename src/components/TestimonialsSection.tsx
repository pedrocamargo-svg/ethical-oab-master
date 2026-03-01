import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dep1 from "@/assets/depoimento1.jpeg";
import dep2 from "@/assets/depoimento2.jpeg";
import dep3 from "@/assets/depoimento3.jpeg";
import dep4 from "@/assets/depoimento4.jpeg";
import dep5 from "@/assets/depoimento5.jpeg";
import dep6 from "@/assets/depoimento6.jpeg";

const testimonials = [dep1, dep2, dep3, dep4, dep5, dep6];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="bg-section-alt py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-4 text-foreground">
          Já são milhares de alunos aprovados com a nossa metodologia e nossos produtos
        </h2>
        <p className="text-center text-highlight font-heading font-bold text-xl mb-12">
          Veja o resultado dos meus alunos
        </p>

        <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto relative">
          {/* Arrow left */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 sm:-translate-x-12 md:-translate-x-16 z-10 bg-highlight text-highlight-foreground w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image */}
          <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border">
            <img
              src={testimonials[current]}
              alt={`Depoimento de aluno aprovado ${current + 1}`}
              className="w-full h-auto"
            />
          </div>

          {/* Arrow right */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 sm:translate-x-12 md:translate-x-16 z-10 bg-highlight text-highlight-foreground w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === current ? "bg-highlight scale-125" : "bg-border"
                }`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
