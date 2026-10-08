export const CART_KEY = "shop.cart";
export const MAX_CART_QUANTITY = 10;

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function getCartQuantity(cart, productId) {
  return cart.find((item) => item.id === productId)?.quantity || 0;
}

export function getAvailableStock(product, cart) {
  return Math.max(product.stock - getCartQuantity(cart, product.id), 0);
}
