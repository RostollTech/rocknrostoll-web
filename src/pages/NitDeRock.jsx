import { useMemo, useEffect } from "react";
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

  useEffect(() => {
    // widgets.js actualitza el wrapper; nosaltres actualitzem l'iframe directament
    const handleMessage = (e) => {
      let data = e.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { return; }
      }
      if (!data || data.type !== "strawpoll_resize" || !data.id) return;
      const iframe = document.getElementById("strawpoll_iframe_" + data.id);
      if (iframe) iframe.style.height = data.value + "px";
    };
    window.addEventListener("message", handleMessage);

    const script = document.createElement("script");
    script.src = "https://cdn.strawpoll.com/dist/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

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
              <h1 className="nit-hero-title">III NIT DE ROCK</h1>
              <p className="hero-description nit-hero-desc">
                <strong>Vota la teva banda preferida per a la final del 30 de maig.</strong>
              </p>
              <div className="nit-hero-countdown">
                <Countdown targetDate="2026-05-30T19:00:00" />
              </div>
            </div>
          </div>
        </section>

        {/* VOTING SECTION */}
        <section className="section section-alt nit-voting-section">
          <div className="container">
            <h2 className="section-title">VOTA A LA SEMIFINAL</h2>
            <p className="voting-desc">
              Tria la banda que vols veure a la final. Tens fins al dia de tancament de l'enquesta per participar!
            </p>

            <div className="voting-container">
              <div
                className="strawpoll-embed"
                id="strawpoll_wAg3QdmeGy8"
                style={{ maxWidth: "640px", width: "100%", margin: "0 auto" }}
              >
                <iframe
                  title="StrawPoll Embed"
                  id="strawpoll_iframe_wAg3QdmeGy8"
                  src="https://strawpoll.com/embed/wAg3QdmeGy8"
                  frameBorder="0"
                  allowFullScreen
                  allowTransparency
                >
                  Loading...
                </iframe>
              </div>
            </div>
          </div>
        </section>

        {/* INFO & PRIZES SECTION */}
        <section className="section nit-info-section">
          <div className="container">
            <div className="nit-info-grid">
              <div className="nit-info-card">
                <h2 className="nit-info-title">DETALLS DE LA FINAL</h2>
                <p className="nit-info-text">
                  📅 <strong>30 de Maig</strong> a Maria de la Salut. <br />
                  📍 <strong>Poliesportiu Municipal</strong> (Entrada lliure). <br /><br />
                  Les 3 bandes més votades aquí baix seran les finalistes que tocaran en directe. La decisió final dependrà del jurat i del vot presencial.
                </p>
              </div>
              <div className="nit-info-card">
                <h2 className="nit-info-title">PREMIS</h2>
                <ul className="nit-prizes-compact">
                  <li><strong>🥇 1r Premi:</strong> Actuació remunerada Rock'n'Rostoll + Gravació</li>
                  <li><strong>🥈 2n Premi:</strong> Gravació de dos temes</li>
                  <li><strong>🥉 3r Premi:</strong> Gravació d'un tema</li>
                </ul>
                <p className="nit-prizes-note">*Inclou gravació, edició i mescla.</p>
              </div>
            </div>
          </div>
        </section>



        {/* FINAL CTA */}
        <section className="section section-alt nit-cta-section">
          <div className="container">
            <h2 className="nit-cta-title">SEGUEIX EL CONCURS</h2>
            <p className="nit-cta-desc">
              No et perdis cap detall de la III Nit de Rock i la gran final del 30 de maig.
            </p>
            <div className="nit-cta-btns">
              <a href="https://instagram.com/rocknrostoll" target="_blank" rel="noopener noreferrer" className="btn-primary">INSTAGRAM @ROCKNROSTOLL</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
