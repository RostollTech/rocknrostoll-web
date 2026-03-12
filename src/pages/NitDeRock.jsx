import { useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Countdown from "../components/Countdown";
import SEO from "../components/SEO";
import "../styles/NitDeRock.css";

export default function NitDeRock() {
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: "III Nit de Rock",
      description: "Concurs de bandes i música en directe a Maria de la Salut.",
      startDate: "2026-05-30T19:00:00+02:00",
      location: {
        "@type": "Place",
        name: "Poliesportiu",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Maria de la Salut",
          addressRegion: "Illes Balears",
          addressCountry: "ES",
        },
      },
    }),
    []
  );

  return (
    <>
      <SEO
        title="III Nit de Rock · Concurs de Bandes · Rock’n’Rostoll"
        description="Participa al concurs de bandes de la III Nit de Rock. Tota la informació sobre premis, inscripcions i la final el 30 de maig."
        canonicalPath="/nit-de-rock"
        image="https://rocknrostoll.cat/img/about-actualitat.jpg"
        structuredData={structuredData}
      />
      <Navbar />
      <main className="nit-de-rock-page">
        {/* HERO SECTION */}
        <section className="hero nit-hero">
          <div className="container">
            <div className="nit-hero-inner">
              <p className="nit-hero-eyebrow">MARIA DE LA SALUT</p>
              <h1 className="nit-hero-title">III NIT <br/> DE ROCK</h1>
              <p className="hero-description" style={{ color: 'white', fontSize: '1.4rem', marginTop: '2rem', maxWidth: '800px', marginInline: 'auto' }}>
                Tens una banda de música Rock i t'agradaria tocar al Rock'n'Rostoll 2026? <br/>
                <strong>Participa en el concurs de bandes de la III Nit de Rock!!</strong>
              </p>
              <div className="nit-hero-date-wrapper">
                <p className="nit-hero-date">DISSABTE 30 DE MAIG</p>
              </div>
              <div className="nit-hero-countdown">
                <Countdown targetDate="2026-05-30T19:00:00" />
              </div>
            </div>
          </div>
        </section>

        {/* INFO SECTION 1 */}
        <section className="section nit-info-section">
          <div className="container">
            <div className="nit-info-grid">
              <div className="nit-info-card">
                <h2 className="nit-info-title">L'ESCENARI</h2>
                <p className="nit-info-text">
                  El poliesportiu municipal es converteix en el temple del rock el <strong>30 de maig</strong>. 
                  Un espai condicionat per gaudir d'una nit de música emergent amb <strong>entrada lliure</strong>.
                </p>
              </div>
              <div className="nit-info-card">
                <h2 className="nit-info-title">LA FINAL</h2>
                <p className="nit-info-text">
                  Les 3 bandes més votades a Instagram seran les finalistes que tocaran el dia de la Nit de Rock (30 minuts per banda).
                  La decisió final serà a càrrec dels organitzadors + votació popular.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STEPS SECTION */}
        <section id="concurs" className="section nit-steps-section">
          <div className="container">
            <h2 className="section-title nit-steps-title">COM APUNTAR-SE?</h2>
            <div className="nit-steps-grid">
              <article className="nit-step-article">
                <span className="nit-step-label">Requisit</span>
                <h3 className="nit-step-title">Cançons Pròpies</h3>
                <p className="nit-step-text">Bandes de música Rock amb repertori original. No s'accepten grups de versions.</p>
              </article>
              <article className="nit-step-article">
                <span className="nit-step-label">Contacte</span>
                <h3 className="nit-step-title">Enviament Vídeo</h3>
                <p className="nit-step-text">
                  Envia un vídeo promocional a <strong>rocknrostoll@gmail.com</strong> detallant la formació.
                  <br /><br />
                  <span style={{ color: 'var(--color-accent-yellow)', fontWeight: 'bold' }}>DATA LÍMIT: 15 D'ABRIL</span>
                </p>
              </article>
              <article className="nit-step-article">
                <span className="nit-step-label">Selecció</span>
                <h3 className="nit-step-title">Votació Popular</h3>
                <p className="nit-step-text">Entre els seleccionats es faran votacions a través de l'Instagram del <strong>@rocknrostoll</strong>.</p>
              </article>
            </div>
          </div>
        </section>

        {/* PRIZES SECTION */}
        <section className="section nit-prizes-section">
          <div className="container nit-prizes-container">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '5rem', color: 'white' }}>PREMIS</h2>
            <div className="nit-prizes-list">
              <div className="nit-prize-item">
                <span className="nit-prize-rank gold">01</span>
                <div>
                  <h3 className="nit-prize-title">PRIMER PREMI</h3>
                  <p className="nit-prize-desc">Actuació remunerada a la XXX Edició del Rock’n’Rostoll + Gravació d’un tema*</p>
                </div>
              </div>
              <div className="nit-prize-item">
                <span className="nit-prize-rank silver">02</span>
                <div>
                  <h3 className="nit-prize-title">SEGON PREMI</h3>
                  <p className="nit-prize-desc">Gravació de dos temes*</p>
                </div>
              </div>
              <div className="nit-prize-item">
                <span className="nit-prize-rank bronze">03</span>
                <div>
                  <h3 className="nit-prize-title">TERCER PREMI</h3>
                  <p className="nit-prize-desc">Gravació d'un tema*</p>
                </div>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.6, fontSize: '1rem', color: 'white' }}>
              (*Inclou gravació, edició, mescla i masterització)
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section nit-cta-section">
          <div className="container">
            <h2 className="nit-cta-title">VOTACIÓ DE LA FINAL</h2>
            <p style={{ color: 'white', fontSize: '1.2rem', maxWidth: '700px', marginInline: 'auto', marginBottom: '3rem', opacity: 0.8 }}>
              El guanyador es decidirà per la combinació del jurat i la votació popular: 
              <strong> un vot per consumició associada durant la nit del concert.</strong>
            </p>
            <div className="nit-cta-btns">
              <a href="mailto:rocknrostoll@gmail.com" className="btn-primary">INSCRIU LA TEVA BANDA</a>
              <a href="https://instagram.com/rocknrostoll" target="_blank" rel="noopener noreferrer" className="btn-outline">VEURE INSTAGRAM</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
