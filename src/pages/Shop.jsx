import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useEffect, useMemo, useState } from "react";

export default function Shop() {
  const [stockByProduct, setStockByProduct] = useState(null);

  useEffect(() => {
    fetch("/api/stock")
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(rows => {
        const totals = {};
        rows.forEach(row => {
          totals[row.product_name] = (totals[row.product_name] || 0) + row.quantity;
        });
        setStockByProduct(totals);
      })
      .catch(() => setStockByProduct({}));
  }, []);

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
              <div style={{
                margin: "1.5rem auto 0", maxWidth: "40rem", padding: "1rem 1.25rem", borderRadius: "0.75rem",
                border: "1px solid var(--color-accent-yellow)", background: "rgba(251, 168, 48, 0.08)", textAlign: "center",
              }}>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>
                  📦 <strong>Recollida presencial:</strong> els productes no s'envien. Un cop feta la comanda rebràs un
                  <strong> codi de recollida</strong> que hauràs de presentar per recollir-los en persona. El lloc i l'horari
                  de recollida s'anunciaran properament per xarxes socials.
                </p>
              </div>
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
                  <ProductCard
                    key={`${product.name}-${index}`}
                    {...product}
                    remaining={stockByProduct ? (stockByProduct[product.name] ?? 0) : null}
                  />
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

            {/* Size Guides: one table per producte, mesures reals SOL'S (A/B en cm) */}
            <div className="size-guides-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "start" }}>

              {[
                {
                  title: "Camiseta",
                  rows: [
                    { t: "XS", w: "48 cm", l: "64 cm" },
                    { t: "S", w: "50 cm", l: "70 cm" },
                    { t: "M", w: "53 cm", l: "72 cm" },
                    { t: "L", w: "56 cm", l: "74 cm" },
                    { t: "XL", w: "59 cm", l: "76 cm" },
                    { t: "XXL", w: "62 cm", l: "78 cm" },
                  ],
                },
                {
                  title: "Camiseta Infant",
                  rows: [
                    { t: "4 anys", w: "32 cm", l: "43 cm" },
                    { t: "6 anys", w: "35 cm", l: "46 cm" },
                    { t: "8 anys", w: "38 cm", l: "49 cm" },
                    { t: "10 anys", w: "41 cm", l: "52 cm" },
                    { t: "12 anys", w: "44 cm", l: "55 cm" },
                  ],
                },
                {
                  title: "Camiseta Màniga Llarga",
                  rows: [
                    { t: "S", w: "50 cm", l: "69 cm" },
                    { t: "M", w: "53 cm", l: "71 cm" },
                    { t: "L", w: "56 cm", l: "73 cm" },
                    { t: "XL", w: "59 cm", l: "75 cm" },
                    { t: "XXL", w: "62 cm", l: "77 cm" },
                  ],
                },
              ].map(guide => (
                <div className="size-guide-container" key={guide.title}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #333", paddingBottom: "0.5rem" }}>
                    Guia de Talles — {guide.title}
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
                        {guide.rows.map((row, i) => (
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
              ))}

            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
