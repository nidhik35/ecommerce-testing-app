describe("Products Page", () => {

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

    cy.wait(1000);
  });


  // TC8 - Display products page
  it("should display the products page", () => {
    cy.get('[data-cy="products-page"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC9 - Search product
  it("should search for a product", () => {
    cy.get('[data-cy="search-input"]')
      .type("Laptop")
      .should("have.value", "Laptop");

    cy.get('[data-cy="product-card-1"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC10 - Filter by category
  it("should filter products by category", () => {
    cy.get('[data-cy="category-filter"]')
      .select("Electronics")
      .should("have.value", "Electronics");

    cy.wait(1000);
  });


  // TC11 - Sort by price
  it("should sort products by price", () => {
    cy.get('[data-cy="price-sort"]')
      .select("low-high")
      .should("have.value", "low-high");

    cy.wait(1000);
  });


  // TC12 - Out of stock product
  it("should disable Add to Cart for out-of-stock product", () => {
    cy.get('[data-cy="stock-10"]')
      .should("contain", "Out of stock");

    cy.get('[data-cy="add-to-cart-10"]')
      .should("be.disabled");

    cy.wait(1000);
  });


  // TC13 - Add product to cart
  it("should add a product to cart", () => {
    cy.get('[data-cy="add-to-cart-1"]')
      .click();

    cy.get('[data-cy="cart-button"]')
      .should("contain", "1");

    cy.wait(1000);
  });

});