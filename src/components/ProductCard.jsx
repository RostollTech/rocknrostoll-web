import { IS_SHOP_OPEN } from "../utils/shopConfig";

const LOW_STOCK_THRESHOLD = 5;

export default function ProductCard({ name, price, image, url, remaining }) {
  const soldOut = IS_SHOP_OPEN && remaining === 0;
  const lowStock = IS_SHOP_OPEN && remaining !== null && remaining > 0 && remaining < LOW_STOCK_THRESHOLD;

  return (
    <article className="merch-card">
      <div className="sold-out-container">
        <img src={image} alt={name} loading="lazy" />
        {(!IS_SHOP_OPEN || soldOut) && (
          <div className="sold-out-overlay">
            <span className="sold-out-text">{soldOut ? "Exhaurit" : "No disponible"}</span>
          </div>
        )}
      </div>
      <div className="merch-content">
        <h3>{name}</h3>
        <p className="merch-price">{price}</p>
        {IS_SHOP_OPEN && remaining !== null && !soldOut && (
          <p className={lowStock ? "stock-note stock-note--low" : "stock-note"}>
            {lowStock ? `Últimes ${remaining} unitats!` : `${remaining} unitats disponibles`}
          </p>
        )}
        <div className="merch-actions">
          <a href={url} className="btn-outline" target="_blank" rel="noopener noreferrer">
            {IS_SHOP_OPEN ? "Fer Comanda" : "Més info"}
          </a>
        </div>
      </div>
    </article>
  );
}
