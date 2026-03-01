import materialInside from "@/assets/material-inside.png";

const MaterialPreviewSection = () => {
  return (
    <section className="bg-section-alt py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-12 text-foreground">
          Veja o material por dentro
        </h2>
        <div className="max-w-4xl mx-auto">
          <img
            src={materialInside}
            alt="Páginas do material por dentro"
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default MaterialPreviewSection;
