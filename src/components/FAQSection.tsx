import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "O que é abordado no livro digital?",
    a: "Este material contém 50 questões mais cobradas de Ética Profissional pela FGV para a prova da OAB com gabarito comentado de forma didática. Foram selecionadas questões sobre temas, artigos e súmulas que vem se repetindo ao longo dos anos nas provas da banca, focando exclusivamente na disciplina com maior incidência na prova.",
  },
  {
    q: "Como é a didática do livro digital?",
    a: "O material contém inicialmente um Raio X da questão citando pontos de atenção na hora da resolução além de artigos importantes. Após o Raio X vem a questão com gabarito comentado, em que muitas vezes possuem tabelas esquematizadas do conteúdo, explicação detalhada sobre a questão e outros artigos importantes.",
  },
  {
    q: "Quantas pessoas já foram aprovadas com materiais da OAB Estudo Direcionado?",
    a: "Milhares de alunos já foram aprovados com uma taxa de 85% de aprovação em nossos principais cursos e plataformas.",
  },
  {
    q: "Quais os benefícios em adquirir o livro digital?",
    a: "Material estratégico e focado em questões com temas muito cobrados pela FGV. Questões com gabarito comentado de forma didática. Vários gabaritos com tabelas, diagramas e resumos para facilitar a memorização. Bônus exclusivo com as 10 questões mais recorrentes. Excelente custo-benefício.",
  },
  {
    q: "Como tenho acesso ao livro digital?",
    a: "Ao finalizar a compra você recebe o acesso imediato via e-mail com o PDF do livro digital.",
  },
  {
    q: "Posso imprimir o livro digital?",
    a: "Sim! Você pode imprimir se desejar.",
  },
];

const FAQSection = () => {
  return (
    <section className="bg-section-alt py-12 sm:py-16 md:py-24">
      <div className="container max-w-3xl">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-12 text-foreground">
          Dúvidas <span className="text-highlight">Frequentes</span>
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl border border-border px-6 shadow-sm"
            >
              <AccordionTrigger className="font-heading font-semibold text-left text-foreground hover:text-highlight">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
