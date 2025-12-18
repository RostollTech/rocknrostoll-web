import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

export default function Cancel() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <main>
                <PageHero
                    title="Pagament Cancel·lat"
                    description="No s'ha realitzat cap càrrec."
                />
                <section className="page-section section-alt" style={{ textAlign: 'center', minHeight: '40vh' }}>
                    <div className="page-content">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                        <h2>Operació cancel·lada</h2>
                        <p>Has cancel·lat el procés de pagament.</p>
                        <button
                            onClick={() => navigate('/comanda')}
                            className="btn-outline"
                            style={{ marginTop: '2rem' }}
                        >
                            Tornar a intentar-ho
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
