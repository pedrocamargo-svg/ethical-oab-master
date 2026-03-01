const FooterDisclaimer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container text-center">
        <p className="text-sm opacity-70 max-w-2xl mx-auto">
          Aviso legal: Os depoimentos dos aprovados contidos nessa página não podem ser considerados como garantia da sua aprovação.
        </p>
        <p className="text-sm opacity-50 mt-4">
          © {new Date().getFullYear()} OAB Estudo Direcionado. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default FooterDisclaimer;
