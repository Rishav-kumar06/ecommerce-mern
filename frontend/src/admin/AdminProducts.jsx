import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../utils/helpers";
import Loader from "../components/Loader";

const AdminProducts = () => {
  const { allProducts, deleteProduct, addProduct, updateProduct, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    category: "electronics",
    price: "",
    stock: "",
    brand: "",
    description: "",
  });

  if (loading) return <Loader fullPage message="Loading products..." />;

  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        brand: product.brand,
        description: product.description,
      });
    } else {
      setEditing(null);
      setForm({ name: "", category: "electronics", price: "", stock: "", brand: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      images: editing ? editing.images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    };

    if (editing) {
      updateProduct({ ...editing, ...payload });
    } else {
      addProduct({ id: Date.now(), ...payload });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Products Management</h1>
          <p className="text-muted">Manage your catalog, inventory, and pricing.</p>
        </div>
        <div className="admin-header-actions">
          <input
            type="text"
            className="form-input admin-search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Product
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={product.images[0]} alt={product.name} />
                      <div>
                        <div className="admin-product-cell__name">{product.name}</div>
                        <div className="admin-product-cell__brand">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{product.category}</td>
                  <td className="font-bold">{formatPrice(product.price)}</td>
                  <td>
                    <span className={product.stock < 10 ? "text-danger font-bold" : ""}>
                      {product.stock} units
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${product.stock > 0 ? "bg-success text-success-dark" : "bg-danger text-danger-dark"}`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn-icon" onClick={() => handleOpenModal(product)} title="Edit">✏️</button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(product.id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: "3rem" }}>No products found matching "{search}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2>{editing ? "Edit Product" : "Add New Product"}</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-modal__body">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input required className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty</option>
                    <option value="home">Home</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input required type="number" min="0" step="0.01" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input required type="number" min="0" className="form-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="3" className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? "Save Changes" : "Create Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
