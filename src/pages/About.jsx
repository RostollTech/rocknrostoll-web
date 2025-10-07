import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
}

export default function About() {
  const heroRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) {
      setIsHeroVisible(true);
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => setIsHeroVisible(true));
    return () => window.cancelAnimationFrame(animationFrame);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) {
      return;
    }

    const handleScroll = () => {
      if (!heroRef.current) {
        return;
      }

      const rect = heroRef.current.getBoundingClientRect();
      const offset = rect.top * 0.25;
      setParallaxOffset(offset);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [prefersReducedMotion]);

  const handleMouseMove = (event) => {
    if (!heroRef.current || prefersReducedMotion || typeof window === "undefined") {
      return;
    }

    if (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const rect = heroRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: offsetY * -4,
      y: offsetX * 4,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const heroItemStyle = (delay = 0) => ({
    opacity: isHeroVisible ? 1 : 0,
    transform: `translate3d(0, ${isHeroVisible ? 0 : 20}px, 0)`,
    transition: prefersReducedMotion
      ? "none"
      : `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
  });

  return (
    <>
      <Navbar />
      <main>
        <section
          className="page-header page-hero"
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            aria-hidden="true"
            className="page-hero__image"
            style={{
              transform: `translate3d(0, ${prefersReducedMotion ? 0 : parallaxOffset}px, 0) scale(1.18)`,
              transition: prefersReducedMotion ? "none" : "transform 0.25s ease-out",
            }}
          />
          <div aria-hidden="true" className="page-hero__overlay" />
          <div
            className="container page-hero__inner"
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: prefersReducedMotion ? "none" : "transform 0.25s ease-out",
              willChange: prefersReducedMotion ? undefined : "transform",
            }}
          >
            <p className="section-eyebrow" style={heroItemStyle(0)}>
              Sobre el festival
            </p>
            <h1 className="page-title" style={heroItemStyle(120)}>
              Rock'n'Rostoll: Història d’un Festival Rural i el Seu Present
            </h1>
            <p className="page-description" style={heroItemStyle(240)}>
              Rock’n’Rostoll és molt més que un festival de música: és una expressió de rebel·lia juvenil i cohesió comunitària nascuda al cor rural de Mallorca. Des de 1995, cada darrer dissabte d’agost, un camp de rostoll a Maria de la Salut es transforma en un escenari vibrant on rock i electrònica s’uneixen sota la lluna d’estiu. Autogestionat pels joves del poble i amb entrada gratuïta, el festival és un símbol de llibertat, tradició i passió col·lectiva, on cada edició reafirma l’esperit d’un poble capaç de fer de la terra segada un espai de música, festa i germanor.
            </p>
          </div>
        </section>

        <section className="page-section section-alt">
          <div className="page-content split-layout">
            <div>
              <h2 className="section-title">
                Orígens: De la Nit de Rock a un Somni Col·lectiu (1994-1995)
              </h2>
              <p className="section-description">
                El germen de Rock'n'Rostoll neix l’estiu de 1994, quan un grup de joves
                de Maria de la Salut —entre ells membres de bandes locals com Sklata
                Sang— decidí plantar cara a l’avorriment organitzant la seva pròpia Nit
                de Rock. Aquella trobada improvisada al mig d’un camp segat fou un acte
                de creativitat i rebel·lia que establí les bases d’una nova tradició.
              </p>
              <p className="section-description">
                L’any següent, 1995, se celebrà la 1a edició oficial de Rock'n'Rostoll,
                consolidant l’esperit valent i autogestionat d’aquells pioners. El nom,
                una fusió perfecta de rock i ambient rural, reflecteix una nit on la
                llibertat, el renou i la diversió sota les estrelles esdevenen
                protagonistes i arrelen en la identitat del poble.
              </p>
            </div>
            <img
              src="/img/about-origens.jpg"
              alt="Fotografia històrica dels primers organitzadors preparant el camp de rostoll"
            />
          </div>
        </section>

        <section className="page-section">
          <div className="page-content split-layout">
            <img
              src="/img/about-safareig.jpg"
              alt="Ambient al Safareig Dance amb la gent ballant dins el safareig il·luminat"
            />
            <div>
              <h2 className="section-title">
                Creixement i Revolució amb el Safareig Dance (1996-2000)
              </h2>
              <p className="section-description">
                Durant la segona meitat dels noranta, el festival va créixer en ambició i
                logística. Cada edició sumava més bandes underground i un públic que no
                parava d’augmentar. L’any 1999 marcà un punt d’inflexió amb la creació del
                Safareig Dance, un antic dipòsit d’aigua reconvertit en pista d’electrònica
                que complementava l’escenari principal de rock.
              </p>
              <p className="section-description">
                La combinació de rock damunt el rostoll i sessions de techno i house dins
                el safareig va revolucionar el festival, atreient jovent de tota l’illa i
                fixant el model de dos escenaris que perdura fins avui. Rock'n'Rostoll es
                convertia així en una cita imprescindible per a la cultura alternativa
                mallorquina.
              </p>
            </div>
          </div>
        </section>

        <section className="page-section section-alt">
          <div className="page-content split-layout">
            <div>
              <h2 className="section-title">Autogestió, Valors i Orgull Comunitari</h2>
              <p className="section-description">
                Des del primer dia, Rock'n'Rostoll és un festival fet pel poble i per al
                poble. Les diferents generacions de mariandos i mariandes s’han anat
                passant el testimoni, mantenint viu el projecte durant gairebé trenta anys.
                L’Associació Juvenil Rock'n'Rostoll, constituïda el 2001, proporciona el
                marc legal per coordinar permisos i assegurances, però l’essència continua
                sent l’autogestió voluntària.
              </p>
              <p className="section-description">
                El compromís amb el talent local també és clau: més de 140 bandes, majoritàriament
                mallorquines, han passat pels escenaris del festival. Tot i ser gratuït, el
                Rostoll remunera els músics i procura cuidar-los amb un bon so, sopar i un
                públic entregat. Així, l’esdeveniment fomenta la cooperació veïnal, el
                respecte pels artistes i la diversitat musical en un entorn segur i familiar.
              </p>
            </div>
            <img
              src="/img/about-voluntariat.jpg"
              alt="Joves voluntaris muntant infraestructures del festival"
            />
          </div>
        </section>

        <section className="page-section">
          <div className="page-content split-layout">
            <img
              src="/img/about-actualitat.jpg"
              alt="Vista recent del festival amb el públic omplint el camp de rostoll"
            />
            <div>
              <h2 className="section-title">El Rock'n'Rostoll Avui: Tradició Viva</h2>
              <p className="section-description">
                Amb 28 edicions celebrades fins al 2024, Rock'n'Rostoll s’ha consolidat
                com un patrimoni emocional de Maria de la Salut. El festival omple de
                música Son Perot, on milers de persones es deixen portar per guitarres,
                bateries i sessions electròniques fins a la sortida del sol. L’ambient
                rural, les bales de palla i la llibertat compartida creen una atmosfera
                gairebé màgica que atrau tant veterans com noves generacions de rostollers.
              </p>
              <p className="section-description">
                Malgrat les pauses forçades per la pandèmia i els reptes mediambientals,
                l’organització ha sabut adaptar-se sense perdre l’ànima. Avui, Rock'n'Rostoll
                continua sent sinònim de cultura alternativa autogestionada, amb novetats a
                cada edició però fidel als seus principis: un poble unit, sense ànim de
                lucre ni patrocinis excessius, celebrant la música i la germanor damunt el
                rostoll.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
