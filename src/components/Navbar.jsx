import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../utils/storage";

export default function Navbar() {
  const navigate = useNavigate();
  const session = getSession();
  const [cartCount] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("shop.cart")) || [];
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch {
      return 0;
    }
  });

  const [visibleCartCount, setVisibleCartCount] = useState(cartCount);

  useEffect(() => {
    function refreshCartCount() {
      try {
        const cart = JSON.parse(localStorage.getItem("shop.cart")) || [];
        setVisibleCartCount(cart.reduce((total, item) => total + item.quantity, 0));
      } catch {
        setVisibleCartCount(0);
      }
    }
    window.addEventListener("shop-cart-updated", refreshCartCount);
    return () => window.removeEventListener("shop-cart-updated", refreshCartCount);
  }, []);

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <NavLink className="brand" to="/products" aria-label="ShopGuard home">
        <span className="brand__mark" aria-hidden="true">+</span>
        <span>ShopGuard</span>
      </NavLink>
      <nav className="topbar__nav" aria-label="Main navigation">
        <NavLink className="topbar__link" to="/products">Products</NavLink>
      </nav>
      <div className="topbar__right">
        <span className="topbar__user" data-cy="user-name">{session?.name}</span>
        <button className="cart-link" onClick={() => navigate("/cart")} data-cy="cart-button">
          <span aria-hidden="true">Bag</span>
          <span>Cart</span>
          <span className="cart-link__count">{visibleCartCount}</span>
        </button>
        <button className="btn btn--ghost btn--small" onClick={handleLogout} data-cy="logout-button">Sign out</button>
      </div>
    </header>
  );
}
