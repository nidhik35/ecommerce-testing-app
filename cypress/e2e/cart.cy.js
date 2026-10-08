describe("Cart Tests", () => {

  const login = () => {
    cy.visit("http://localhost:5173/login");

    cy.get('[data-cy="email-input"]')
      .type("user@test.com");

    cy.get('[data-cy="password-input"]')
      .type("Test@123");

    cy.get('[data-cy="login-button"]')
      .click();

    cy.url()
      .should("include", "/products");

    cy.clearLocalStorage("shop.cart");

    cy.reload();

    cy.wait(1000);
  };


  // TC20 - Empty cart
  it("should display empty cart message", () => {
    login();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.get('[data-cy="empty-cart"]')
      .should("be.visible")
      .and("contain", "Your cart is empty");

    cy.wait(1000);
  });


  // TC21 - Cart subtotal
  it("should calculate cart subtotal correctly", () => {
    login();

    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.get('[data-cy="cart-subtotal"]')
      .should("contain", "₹55,000");

    cy.wait(1000);
  });


  // TC22 - Increase quantity
  it("should increase product quantity in cart", () => {
    login();

    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.get('[data-cy="increase-1"]')
      .click();

    cy.get('[data-cy="quantity-1"]')
      .should("contain", "2");

    cy.wait(1000);
  });


  // TC23 - Decrease quantity
  it("should decrease product quantity in cart", () => {
    login();

    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.get('[data-cy="increase-1"]')
      .click();

    cy.get('[data-cy="decrease-1"]')
      .click();

    cy.get('[data-cy="quantity-1"]')
      .should("contain", "1");

    cy.wait(1000);
  });


  // TC24 - Remove product
  it("should remove a product from cart", () => {
    login();

    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.get('[data-cy="remove-1"]')
      .click();

    cy.get('[data-cy="empty-cart"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC25 - Stock limit
  it("should not allow product quantity above available stock", () => {
    login();

    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    for (let i = 1; i <= 7; i++) {
      cy.get('[data-cy="increase-1"]')
        .click();

      cy.wait(1000);
    }

    cy.get('[data-cy="quantity-1"]')
      .should("contain", "8");

    cy.get('[data-cy="increase-1"]')
      .should("be.disabled");

    cy.wait(1000);
  });


  // TC26 - Checkout from cart
  it("should proceed to checkout from cart", () => {
    login();

    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.get('[data-cy="checkout-button"]')
      .should("be.visible")
      .click();

    cy.url()
      .should("include", "/checkout");

    cy.wait(1000);
  });

});