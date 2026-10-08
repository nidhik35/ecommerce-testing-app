import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PRODUCTS } from "../data/products";
import {
  getAvailableStock,
  getCartQuantity,
  MAX_CART_QUANTITY,
  readCart,
} from "../utils/cart";

export default function Products() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [cart, setCart] = useState(() => {
    return readCart();
  });

  useEffect(() => {
    localStorage.setItem("shop.cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("shop-cart-updated"));
  }, [cart]);

  function addToCart(product) {
    const currentQuantity = getCartQuantity(cart, product.id);
    const availableStock = getAvailableStock(product, cart);

    if (availableStock === 0 || currentQuantity >= MAX_CART_QUANTITY) {
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= 10) {
          return currentCart;
        }

        const updatedCart = currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return updatedCart;
      }

      const updatedCart = [...currentCart, { ...product, quantity: 1 }];
      return updatedCart;
    });
  }

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort]);

  return (
    <main className="shell" data-cy="products-page">
      <Navbar />

      <section className="products">
        <div className="products__header">
          <div>
            <p className="eyebrow">Curated for everyday life</p>
            <h1>Discover products</h1>
            <p>Thoughtful essentials, tested for the way you shop.</p>
          </div>
        </div>

        <div className="products__controls">
          <label className="search-field"><span aria-hidden="true">⌕</span><input type="text" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} data-cy="search-input" /></label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            data-cy="category-filter"
          >
            <option value="All">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Fashion">Fashion</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            data-cy="price-sort"
          >
            <option value="default">Sort by price</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        <div className="product-grid" data-cy="product-list">
          {filteredProducts.length === 0 ? (
            <p data-cy="no-products">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              (() => {
                const cartQuantity = getCartQuantity(cart, product.id);
                const availableStock = getAvailableStock(product, cart);
                const canAddToCart = availableStock > 0 && cartQuantity < MAX_CART_QUANTITY;

                return <article
                className="product-card"
                key={product.id}
                data-cy={`product-card-${product.id}`}
              >
                <div className="product-card__visual" aria-hidden="true"><span className={`product-art product-art--${product.category.toLowerCase()}`}>{product.name.slice(0, 1)}</span></div>
                <div className="product-card__top">
                  <span className="badge">
                    {product.category}
                  </span>

                  <span className="rating">★ {product.rating}</span>
                </div>

               <h2>
  <button
    className="product-name"
    onClick={() => navigate(`/products/${product.id}`)}
    data-cy={`product-details-${product.id}`}
  >
    {product.name}
  </button>
</h2>

                <p className="product-card__price">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <p
                  className={
                    availableStock === 0
                      ? "stock stock--out"
                      : availableStock <= 5 ? "stock stock--low" : "stock"
                  }
                  data-cy={`stock-${product.id}`}
                >
                  {availableStock === 0
                    ? "Out of stock"
                    : `${availableStock} in stock`}
                </p>

                <button
                  className="btn"
                  disabled={!canAddToCart}
                  onClick={() => addToCart(product)}
                  data-cy={`add-to-cart-${product.id}`}
                >
                  {!canAddToCart ? "Unavailable" : "Add to Cart"}
                </button>
              </article>
              })()
            ))
          )}
        </div>
      </section>
    </main>
  );
}