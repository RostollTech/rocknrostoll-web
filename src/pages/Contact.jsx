import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialLinks from "../components/SocialLinks";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        <section className="page-header page-hero contact-hero">
          <div aria-hidden="true" className="page-hero__image" />
          <div aria-hidden="true" className="page-hero__overlay" />
          <div className="container page-hero__inner">
            <p className="section-eyebrow">Contacte</p>
            <h1 className="page-title">Contacta amb Rock’n’Rostoll</h1>
            <p className="page-description">
              Som un festival autogestionat per joves de Maria de la Salut. Si vols col·laborar, participar o simplement saludar, ens trobaràs a baix. Sempre és benvinguda una mà més!
            </p>
          </div>
        </section>

        <section className="page-section section-alt">
          <div className="page-content contact-grid">
            <article className="contact-card">
              <h3>Consultes generals</h3>
              <p>Si tens dubtes o vols informació sobre el festival, escriu-nos.</p>
              <p>rocknrostoll@gmail.com</p>
            </article>
            <article className="contact-card">
              <h3>Col·laboracions i premsa</h3>
              <p>
                Som oberts a col·laboracions amb artistes, entitats i mitjans que comparteixin la nostra filosofia: música,
                joventut i cultura local.
              </p>
            </article>
            <article className="contact-card">
              <h3>Grups i DJ interessats a tocar</h3>
              <p>
                Si tens un grup o ets DJ i t’agradaria actuar al Rock’n’Rostoll, envia’ns informació sobre el teu projecte musical.
              </p>
            </article>
          </div>
        </section>

        <section className="page-section">
          <div className="page-content split-layout">
            <div>
              <div className="section-header section-header--left">
                <p className="section-eyebrow">Segueix-nos</p>
                <h2 className="section-title">Segueix Rock’n’Rostoll</h2>
                <p className="section-description">
                  Troba’ns a les nostres xarxes o escriu-nos directament per col·laborar o resoldre qualsevol dubte.
                </p>
              </div>
              <div className="contact-social-wrapper">
                <SocialLinks />
                <div className="qr-grid">
                  <div className="qr-card">
                    <img
                      src="/qr/qr_instagram.png"
                      alt="Codi QR d'Instagram de Rock’n’Rostoll"
                      className="qr-image"
                    />
                    <p>Escaneja per seguir-nos a Instagram</p>
                  </div>
                  <div className="qr-card">
                    <img
                      src="/qr/qr_facebook.png"
                      alt="Codi QR de Facebook de Rock’n’Rostoll"
                      className="qr-image"
                    />
                    <p>Escaneja per seguir-nos a Facebook</p>
                  </div>
                  
                </div>
                <div className="map-frame">
                    <img src="/img/contact-map.jpg" alt="Vista del camp de rostoll on se celebra el festival" />
                  </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section section-alt">
          <div className="page-content">
            <div className="map-frame">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1459.9425136729283!2d3.0653078102838998!3d39.68329810760899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297cb42046d8b09%3A0x194899cbb6f7f09d!2sRock&#39;n&#39;Rostoll!5e1!3m2!1sca!2ses!4v1759844635351!5m2!1sca!2ses"  
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa del Rock’n’Rostoll a Maria de la Salut"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
