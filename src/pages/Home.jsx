import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InstagramEmbed from "../components/InstagramEmbed";
import FacebookEmbed from "../components/FacebookEmbed";
import Countdown from "../components/Countdown";
import SEO from "../components/SEO";
import galleryImages from "../data/gallery";

// SEO: Recomanat exportar les imatges de la galeria a formats .webp o .avif per reduir el pes

export default function Home() {
  const gallery = useMemo(() => galleryImages, []);
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: "Rock’n’Rostoll 2026",
      alternateName: "Rock and Rostoll 2026",
      description:
        "Festival autogestionat de rock i electrònica que se celebra a Son Perot (Maria de la Salut).",
      keywords: [
        "Rock’n’Rostoll",
        "Rock and Rostoll",
        "Rostoll",
        "festival Mallorca",
        "festival malllorca",
        "rock",
        "Maria de la Salut",
      ],
      startDate: "2026-08-29T19:00:00+02:00",
      endDate: "2026-08-30T06:00:00+02:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      image: [
        "https://rocknrostoll.cat/img/about-actualitat.jpg",
        "https://rocknrostoll.cat/img/about-voluntariat.jpg",
      ],
      location: {
        "@type": "Place",
        name: "Son Perot",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Camí de Maria de la Salut a Muro",
          addressLocality: "Maria de la Salut",
          addressRegion: "Illes Balears",
          postalCode: "07518",
          addressCountry: "ES",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "Associació Cultural Rock’n’Rostoll",
        url: "https://rocknrostoll.cat",
      },
      performer: {
        "@type": "MusicGroup",
        name: "Line-up Rock’n’Rostoll",
      },
    }),
    [],
  );

  return (
    <>
      <SEO
        title="Rock’n’Rostoll · Festival autogestionat de rock i electrònica a Mallorca"
        description="Rock’n’Rostoll és el festival autogestionat de referència a Maria de la Salut. Consulta informació pràctica, descobreix la història del festival i prepara la teva visita a Son Perot."
        keywords={[
          "Rock’n’Rostoll",
          "Rock and Rostoll",
          "festival Mallorca",
          "festival rock Mallorca",
          "Maria de la Salut",
          "música electrònica Mallorca",
        ]}
        canonicalPath="/"
        image="https://rocknrostoll.cat/img/about-actualitat.jpg"
        structuredData={structuredData}
      />
      <Navbar />
      <main>
        <section className="hero home-hero">
          <div className="hero-content">
            <p className="hero-eyebrow">30a edició</p>
            <h1 className="hero-title">30 edicions de música, amistat i rostoll</h1>
            <p className="hero-meta">29 d’agost de 2026 · Festival autogestionat a Son Perot (Maria de la Salut)</p>
            <p className="hero-description">
              Rock’n’Rostoll és el festival autogestionat de referència al Pla de Mallorca. Un punt de trobada entre
              generacions, música i llibertat, on el rock i l’electrònica omplen el rostoll de Maria de la Salut cada darrer
              dissabte d’agost. Celebrem 30 edicions d’història, germanor i molta festa!
            </p>

            <Countdown />

            <div className="button-group">
              <Link to="/about" className="btn-primary">
                Qui som?
              </Link>
              <Link to="/shop" className="btn-outline">
                Merxandatge
              </Link>
              <Link to="/contact" className="btn-outline">
                Segueix-nos
              </Link>
            </div>
          </div>
        </section>

        <section className="section" style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'center' }}>

              <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
                <span className="section-eyebrow" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'block' }}>Novetat 30a Edició</span>
                <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>Porta el Rock’n’Rostoll amb tu</h2>
                <p className="section-description" style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                  <strong>La venda online ha finalitzat. Moltes gràcies a tothom per la vostra col·laboració!</strong>
                  <br />
                  Pròximament rebreu informació sobre el mètode de distribució i recollida de les comandes.
                </p>

                <Link to="/shop" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Veure productes <span>→</span>
                </Link>
              </div>

              <div style={{ flex: '1 1 350px', position: 'relative', height: '400px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Images with decorative positioning and white background */}
                <div style={{ position: 'absolute', top: '20px', right: '10%', width: '55%', zIndex: 1, transition: 'transform 0.3s ease' }}>
                  <div className="sold-out-container">
                    <img
                      src="/products/dessuadora.webp"
                      alt="Dessuadora Rock'n'Rostoll"
                      style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', transform: 'rotate(6deg)', background: 'white', padding: '10px' }}
                    />
                    <div className="sold-out-overlay" style={{ borderRadius: '12px', transform: 'rotate(6deg)' }}>
                      <span className="sold-out-text">No disponible</span>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '20px', left: '10%', width: '50%', zIndex: 2, transition: 'transform 0.3s ease' }}>
                  <div className="sold-out-container">
                    <img
                      src="/products/gorra.webp"
                      alt="Gorra Rock'n'Rostoll"
                      style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', transform: 'rotate(-6deg)', border: '4px solid #fff', background: 'white', padding: '10px' }}
                    />
                    <div className="sold-out-overlay" style={{ borderRadius: '12px', transform: 'rotate(-6deg)' }}>
                      <span className="sold-out-text">No disponible</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="section section-alt" id="programa">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Organitza la teva arribada</p>
              <h2 className="section-title">Informació essencial</h2>
              <p className="section-description">
                Tot el que has de saber per gaudir del Rock’n’Rostoll amb comoditat i seguretat. Consulta horaris, accessos i
                normes bàsiques abans d’arribar a Son Perot.
              </p>
            </div>

            <div className="info-grid">
              <article className="info-card">
                <span className="info-label">Quan i on</span>
                <h3 className="info-title">Com sempre, el darrer Dissabte d'Agost</h3>
                <p className="info-text">Dissabte  d’agost · Son Perot, carretera Maria de la Salut &gt; Muro.</p>
              </article>
              <article className="info-card">
                <span className="info-label">Entrada i aparcament</span>
                <h3 className="info-title">Accés gratuït</h3>
                <p className="info-text">
                  Entrada i aparcament gratuït al recinte. Aparcament alternatiu al poble (a 2 km). Venir en cotxades o busos
                  ajuda a evitar embossos i accidents. Prohibit l’acampament defora dels aparcaments habilitats.
                </p>
              </article>
              <article className="info-card">
                <span className="info-label">Normes bàsiques</span>
                <h3 className="info-title">Conviu i respecta</h3>
                <ul className="info-list">
                  <li>Prohibit entrar alcohol.</li>
                  <li>Punts lila i d’Energy Control operatius tota la nit.</li>
                  <li>Servei de foodtrucks i barra amb pagament en efectiu.</li>
                  <li>Opció de comprar consumicions online.</li>
                  <li>Estima la terra · No l’embrutis.</li>
                  <li>Respecte, tolerància i civisme.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Galeria</p>
              <h2 className="section-title">Moments Rock’n’Rostoll</h2>
              <p className="section-description">Un recorregut visual pel darrer festival.</p>
            </div>

            <div className="gallery-grid">
              {gallery.map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        {/* <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Xarxes</p>
              <h2 className="section-title">Reviu l’ambient</h2>
              <p className="section-description">Clips i moments compartits a les xarxes.</p>
            </div>

            <div className="video-frame">
              <div className="instagram-gallery">
                <InstagramEmbed url="https://www.instagram.com/p/DPKAi8BjMNs/" />
                <InstagramEmbed url="https://www.instagram.com/p/DO36Nm4jL5O/?utm_source=ig_web_copy_link&igsh=MWJtdDRjaTFzb3Z3NQ==" />
                <FacebookEmbed url="https://www.facebook.com/RadioRostoll/posts/pfbid0PqP9HPuEtVquNxfLe3T2HMsxCCivqnjZmRmmyuVsprcgcb8w2uSFdDhjBcoBXJkTl" />

              </div>
            </div>
          </div>
        </section> */}

        <section className="cta-banner" id="newsletter">
          <h3>Forma part de Rock’n’Rostoll!</h3>
          <p>
            Cada edició és possible gràcies a la gent que hi participa. Si vols ajudar, col·laborar o simplement rebre les
            novetats del festival, apunta’t a la newsletter.
          </p>
          <div className="button-group">
            <a href="#newsletter" className="btn-primary">
              Pròximament!
            </a>
            <a href="/contact#segueix" className="btn-outline">
              Segueix-nos a les xarxes
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
