import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PRODUCTS } from "../data/products";
import { MAX_CART_QUANTITY } from "../utils/cart";

const CART_KEY = "shop.cart";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  });

  const updateCart = (id, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id !== id) return item;
      const newQuantity = item.quantity + change;
      const originalStock = PRODUCTS.find((product) => product.id === item.id)?.stock ?? item.stock ?? 0;
      if (newQuantity < 1 || newQuantity > MAX_CART_QUANTITY || newQuantity > originalStock) return item;
      return { ...item, quantity: newQuantity };
    });
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("shop-cart-updated"));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("shop-cart-updated"));
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) return <main className="shell" data-cy="cart-page"><Navbar /><section className="empty-state" data-cy="empty-cart"><div className="empty-state__icon">Bag</div><h1>Your cart is empty</h1><p>Looks like you have not added anything yet.</p><button className="btn" onClick={() => navigate("/products")} data-cy="continue-shopping">Continue shopping</button></section></main>;

  return <main className="shell" data-cy="cart-page"><Navbar /><section className="cart-page"><div className="cart-header"><button className="back-btn" onClick={() => navigate("/products")} data-cy="back-products">← Products</button><div><p className="eyebrow">Ready when you are</p><h1>Shopping cart</h1><p className="products__header">Review your selected items before checkout.</p></div></div><div className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id} data-cy={`cart-item-${item.id}`}><div className="cart-item__visual" aria-hidden="true"><span className={`product-art product-art--${(item.category || "product").toLowerCase()}`}>{item.name.slice(0, 1)}</span></div><div className="cart-item-info"><span className="badge">{item.category || "Product"}</span><h2>{item.name}</h2><p>₹{item.price.toLocaleString("en-IN")} · {item.stock} available</p></div><div className="cart-quantity"><button onClick={() => updateCart(item.id, -1)} disabled={item.quantity === 1} aria-label={`Decrease ${item.name}`} data-cy={`decrease-${item.id}`}>−</button><span data-cy={`quantity-${item.id}`}>{item.quantity}</span><button onClick={() => updateCart(item.id, 1)} disabled={item.quantity >= 10 || item.quantity >= item.stock} aria-label={`Increase ${item.name}`} data-cy={`increase-${item.id}`}>+</button></div><div className="cart-item-total">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div><button className="remove-btn" onClick={() => removeItem(item.id)} data-cy={`remove-${item.id}`}>Remove item</button></article>)}</div><aside className="cart-summary"><h2>Order summary</h2><div className="summary-row"><span>Items</span><span data-cy="cart-item-count">{itemCount}</span></div><div className="summary-row"><span>Subtotal</span><strong data-cy="cart-subtotal">₹{subtotal.toLocaleString("en-IN")}</strong></div><div className="summary-row"><span>Shipping</span><span>Free</span></div><button className="btn" onClick={() => navigate("/checkout")} data-cy="checkout-button">Proceed to checkout</button></aside></section></main>;
}
