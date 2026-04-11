import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import ProductGrid from "../components/ProductGrid";
import CategoryCard from "../components/CategoryCard";
import Loader from "../components/Loader";
import { formatPrice } from "../utils/helpers";
import "./Home.css";

const HERO_SLIDES = [
  {
    title: "Discover Premium\nElectronics",
    subtitle: "Cutting-edge technology at unbeatable prices. Shop the latest gadgets and devices.",
    gradient: "linear-gradient(135deg, #0f0f1a 0%, #1a1a4e 50%, #0f1a3a 100%)",
    cta: "Shop Electronics",
    category: "electronics",
    badge: "🔥 Up to 40% Off",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  },
  {
    title: "Elevate Your\nStyle Game",
    subtitle: "Fashion-forward pieces curated by style experts. Look your best every single day.",
    gradient: "linear-gradient(135deg, #1a0f2e 0%, #3a1a4e 50%, #1a0f1a 100%)",
    cta: "Shop Fashion",
    category: "fashion",
    badge: "✨ New Arrivals",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  },
  {
    title: "Level Up Your\nFitness",
    subtitle: "Professional-grade sports gear for every athlete. Achieve more, go further.",
    gradient: "linear-gradient(135deg, #0f1a0f 0%, #1a3a1a 50%, #0f2e1a 100%)",
    cta: "Shop Sports",
    category: "sports",
    badge: "💪 New Season",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  },
];

const PROMO_BANNERS = [
  {
    title: "Free Shipping",
    desc: "On all orders over Rs 100",
    icon: "🚚",
    color: "#6366f1",
  },
  {
    title: "Secure Payments",
    desc: "100% secured transactions",
    icon: "🔒",
    color: "#10b981",
  },
  {
    title: "Easy Returns",
    desc: "30-day hassle-free returns",
    icon: "↩️",
    color: "#ec4899",
  },
  {
    title: "24/7 Support",
    desc: "Round the clock assistance",
    icon: "💬",
    color: "#f59e0b",
  },
];

const Home = () => {
  const { featuredProducts, trendingProducts, categories, loading } = useProducts();
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroReady, setHeroReady] = useState(true);

  // Auto-rotate hero
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroReady(false);
      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        setHeroReady(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[heroIndex];

  const handleCategoryFilter = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <main className="home page-wrapper">
      {/* ── Hero ── */}
      <section className="hero" style={{ background: slide.gradient }}>
        <div className="hero__bg-image" style={{ backgroundImage: `url(${slide.image})` }} />
        <div className="hero__overlay" />

        <div className={`container hero__content ${heroReady ? "hero__content--visible" : ""}`}>
          <div className="hero__text">
            <span className="hero__badge">{slide.badge}</span>
            <h1 className="hero__title">{slide.title}</h1>
            <p className="hero__subtitle">{slide.subtitle}</p>
            <div className="hero__actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => handleCategoryFilter(slide.category)}
              >
                {slide.cta} →
              </button>
              <Link to="/products" className="btn btn-ghost btn-lg">
                Browse All
              </Link>
            </div>
          </div>
          <div className="hero__image-wrap">
            <img src={slide.image} alt={slide.title} className="hero__product-image" />
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="hero__indicators">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero__indicator ${i === heroIndex ? "active" : ""}`}
              onClick={() => { setHeroIndex(i); setHeroReady(true); }}
            />
          ))}
        </div>

        <div className="hero__scroll-hint">
          <span>Scroll to explore</span>
          <span className="hero__scroll-arrow">↓</span>
        </div>
      </section>

      {/* ── Promo Banners ── */}
      <section className="promo-strip">
        <div className="container">
          <div className="promo-strip__grid">
            {PROMO_BANNERS.map((b) => (
              <div key={b.title} className="promo-strip__item">
                <div className="promo-strip__icon" style={{ color: b.color, background: `${b.color}18` }}>
                  {b.icon}
                </div>
                <div>
                  <h4 className="promo-strip__title">{b.title}</h4>
                  <p className="promo-strip__desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <div className="section-label">🏷️ Browse by Category</div>
              <h2 className="section-title">Shop by Department</h2>
            </div>
            <Link to="/products" className="btn btn-secondary">View All →</Link>
          </div>
          {loading ? (
            <div className="home__categories-grid">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "160px", borderRadius: "var(--radius-lg)" }} />
              ))}
            </div>
          ) : (
            <div className="home__categories-grid">
              {categories.map((cat) => (
                <CategoryCard key={cat._id || cat.id || cat.originalId || cat.slug} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ background: "var(--bg-secondary)", padding: "5rem 0" }}>
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <div className="section-label">⭐ Handpicked for You</div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Our editors' top picks from across all categories.</p>
            </div>
            <Link to="/products" className="btn btn-secondary">Shop All →</Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} columns={4} />
        </div>
      </section>

      {/* ── Promotional Banner ── */}
      <section className="home__promo-banner">
        <div className="container">
          <div className="home__promo-card">
            <div className="home__promo-card__glow" />
            <div className="home__promo-card__content">
              <div className="section-label">⚡ Limited Time Offer</div>
              <h2 className="home__promo-card__title">Mega Sale — Up to 40% Off</h2>
              <p className="home__promo-card__desc">
                Shop our best deals on electronics, fashion, and more. Limited stock available — grab yours today!
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                <Link to="/products" className="btn btn-primary btn-lg">Shop the Sale →</Link>
                <Link to="/products?category=electronics" className="btn btn-ghost btn-lg">Electronics Deals</Link>
              </div>
            </div>
            <div className="home__promo-card__stats">
              {[
                { number: "20K+", label: "Happy Customers" },
                { number: "500+", label: "Products" },
                { number: "4.8★", label: "Avg. Rating" },
                { number: "99%", label: "Satisfaction" },
              ].map((s) => (
                <div key={s.label} className="home__stat">
                  <span className="home__stat-number">{s.number}</span>
                  <span className="home__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Products ── */}
      <section className="section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <div className="section-label">🔥 What's Hot Right Now</div>
              <h2 className="section-title">Trending Products</h2>
            </div>
            <Link to="/products" className="btn btn-secondary">See All →</Link>
          </div>
          <ProductGrid products={trendingProducts} loading={loading} columns={4} />
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="home__newsletter">
        <div className="container">
          <div className="home__newsletter-card">
            <h2>Stay in the Loop 📬</h2>
            <p>Get exclusive deals, new arrivals, and style tips delivered to your inbox.</p>
            <form className="home__newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing! (mock)"); }}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="form-input home__newsletter-input"
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
