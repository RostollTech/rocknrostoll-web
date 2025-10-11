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
          eyebrow="Merch"
          title="Placeholder Collection"
          description="Preview the generic merchandise line that will be replaced with official artwork closer to launch."
        />

        <section className="page-section section-alt">
          <div className="page-content">
            <div className="shop-intro">
              <p className="section-description">All designs, prices, and links are placeholders. Use them as a structure for the upcoming store.</p>
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
