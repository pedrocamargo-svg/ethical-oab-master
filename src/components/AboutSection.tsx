import joaoPedro from "@/assets/joao-pedro.jpeg";

const AboutSection = () => {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-12 text-foreground">
          Quem é João Pedro
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-[300px_1fr] gap-10 items-center">
          <div className="flex justify-center">
            <img
              src={joaoPedro}
              alt="João Pedro"
              className="w-64 h-80 object-cover object-top rounded-2xl shadow-xl border-4 border-highlight"
            />
          </div>
          <div>
            <p className="text-lg text-foreground leading-relaxed">
              Meu nome é <strong>João Pedro</strong>. Sou criador da metodologia{" "}
              <strong className="text-highlight">OAB Estudo Direcionado</strong>, já aprovei milhares de alunos por todo o Brasil com meus cursos e atualmente tenho meu próprio escritório e alunos satisfeitos pelo Brasil inteiro, e tenho certeza que{" "}
              <strong className="text-highlight">você será um deles!</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
