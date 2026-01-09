describe("Books", () => {
  beforeEach(() => {
    // Login before each test
    cy.visit("/login");
    cy.get('input[type="email"]').type("test@uns.ac.rs");
    cy.get('input[type="password"]').type("password123");
    cy.contains("button", "Login").click();
    cy.wait(1000);
  });

  it("should display books list", () => {
    cy.visit("/books");

    // Should show books
    cy.get(".books-grid").should("exist");
    cy.get(".book-card").should("have.length.at.least", 1);
  });

  it("should filter books by category", () => {
    cy.visit("/books");

    // Click Programming category
    cy.contains("button", "Programming").click();

    // Should show programming books
    cy.get(".category-btn.active").should("contain", "Programming");
  });

  it("should search for books", () => {
    cy.visit("/books");

    // Expand search
    cy.get(".search-icon-btn").click();

    // Type search query
    cy.get(".search-input").type("Clean Code");

    // Should show filtered results
    cy.get(".book-card").should("have.length.at.least", 1);
    cy.contains("Clean Code").should("be.visible");
  });

  it("should navigate to book details", () => {
    cy.visit("/books");

    // Click first book
    cy.get(".book-card").first().click();

    // Should be on details page
    cy.url().should("include", "/books/");
    cy.get(".book-detail-title").should("be.visible");
    cy.get(".borrow-book-btn").should("be.visible");
  });
});
