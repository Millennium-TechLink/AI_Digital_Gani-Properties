import { Helmet } from 'react-helmet-async';

export default function CataloguePage() {
  return (
    <>
      <Helmet>
        <title>Catalogue | Gani Properties</title>
      </Helmet>

      <div className="min-h-screen pt-20">
        <section className="container mx-auto px-4 lg:px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-6">
            Property Catalogue
          </h1>
          <p className="text-gp-ink-muted">Catalogue page - Migration in progress</p>
        </section>
      </div>
    </>
  );
}
