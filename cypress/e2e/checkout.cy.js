describe("Checkout Tests", () => {

  beforeEach(() => {
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

    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.get('[data-cy="checkout-button"]')
      .click();

    cy.url()
      .should("include", "/checkout");

    cy.wait(1000);
  });


  // TC27
  it("should display checkout page and order summary", () => {
    cy.get(".order-summary")
      .should("be.visible")
      .and("contain", "Laptop");

    cy.wait(1000);
  });


  // TC28
  it("should show validation errors for empty checkout fields", () => {
    cy.get('[data-cy="place-order-button"]')
      .click();

    cy.get(".field__error")
      .should("be.visible");

    cy.wait(1000);
  });


  // TC29
  it("should place order successfully with valid details", () => {
    cy.get('[data-cy="checkout-name"]')
      .type("Nidhi");

    cy.get('[data-cy="checkout-address"]')
      .type("123 Main Street");

    cy.get('[data-cy="checkout-city"]')
      .type("Mangalore");

    cy.get('[data-cy="checkout-phone"]')
      .type("9876543210");

    cy.get('[data-cy="checkout-card"]')
      .type("12345678");

    cy.get('[data-cy="place-order-button"]')
      .click();

    cy.get(".field__error")
      .should("not.exist");

    cy.wait(1000);
  });


  // TC30
  it("should apply coupon successfully", () => {
    cy.get('[data-cy="coupon-input"]')
      .type("SAVE10");

    cy.wait(1000);

    cy.get('[data-cy="apply-coupon"]')
      .click();

    cy.wait(1000);

    cy.get('[data-cy="coupon-message"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC31
  it("should navigate back to cart", () => {
    cy.get('[data-cy="back-cart"]')
      .click();

    cy.url()
      .should("include", "/cart");

    cy.wait(1000);
  });

});