import dep1 from "@/assets/depoimento1.jpeg";
import dep2 from "@/assets/depoimento2.jpeg";
import dep3 from "@/assets/depoimento3.jpeg";
import dep4 from "@/assets/depoimento4.jpeg";
import dep5 from "@/assets/depoimento5.jpeg";
import dep6 from "@/assets/depoimento6.jpeg";

const testimonials = [dep1, dep2, dep3, dep4, dep5, dep6];

const TestimonialsSection = () => {
  return (
    <section className="bg-section-alt py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-4 text-foreground">
          Já são milhares de alunos aprovados com a nossa metodologia e nossos produtos
        </h2>
        <p className="text-center text-highlight font-heading font-bold text-xl mb-12">
          Veja o resultado dos meus alunos
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {testimonials.map((src, i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow">
              <img src={src} alt={`Depoimento de aluno aprovado ${i + 1}`} className="w-full h-auto max-h-72 object-cover object-top" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
