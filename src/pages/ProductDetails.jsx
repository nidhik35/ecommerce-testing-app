import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import Navbar from "../components/Navbar";
import {
  getAvailableStock,
  getCartQuantity,
  MAX_CART_QUANTITY,
  readCart,
} from "../utils/cart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(() => readCart());

  useEffect(() => {
    function refreshCart() {
      setCart(readCart());
    }

    window.addEventListener("shop-cart-updated", refreshCart);
    return () => window.removeEventListener("shop-cart-updated", refreshCart);
  }, []);

  if (!product) {
    return (
      <main className="shell">
        <section className="placeholder">
          <h1>Product not found</h1>

          <button
            className="btn"
            onClick={() => navigate("/products")}
            data-cy="back-to-products"
          >
            Back to Products
          </button>
        </section>
      </main>
    );
  }

  const cartQuantity = getCartQuantity(cart, product.id);
  const availableStock = getAvailableStock(product, cart);
  const remainingCapacity = Math.min(
    availableStock,
    MAX_CART_QUANTITY - cartQuantity
  );

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(current + 1, remainingCapacity)
    );
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(current - 1, 1));
  }

  function addToCart() {
    if (remainingCapacity === 0) {
      return;
    }

    const existingCart = readCart();

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      const newQuantity = Math.min(
        existingProduct.quantity + quantity,
        MAX_CART_QUANTITY,
        product.stock
      );

      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity,
        },
      ];
    }

    localStorage.setItem(
      "shop.cart",
      JSON.stringify(updatedCart)
    );
    window.dispatchEvent(new Event("shop-cart-updated"));

    navigate("/products");
  }

  return (
    <main className="shell" data-cy="product-details-page">
      <Navbar />

      <section className="product-details">
        <button
          className="back-link"
          onClick={() => navigate("/products")}
          data-cy="back-link"
        >
          ← Back to Products
        </button>

        <div className="product-details__card">
          <div className="product-details__visual" aria-hidden="true"><span className={`product-art product-art--${product.category.toLowerCase()}`}>{product.name.slice(0, 1)}</span></div>
          <div className="product-details__info">
            <span className="badge">
              {product.category}
            </span>

            <h1 data-cy="product-name">
              {product.name}
            </h1>

            <p
              className="product-details__rating"
              data-cy="product-rating"
            >
              ⭐ {product.rating}
            </p>

            <p
              className="product-details__price"
              data-cy="product-price"
            >
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p
              className={
                availableStock === 0
                  ? "stock stock--out"
                  : "stock"
              }
              data-cy="product-stock"
            >
              {availableStock === 0
                ? "Out of stock"
                : `${availableStock} items available`}
            </p>

            {remainingCapacity > 0 && (
              <div className="quantity-section">
                <label>Quantity</label>

                <div className="quantity-controls">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    data-cy="decrease-quantity"
                  >
                    −
                  </button>

                  <span data-cy="quantity">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= remainingCapacity
                    }
                    data-cy="increase-quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              className="btn"
              disabled={remainingCapacity === 0}
              onClick={addToCart}
              data-cy="add-to-cart"
            >
              {remainingCapacity === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}