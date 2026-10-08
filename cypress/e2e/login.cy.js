describe("Login Page", () => {

  const visitLogin = () => {
    cy.visit("http://localhost:5173/login");
    cy.wait(1000);
  };

  const login = (email, password) => {
    cy.get('[data-cy="email-input"]')
      .type(email);

    cy.get('[data-cy="password-input"]')
      .type(password);

    cy.get('[data-cy="login-button"]')
      .click();

    cy.wait(1000);
  };


  // TC1
  it("should display the Sign In page", () => {
    visitLogin();

    cy.get('[data-cy="login-page"]')
      .should("be.visible");

    cy.get('[data-cy="email-input"]')
      .should("be.visible");

    cy.get('[data-cy="password-input"]')
      .should("be.visible");

    cy.get('[data-cy="login-button"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC2
  it("should login successfully with valid credentials", () => {
    visitLogin();

    login("user@test.com", "Test@123");

    cy.url()
      .should("include", "/products");

    cy.wait(1000);
  });


  // TC3
  it("should show validation errors for empty fields", () => {
    visitLogin();

    cy.get('[data-cy="login-button"]')
      .click();

    cy.get('[data-cy="email-error"]')
      .should("be.visible");

    cy.get('[data-cy="password-error"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC4
  it("should show an error for invalid email", () => {
    visitLogin();

    login("notanemail", "Test@123");

    cy.get('[data-cy="email-error"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC5
  it("should show password validation error", () => {
    visitLogin();

    login("user@test.com", "test");

    cy.get('[data-cy="password-error"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC6
  it("should show an error for wrong password", () => {
    visitLogin();

    login("user@test.com", "Wrong@123");

    cy.get('[data-cy="form-error"]')
      .should("be.visible");

    cy.wait(1000);
  });


  // TC7
  it("should lock the account after 3 failed login attempts", () => {
    visitLogin();

    login("user@test.com", "Wrong@123");

    cy.get('[data-cy="email-input"]')
      .clear()
      .type("user@test.com");

    cy.get('[data-cy="password-input"]')
      .clear()
      .type("Wrong@123");

    cy.get('[data-cy="login-button"]')
      .click();

    cy.wait(1000);

    cy.get('[data-cy="email-input"]')
      .clear()
      .type("user@test.com");

    cy.get('[data-cy="password-input"]')
      .clear()
      .type("Wrong@123");

    cy.get('[data-cy="login-button"]')
      .click();

    cy.wait(1000);

    cy.get('[data-cy="form-error"]')
      .should("be.visible")
      .and("contain", "Too many failed attempts");

    cy.get('[data-cy="login-button"]')
      .should("be.disabled");

    cy.wait(1000);
  });

});