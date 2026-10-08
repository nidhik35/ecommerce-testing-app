import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <main className="shell success-page" data-cy="success-page">
        <Navbar />
        <section className="success-card success-card--fallback">
          <div className="success-icon" aria-hidden="true">!</div>
          <p className="eyebrow">Order details unavailable</p>
          <h1>We could not find that order</h1>
          <p className="success-message">Your order may have already been completed. You can continue shopping from the store.</p>
          <button className="btn" onClick={() => navigate("/products")} data-cy="success-products">Continue shopping</button>
        </section>
      </main>
    );
  }

  return (
    <main className="shell success-page" data-cy="success-page">
      <Navbar />
      <section className="success-card" data-cy="success-card">
        <div className="success-icon" data-cy="success-icon" aria-hidden="true">✓</div>
        <p className="eyebrow">Order confirmed</p>
        <h1>Order placed successfully!</h1>
        <p className="success-message" data-cy="success-message">Thank you for shopping with ShopGuard.</p>
        <div className="success-details">
          <div><span>Order ID</span><strong data-cy="order-id">{order.id}</strong></div>
          <div><span>Order total</span><strong data-cy="order-total">₹{Number(order.total || 0).toLocaleString("en-IN")}</strong></div>
        </div>
        <button className="btn" onClick={() => navigate("/products")} data-cy="success-products">Continue shopping</button>
      </section>
    </main>
  );
}
