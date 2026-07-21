import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useMemo } from "react";

export default function Shop() {
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Botiga Rock'N'Rostoll",
    description: "Merchandising oficial de la 30a edició del festival Rock'N'Rostoll.",
    url: "https://rocknrostoll.cat/shop",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products
        .filter(p => p.name !== "Donatiu")
        .map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: "https://rocknrostoll.cat/comanda", // Totes porten al formulari
          name: product.name,
          image: `https://rocknrostoll.cat${product.image}`
        }))
    }
  }), []);

  return (
    <>
      <SEO
        title="Botiga Oficial Rock’n’Rostoll · Merchandising 30a Edició"
        description="Aconsegueix els productes exclusius de la 30a edició del Rock’n’Rostoll: dessuadores, gorres, bosses i packs limitats. Fes la teva comanda online!"
        keywords={["Mallorca", "Rock", "Rock'n'Rostoll", "Botiga Rock'n'Rostoll", "Merchandising", "Dessuadora", "Gorra", "Bossa", "Comprar", "Festival Mallorca"]}
        canonicalPath="/shop"
        structuredData={structuredData}
      />
      <Navbar />
      <main>
        <PageHero
          className="shop-hero"
          eyebrow="Botiga"
          title="Merchandising Oficial"
          description="ÚLTIMA OPORTUNITAT! Avui és el darrer dia per aconseguir els productes oficials de la 30a edició. Edicions limitades dissenyades exclusivament per commemorar tres dècades d’història."
        />

        <section className="page-section">
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
          <div className="page-content">

            {/* Acknowledgment: Full Width Top */}
            <div className="acknowledgment-text" style={{ marginBottom: "3rem", maxWidth: "800px", margin: "0 auto 3rem auto" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>Agraïments</h3>
              <blockquote style={{
                borderLeft: "4px solid var(--color-primary)",
                paddingLeft: "1.5rem",
                margin: 0,
                fontStyle: "italic",
                color: "var(--text-light)",
                fontSize: "1.2rem",
                lineHeight: "1.6"
              }}>
                "Volem donar les gràcies a tota la gent que, any rere any, ha entès com de difícil és tirar endavant aquest festival de manera gratuïta i ens dona suport. Vivim del que guanyem a la barra i d'aquest merxandatge, i és gràcies al vostre suport que ho podem continuar fent possible."
              </blockquote>
            </div>

            {/* Size Guides: Side by Side */}
            <div className="size-guides-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "3rem", alignItems: "start" }}>

              {/* Box 1: Unisex */}
              <div className="size-guide-container">
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

              {/* Box 2: Infantil */}
              <div className="size-guide-container">
                <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #333", paddingBottom: "0.5rem" }}>
                  Guia de Talles (Infantil)
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
                        { t: "5-6", w: "41 cm", l: "50 cm" },
                        { t: "7-8", w: "43.5 cm", l: "55 cm" },
                        { t: "9-11", w: "46 cm", l: "60 cm" },
                        { t: "12-13", w: "51 cm", l: "65 cm" },
                        { t: "14-15", w: "56 cm", l: "71 cm" }
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

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
