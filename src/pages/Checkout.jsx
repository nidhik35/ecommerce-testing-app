import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CART_KEY = "shop.cart";
const ORDERS_KEY = "shop.orders";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    card: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal - discount;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      const calculatedDiscount = subtotal * 0.1;

      setDiscount(calculatedDiscount);
      setCouponMessage("Coupon applied! You saved 10%.");
    } else {
      setDiscount(0);
      setCouponMessage("Invalid coupon code.");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!/^[0-9]{8}$/.test(form.card)) {
      newErrors.card = "Enter a valid 8-digit card number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = () => {
    if (!validateForm()) {
      return;
    }

    const order = {
      id: `SG-${Date.now()}`,
      items: cart,
      subtotal,
      discount,
      total,
      customer: form,
      date: new Date().toISOString(),
    };

    const existingOrders =
      JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify([...existingOrders, order])
    );

    localStorage.removeItem(CART_KEY);

    navigate("/order-success", {
      state: {
        order,
      },
    });
  };

  return (
    <main className="shell checkout-page" data-cy="checkout-page">
      <Navbar />
      <section className="checkout">
      <div className="checkout-header page-heading">
        <button
          className="btn btn--ghost btn--small"
          onClick={() => navigate("/cart")}
          data-cy="back-cart"
        >
          ← Back to Cart
        </button>

        <h1>Checkout</h1>

        <p>Complete your order securely.</p>
      </div>

      <div className="checkout__layout">

        {/* CUSTOMER INFORMATION */}

        <form className="form-panel checkout-form" onSubmit={(event) => { event.preventDefault(); placeOrder(); }}>
          <p className="eyebrow">Your details</p>
          <h2>Customer information</h2>

          <div className="field">
            <label className="field__label" htmlFor="checkout-name">Full name</label>

            <input
              id="checkout-name"
              type="text"
              name="name"
              className={`field__input ${errors.name ? "field__input--bad" : ""}`}
              value={form.name}
              onChange={handleChange}
              data-cy="checkout-name"
            />

            {errors.name && (
              <p className="field__error" data-cy="name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="checkout-address">Address</label>

            <textarea
              id="checkout-address"
              name="address"
              className={`field__input field__textarea ${errors.address ? "field__input--bad" : ""}`}
              value={form.address}
              onChange={handleChange}
              data-cy="checkout-address"
            />

            {errors.address && (
              <p className="field__error" data-cy="address-error">
                {errors.address}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="checkout-city">City</label>

            <input
              id="checkout-city"
              type="text"
              name="city"
              className={`field__input ${errors.city ? "field__input--bad" : ""}`}
              value={form.city}
              onChange={handleChange}
              data-cy="checkout-city"
            />

            {errors.city && (
              <p className="field__error" data-cy="city-error">
                {errors.city}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="checkout-phone">Phone number</label>

            <input
              id="checkout-phone"
              type="text"
              name="phone"
              className={`field__input ${errors.phone ? "field__input--bad" : ""}`}
              value={form.phone}
              onChange={handleChange}
              maxLength="10"
              data-cy="checkout-phone"
            />

            {errors.phone && (
              <p className="field__error" data-cy="phone-error">
                {errors.phone}
              </p>
            )}
          </div>

          <h2 className="checkout-section-heading">Payment</h2>

          <div className="field">
            <label className="field__label" htmlFor="checkout-card">Card number</label>

            <input
              id="checkout-card"
              type="text"
              name="card"
              className={`field__input ${errors.card ? "field__input--bad" : ""}`}
              value={form.card}
              onChange={handleChange}
              maxLength="8"
              placeholder="8-digit card number"
              data-cy="checkout-card"
            />

            {errors.card && (
              <p className="field__error" data-cy="card-error">
                {errors.card}
              </p>
            )}
          </div>
          <p className="checkout-helper">Use an 8-digit test card number. No payment is processed.</p>
         <button
  className="btn"
  type="submit"
  data-cy="place-order-button"
>
  Place order
</button>
        </form>

        {/* ORDER SUMMARY */}

        <aside className="summary-card order-summary">
          <p className="eyebrow">Your purchase</p>
          <h2>Order summary</h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
              data-cy={`checkout-item-${item.id}`}
            >
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>

              <strong>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>

            <span data-cy="checkout-subtotal">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="coupon">
            <label className="field__label" htmlFor="coupon-input">Coupon code</label>

            <div className="coupon__row">
              <input
                id="coupon-input"
                className="field__input"
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon"
                data-cy="coupon-input"
              />

              <button
                className="btn btn--small coupon__apply"
                type="button"
                onClick={applyCoupon}
                data-cy="apply-coupon"
              >
                Apply
              </button>
            </div>

            {couponMessage && (
              <p
                className={
                  discount > 0
                    ? "coupon-success"
                    : "field__error"
                }
                data-cy="coupon-message"
              >
                {couponMessage}
              </p>
            )}
          </div>

          <div className="summary-row">
            <span>Discount</span>

            <span data-cy="checkout-discount">
              -₹{discount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="summary-total">
            <span>Total</span>

            <strong data-cy="checkout-total">
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

        </aside>
      </div>
      </section>
    </main>
  );
}
