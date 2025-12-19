import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";
import { Link } from "react-router-dom";

export default function Shop() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          className="shop-hero"
          eyebrow="Botiga"
          title="Merchandising Oficial"
          description="Aconsegueix tots productes oficials de la 30a edició del Rock’N’Rostoll.
Edicions limitades dissenyades exclusivament per commemorar tres dècades d’història."
        />

        <section className="page-section section-alt">
          <div className="page-content">
            <div className="shop-intro">
              <p className="section-description">
                Aquí tens els tres productes especials que oferim en aquest any per la 30è edició del Rock'N'Rostoll. Per fer una comanda, fes clic als enllaços de cada producte o utilitza el formulari general.
              </p>
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <Link
                  to="/comanda"
                  className="btn-primary"
                >
                  Formulari de Comanda General
                </Link>
              </div>
            </div>
            <div className="merch-grid">
              {products
                .filter(product => product.name !== "Donatiu")
                .map((product, index) => (
                  <ProductCard key={`${product.name}-${index}`} {...product} />
                ))}
            </div>
          </div>
        </section>
        <section id="talles" className="page-section section-alt">
          <div className="page-content split-layout" style={{ alignItems: "start" }}>

            {/* Left: Acknowledgment */}
            <div className="acknowledgment-text">
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Agraïments</h3>
              <blockquote style={{
                borderLeft: "4px solid var(--color-primary)",
                paddingLeft: "1.5rem",
                margin: 0,
                fontStyle: "italic",
                color: "var(--text-light)",
                fontSize: "1.2rem",
                lineHeight: "1.6"
              }}>
                "Volem expressar un agraïment sincer a <strong>Maria Antònia Roig</strong> pels dissenys gràfics aportats de manera totalment altruista, una contribució clau per fer possible aquesta edició especial."
              </blockquote>
            </div>

            {/* Right: Size Guide */}
            <div className="size-guide-container" style={{ width: "100%" }}>
              <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #333", paddingBottom: "0.5rem" }}>
                Guia de Talles (Unisex)
              </h4>
              <div style={{ overflowX: "auto" }}>
                <table className="size-table" style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.95rem", textAlign: "left", color: "#ccc" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-primary)" }}>
                      <th style={{ padding: "0.5rem" }}>Talla</th>
                      <th style={{ padding: "0.5rem" }}>Ample (A)</th>
                      <th style={{ padding: "0.5rem" }}>Llarg (B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "S", w: "51 cm", l: "67 cm" },
                      { t: "M", w: "56 cm", l: "70 cm" },
                      { t: "L", w: "61 cm", l: "73 cm" },
                      { t: "XL", w: "63.5 cm", l: "76 cm" },
                      { t: "2XL", w: "68.5 cm", l: "79 cm" }
                    ].map((row, i) => (
                      <tr key={row.t} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold", color: "var(--color-accent-yellow)" }}>{row.t}</td>
                        <td style={{ padding: "0.5rem" }}>{row.w}</td>
                        <td style={{ padding: "0.5rem" }}>{row.l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
