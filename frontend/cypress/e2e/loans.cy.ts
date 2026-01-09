describe("Loans", () => {
  beforeEach(() => {
    // Login before each test
    cy.visit("/login");
    cy.get('input[type="email"]').type("test@uns.ac.rs");
    cy.get('input[type="password"]').type("password123");
    cy.contains("button", "Login").click();
    cy.wait(1000);
  });

  it("should borrow a book", () => {
    cy.visit("/books");

    // Click first available book
    cy.get(".book-card").first().click();

    // Click borrow button
    cy.get(".borrow-book-btn").click();

    // Should show success alert
    cy.on("window:alert", (text) => {
      expect(text).to.contains("successfully");
    });

    cy.wait(500);

    // Should redirect to my loans
    cy.url().should("include", "/my-loans");
  });

  it("should display borrowed books", () => {
    cy.visit("/my-loans");

    // Should show active tab
    cy.contains("button", "Active").should("have.class", "active");

    // Should show loan cards (if any loans exist)
    cy.get(".loan-card").should("exist");
  });

  it("should return a book", () => {
    cy.visit("/my-loans");

    // Click return button on first loan
    cy.get(".return-btn").first().click();

    // Confirm dialog
    cy.on("window:confirm", () => true);

    // Should show success alert
    cy.on("window:alert", (text) => {
      expect(text).to.contains("successfully");
    });

    cy.wait(500);
  });

  it("should view loan history", () => {
    cy.visit("/my-loans");

    // Click History tab
    cy.contains("button", "History").click();

    // Should show history tab as active
    cy.contains("button", "History").should("have.class", "active");
  });
});
