import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import productsData from "../data/products.json";
import { Link } from "react-router-dom";

export default function Comanda() {
    // State for form user fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        comments: ""
    });

    // State for cart/quantities. 
    // We initialize based on productsData, excluding "Donatiu" which is special case, 
    // but let's handle "Donatiu" specially in the UI.
    const [cart, setCart] = useState({});
    const [donationAmount, setDonationAmount] = useState(0);

    // Initialize cart state
    useEffect(() => {
        const initialCart = {};
        productsData.forEach(p => {
            if (p.name !== "Donatiu") {
                initialCart[p.name] = { quantity: 0, size: "M" }; // Default size M for everything, mainly for Hoodies
            }
        });
        setCart(initialCart);
    }, []);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuantityChange = (productName, delta) => {
        setCart(prev => {
            const current = prev[productName]?.quantity || 0;
            const newQuantity = Math.max(0, current + delta);
            return {
                ...prev,
                [productName]: { ...prev[productName], quantity: newQuantity }
            };
        });
    };

    const handleSizeChange = (productName, newSize) => {
        setCart(prev => ({
            ...prev,
            [productName]: { ...prev[productName], size: newSize }
        }));
    };

    const cleanPrice = (priceStr) => {
        if (!priceStr) return 0;
        // Remove ' €' and parse
        const num = parseFloat(priceStr.replace(' €', '').replace(',', '.'));
        return isNaN(num) ? 0 : num;
    };

    const calculateTotal = () => {
        let total = 0;

        // Sum products
        productsData.forEach(p => {
            if (p.name !== "Donatiu") {
                const qty = cart[p.name]?.quantity || 0;
                const price = cleanPrice(p.price);
                total += qty * price;
            }
        });

        // Add donation
        total += parseFloat(donationAmount) || 0;

        return total.toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email) {
            alert("Si us plau, omple tots els camps obligatoris (Nom i Email) per continuar.");
            return;
        }

        const total = calculateTotal();
        if (parseFloat(total) <= 0) {
            alert("La cistella és buida. Afegeix algun producte o un donatiu per continuar.");
            return;
        }

        // Prepare data for backend
        const items = [];
        Object.entries(cart).forEach(([name, item]) => {
            if (item.quantity > 0) {
                // Find original price from productsData
                const product = productsData.find(p => p.name === name);
                const priceNum = cleanPrice(product.price);

                items.push({
                    name: name,
                    quantity: item.quantity,
                    price: priceNum,
                    size: item.size
                });
            }
        });

        try {
            const btn = document.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.innerText = "Processant..."; }

            // Call Vercel Function
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items,
                    donation: donationAmount,
                    customerEmail: formData.email
                })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Error backend:", data);
                alert("Error al servidor: " + (data.error || "Desconegut"));
                if (btn) { btn.disabled = false; btn.innerText = "Reintentar"; }
            }

        } catch (error) {
            console.error("Error fetch:", error);

            // SIMULATION FALLBACK FOR LOCALHOST
            if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
                const wantsToSimulate = window.confirm(
                    "El servidor backend no està accessible (normal amb 'npm run dev').\n\nVols SIMULAR un pagament correcte ara?"
                );
                if (wantsToSimulate) {
                    window.location.href = "/success";
                    return;
                }
            }

            alert("Error de connexió. Si estàs en local, assegura't que uses 'vercel dev'.");
            const btn = document.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = false; btn.innerText = "Pagar amb Targeta"; }
        }
    };

    return (
        <>
            <SEO
                title="Fes la teva Comanda · Rock’n’Rostoll"
                description="Compra les nostres dessuadores, gorres i bosses oficials o fes un donatiu."
                keywords={["botiga", "comanda", "dessuadora", "gorra", "pagament"]}
                canonicalPath="/comanda"
            />
            <Navbar />
            <main>
                <PageHero
                    className="shop-hero"
                    eyebrow="Botiga Oficial"
                    title="Finalitzar Comanda"
                    description="Afegeix els productes que desitgis i fes el pagament de forma segura."
                />

                <section className="page-section section-alt">
                    <div className="page-content comanda-layout">

                        {/* LEFT COLUMN: ORDER FORM */}
                        <div className="comanda-form-container">
                            <form id="comanda-form" onSubmit={handleSubmit} className="order-form">

                                {/* 1. SELECCIÓ DE PRODUCTES */}
                                <div className="form-section">
                                    <h3 className="form-title">1. Selecciona els Productes</h3>
                                    <div className="products-list">
                                        {productsData.map((product, index) => {
                                            if (product.name === "Donatiu") return null;

                                            const qty = cart[product.name]?.quantity || 0;
                                            const isHoodie = product.name.toLowerCase().includes('dessuadora');

                                            return (
                                                <div key={index} className="order-item">
                                                    <img src={product.image} alt={product.name} className="order-item-img" />
                                                    <div className="order-item-details">
                                                        <div className="order-item-header">
                                                            <h4 className="order-item-title">{product.name}</h4>
                                                            <span className="order-item-price">{product.price}</span>
                                                        </div>

                                                        <div className="order-controls">
                                                            <div className="qty-selector">
                                                                <button type="button" onClick={() => handleQuantityChange(product.name, -1)} disabled={qty <= 0}>-</button>
                                                                <span>{qty}</span>
                                                                <button type="button" onClick={() => handleQuantityChange(product.name, 1)}>+</button>
                                                            </div>

                                                            {isHoodie && qty > 0 && (
                                                                <select
                                                                    className="size-selector"
                                                                    value={cart[product.name]?.size}
                                                                    onChange={(e) => handleSizeChange(product.name, e.target.value)}
                                                                >
                                                                    <option value="S">Talla S</option>
                                                                    <option value="M">Talla M</option>
                                                                    <option value="L">Talla L</option>
                                                                    <option value="XL">Talla XL</option>
                                                                    <option value="XXL">Talla XXL</option>
                                                                </select>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Donatiu Section */}
                                        <div className="order-item donation-item">
                                            <div className="order-item-details" style={{ width: '100%' }}>
                                                <h4 className="order-item-title">Vols fer un Donatiu extra?</h4>
                                                <p className="description-text">Ajuda'ns a seguir fent renou.</p>
                                                <div className="donation-input-group">
                                                    <span className="currency-symbol">€</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={donationAmount}
                                                        onChange={(e) => setDonationAmount(e.target.value)}
                                                        className="form-input donation-input"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. DADES DEL CLIENT */}
                                <div className="form-section">
                                    <h3 className="form-title">2. Les teves Dades</h3>
                                    <div className="fields-grid">
                                        <div className="form-group">
                                            <label htmlFor="name">Nom i Cognoms *</label>
                                            <input
                                                type="text" id="name" name="name"
                                                required
                                                value={formData.name} onChange={handleUserChange}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email *</label>
                                            <input
                                                type="email" id="email" name="email"
                                                required
                                                value={formData.email} onChange={handleUserChange}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Telèfon (opcional)</label>
                                            <input
                                                type="tel" id="phone" name="phone"
                                                value={formData.phone} onChange={handleUserChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '1rem' }}>
                                        <label htmlFor="comments">Comentaris o Observacions</label>
                                        <textarea
                                            id="comments" name="comments"
                                            rows="3"
                                            value={formData.comments} onChange={handleUserChange}
                                            className="form-input"
                                            placeholder="Alguna cosa que haguem de saber?"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON MOBILE */}
                                <div className="mobile-submit-btn">
                                    <button type="submit" className="btn-primary full-width">
                                        Pagar {calculateTotal()}€ Ara
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* RIGHT COLUMN: SUMMARY (Desktop Sticky) */}
                        <div className="comanda-summary-sidebar">
                            <div className="summary-card">
                                <h3>Resum de la Comanda</h3>
                                <ul className="summary-list">
                                    {productsData.map((p) => {
                                        if (p.name === "Donatiu") return null;
                                        const qty = cart[p.name]?.quantity || 0;
                                        if (qty === 0) return null;
                                        const price = cleanPrice(p.price);
                                        const totalItem = (qty * price).toFixed(2);
                                        const isHoodie = p.name.toLowerCase().includes('dessuadora');
                                        const size = cart[p.name]?.size;

                                        return (
                                            <li key={p.name} className="summary-item">
                                                <div className="summary-item-top">
                                                    <span>{qty} x {p.name}</span>
                                                    <span>{totalItem}€</span>
                                                </div>
                                                {isHoodie && <div className="summary-item-meta">Talla: {size}</div>}
                                            </li>
                                        );
                                    })}
                                    {parseFloat(donationAmount) > 0 && (
                                        <li className="summary-item">
                                            <span>Donatiu</span>
                                            <span>{parseFloat(donationAmount).toFixed(2)}€</span>
                                        </li>
                                    )}
                                </ul>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>{calculateTotal()}€</span>
                                </div>
                                <div className="desktop-submit-btn">
                                    <button type="submit" form="comanda-form" className="btn-primary full-width">
                                        Pagar amb Targeta
                                    </button>
                                </div>
                                <p className="secure-note">
                                    <span className="lock-icon">🔒</span> Pagament 100% segur processat per Stripe.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />

            <style>{`
        .comanda-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .comanda-layout {
            grid-template-columns: 2fr 1fr;
            align-items: start;
          }
        }

        .form-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
          color: #1a1a1a; /* Force dark text on white background */
        }

        .form-title {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--color-primary);
          padding-bottom: 0.5rem;
          color: #1a1a1a;
        }

        /* ORDER ITEMS */
        .order-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
          color: #1a1a1a;
        }
        .order-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .order-item-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          background: #f0f0f0;
        }
        .order-item-details {
          flex: 1;
        }
        .order-item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.5rem;
        }
        .order-item-title {
          font-weight: 600;
          font-size: 1rem;
          color: #1a1a1a;
          margin: 0;
        }
        .order-item-price {
          font-weight: 700;
          color: var(--color-primary);
        }
        
        .order-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .qty-selector {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
        }
        .qty-selector button {
          background: #f9f9f9;
          border: none;
          padding: 0.3rem 0.8rem;
          cursor: pointer;
          font-weight: bold;
          color: #1a1a1a;
        }
        .qty-selector button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: #999;
        }
        .qty-selector span {
          padding: 0 0.8rem;
          font-weight: 600;
          min-width: 30px;
          text-align: center;
          color: #1a1a1a;
        }
        .size-selector {
          padding: 0.3rem;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: white;
          font-size: 0.9rem;
          color: #1a1a1a;
        }

        /* DONATION */
        .donation-item {
          background: #fdfdfd; 
          padding: 1rem; 
          border-radius: 8px; 
          border: 2px dashed #e0e0e0;
          color: #1a1a1a;
        }
        .donation-input-group {
          display: flex;
          align-items: center;
          max-width: 150px;
          margin-top: 0.5rem;
        }
        .currency-symbol {
          font-size: 1.2rem;
          font-weight: bold;
          margin-right: 0.5rem;
          color: #666;
        }
        .donation-input {
          font-weight: bold;
          font-size: 1.1rem;
          color: #1a1a1a;
          background: white;
        }

        /* FIELDS GRID */
        .fields-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .fields-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #444;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
          color: #1a1a1a;
          background: white;
        }
        .form-input:focus {
          border-color: var(--color-primary);
          outline: none;
        }

        /* SIDEBAR SUMMARY */
        .comanda-summary-sidebar {
          position: sticky;
          top: 100px;
        }
        .summary-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: #1a1a1a;
        }
        .summary-card h3 {
          margin-top: 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
          font-size: 1.1rem;
        }
        .summary-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }
        .summary-item {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
          border-bottom: 1px dashed #eee;
          font-size: 0.95rem;
        }
        .summary-item-top {
          display: flex;
          justify-content: space-between;
        }
        .summary-item-meta {
          font-size: 0.8rem;
          color: #777;
          margin-top: 0.2rem;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.3rem;
          font-weight: 800;
          margin: 1.5rem 0;
          color: var(--color-primary);
        }
        .secure-note {
          font-size: 0.8rem;
          text-align: center;
          margin-top: 1rem;
          color: #666;
        }
        .full-width {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
        }

        .mobile-submit-btn {
          display: block;
          margin-top: 2rem;
        }
        .desktop-submit-btn {
          display: none;
        }

        @media (min-width: 900px) {
          .mobile-submit-btn {
            display: none;
          }
          .desktop-submit-btn {
            display: block;
          }
        }
      `}</style>
        </>
    );
}
