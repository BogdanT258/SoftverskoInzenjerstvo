describe("Authentication", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("should register a new user", () => {
    cy.visit("/register");

    cy.get('input[type="text"]').first().type("Test User");
    cy.get('input[placeholder*="Index"]').type("RA-123/2024");
    cy.get('input[type="email"]').type(`test${Date.now()}@uns.ac.rs`);
    cy.get('input[type="password"]').type("password123");

    cy.contains("button", "Sign Up").click();

    // Should redirect to home
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.get(".home-page").should("exist");
  });

  it("should login existing user", () => {
    cy.visit("/login");

    cy.get('input[type="email"]').type("test@uns.ac.rs");
    cy.get('input[type="password"]').type("password123");

    cy.contains("button", "Login").click();

    // Should redirect to home
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.get(".home-page").should("exist");
  });

  it("should logout user", () => {
    // Login first
    cy.visit("/login");
    cy.get('input[type="email"]').type("test@uns.ac.rs");
    cy.get('input[type="password"]').type("password123");
    cy.contains("button", "Login").click();

    cy.wait(1000);

    // Logout
    cy.contains("button", "Logout").click();

    // Should redirect to login
    cy.url().should("include", "/login");
  });
});
