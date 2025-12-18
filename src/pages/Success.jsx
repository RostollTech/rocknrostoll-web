import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

export default function Success() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <main>
                <PageHero
                    title="Pagament Realitzat!"
                    description="Gràcies per col·laborar amb el Rock'n'Rostoll."
                />
                <section className="page-section section-alt" style={{ textAlign: 'center', minHeight: '40vh' }}>
                    <div className="page-content">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2>Comanda Confirmada</h2>
                        <p>Hem rebut el teu pagament correctament. Rebràs un correu de confirmació aviat.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary"
                            style={{ marginTop: '2rem' }}
                        >
                            Tornar a l'Inici
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
