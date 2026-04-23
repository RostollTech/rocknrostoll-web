import { useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Countdown from "../components/Countdown";
import SEO from "../components/SEO";
import ArtistCard from "../components/ArtistCard";
import { bands } from "../data/bands";
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

  const IS_MAINTENANCE = true;

  if (IS_MAINTENANCE) {
    return (
      <>
        <SEO
          title="Manteniment · III Nit de Rock · Rock’n’Rostoll"
          description="Estem solucionant uns problemes tècnics. Torna aviat!"
          canonicalPath="/nit-de-rock"
        />
        <Navbar />
        <main className="nit-de-rock-page maintenance-page" style={{ 
          minHeight: "80vh", 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",
          padding: "2rem"
        }}>
          <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
            <div className="maintenance-card" style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "4rem 2rem",
              backdropFilter: "blur(10px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}>
              <div className="maintenance-icon" style={{ fontSize: "5rem", marginBottom: "2rem" }}>🛠️</div>
              <h1 className="nit-hero-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1.5rem" }}>
                FALLO TÈCNIC
              </h1>
              <p className="hero-description" style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.9)", marginBottom: "2rem", lineHeight: "1.6" }}>
                Estem tenint uns petits problemes tècnics amb la plataforma. <br />
                <strong>Ja estem treballant per solucionar-ho!</strong>
              </p>
              <div className="maintenance-status" style={{ 
                display: "inline-block",
                padding: "0.5rem 1.5rem",
                background: "rgba(255, 193, 7, 0.1)",
                border: "1px solid #ffc107",
                borderRadius: "50px",
                color: "#ffc107",
                fontWeight: "bold",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Estat: Solucionant-ho
              </div>
              <p style={{ marginTop: "3rem", opacity: 0.6, fontSize: "0.9rem" }}>
                Sentim les molèsties. Segueix-nos a Instagram per estar al dia de quan tornem a estar operatius.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <a href="https://instagram.com/rocknrostoll" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "1rem 2.5rem" }}>
                  INSTAGRAM @ROCKNROSTOLL
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              <p className="nit-association-info" style={{
                fontSize: "0.95rem",
                opacity: 0.7,
                marginTop: "1.5rem",
                maxWidth: "600px",
                marginInline: "auto",
                lineHeight: "1.4"
              }}>
                Esdeveniment 100% gratuït organitzat per l'associació sense ànim de lucre <br />
                <strong>Associació Juvenil Rock'n'Rostoll</strong>
              </p>
              <div className="nit-hero-countdown">
                <Countdown targetDate="2026-05-30T19:00:00" />
              </div>
            </div>
          </div>
        </section>

        {/* BANDS SECTION */}
        <section className="section section-alt nit-bands-section">
          <div className="container">
            <h2 className="section-title">CONEIX LES BANDES SEMIFINALISTES</h2>
            <p className="voting-desc" style={{ textAlign: "center", marginBottom: "30px" }}>
              Aquests són els artistes seleccionats. Descobreix-los abans de votar!
            </p>
            <div className="artists-grid">
              {bands.map(band => (
                <ArtistCard key={band.id} artist={band} />
              ))}
            </div>
          </div>
        </section>

        {/* VOTING SECTION */}
        <section className="section nit-voting-section">
          <div className="container">
            <h2 className="section-title">VOTA A LA SEMIFINAL</h2>
            <p className="voting-desc">
              Tria la banda que vols veure a la final. Tens fins al dia de tancament de l'enquesta per participar!
            </p>

            <div className="voting-container">
                <iframe
                  className="voting-iframe"
                  title="Votació Semifinal"
                  src="https://docs.google.com/forms/d/e/1FAIpQLSerqOapn0DbzIdgVU3ABAVYqz6HTaObUtoWF0afufoCedtJ_w/viewform?embedded=true"
                  width="100%"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                >
                  S'està carregant…
                </iframe>
            </div>
          </div>
        </section>

        {/* PLAYLISTS SECTION */}
        <section className="section section-alt nit-playlists-section">
          <div className="container">
            <h2 className="section-title" style={{ textAlign: "center" }}>LLISTES DE REPRODUCCIÓ</h2>
            <p className="voting-desc" style={{ textAlign: "center", marginBottom: "30px" }}>
              Escolta els temes de les bandes participants i prepara't per a la nit!
            </p>
            <div className="playlists-grid" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", margin: "0 auto", maxWidth: "800px", width: "100%" }}>
              {/* Spotify Playlist */}
              <div className="playlist-embed" style={{ width: "100%" }}>
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/playlist/16gdI3GO3K3AjAGKwImb6A?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy">
                </iframe>
              </div>

              {/* External Links Buttons */}
              <div className="external-links-container" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>

                {/* YouTube Music Button */}
                <a
                  href="https://music.youtube.com/playlist?list=PL3EnH73nT2Siz2q71rRYfj7KaJ_vAsPmc&si=zMXIiF6lWiEwavkf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.8rem",
                    background: "#111",
                    color: "white",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    padding: "1.2rem 2.5rem",
                    borderRadius: "50px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#ff0000";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff0000" width="28px" height="28px">
                    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
                  </svg>
                  YouTube Music
                </a>

                {/* Instagram Button */}
                <a
                  href="https://instagram.com/rocknrostoll"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.8rem",
                    background: "#111",
                    color: "white",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    padding: "1.2rem 2.5rem",
                    borderRadius: "50px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#dc2743";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg role="img" viewBox="0 0 24 24" width="28px" height="28px" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#ig-grad)" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                  </svg>
                  @rocknrostoll
                </a>
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
