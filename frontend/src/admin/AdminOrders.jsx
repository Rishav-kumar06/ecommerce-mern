import { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus } from "../services/fakeApi";
import { formatPrice, formatDate, getStatusColor, getStatusBg } from "../utils/helpers";
import { ORDER_STATUSES } from "../utils/constants";
import Loader from "../components/Loader";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders().then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = String(o.id).toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <Loader fullPage message="Loading orders..." />;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Order Management</h1>
          <p className="text-muted">View, update, and manage customer orders.</p>
        </div>
        <div className="admin-header-actions">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-input admin-search-input"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="font-bold">{order.id}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{formatDate(order.createdAt)}</div>
                  </td>
                  <td>User #{order.userId}</td>
                  <td>
                    <div className="admin-order-items-preview">
                      <span className="font-bold">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items</span>
                      <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>
                        {order.items[0].name} {order.items.length > 1 ? `+${order.items.length - 1} more` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="font-bold">{formatPrice(order.total)}</td>
                  <td>
                    <span className="admin-badge bg-elevated border text-secondary">
                      {order.paymentMethod.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span
                      className="admin-badge"
                      style={{ backgroundColor: getStatusBg(order.status), color: getStatusColor(order.status) }}
                    >
                      {updating === order.id ? "Updating..." : order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select admin-status-select"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updating === order.id || order.status === "delivered" || order.status === "cancelled"}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: "3rem" }}>No orders found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
