import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helpers";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => { e.target.src = "https://placehold.co/400x300/1a1a2e/6366f1?text=No+Image"; }}
        />
        {product.discount > 0 && (
          <span className="product-card__badge">-{product.discount}%</span>
        )}
        <div className="product-card__overlay">
          <button
            className={`product-card__cart-btn ${inCart ? "in-cart" : ""}`}
            onClick={handleAddToCart}
          >
            {inCart ? "✓ In Cart" : "Add to Cart"}
          </button>
        </div>
        {product.isTrending && (
          <span className="product-card__trending">🔥 Trending</span>
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__rating">
          <span className="product-card__stars">{stars}</span>
          <span className="product-card__rating-count">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="product-card__price-row">
          <div>
            <span className="product-card__price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="product-card__original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <span className={`product-card__stock ${product.stock < 10 ? "low" : ""}`}>
            {product.stock < 10 ? `Only ${product.stock} left!` : "In Stock"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
