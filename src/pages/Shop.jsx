import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";

export default function Shop() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          className="shop-hero"
          eyebrow="Botiga"
          title="Merchandising Oficial"
          description="Aconsegueix tota la gamma de productes oficials de la 30a edició del Rock’N’Rostoll.
Samarretes, dessuadores, edicions limitades i altres peces de marxandatge dissenyades exclusivament per commemorar tres dècades d’història. Equipa’t amb el material oficial i forma part del llegat del festival."
        />

        <section className="page-section section-alt">
          <div className="page-content">
            <div className="shop-intro">
              <p className="section-description">
                Aquí tens els tres productes especials que oferim en aquest any per la 30è edició del Rock'N'Rostoll. Per fer una comanda, fes clic als enllaços de cada producte o utilitza el formulari general.
              </p>
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <a
                  href="https://forms.google.com/placeholder"
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Formulari de Comanda General
                </a>
              </div>
            </div>
            <div className="merch-grid">
              {products.map((product, index) => (
                <ProductCard key={`${product.name}-${index}`} {...product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
