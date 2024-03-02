describe("login page test", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("displays email and password fields", () => {
    cy.get('.email-input').should('exist');
    cy.get('.password-input').should('exist');
  });

  it('displays error messages for invalid inputs', () => {
    cy.get('.login-button').click();

    cy.get('.error-message').should('exist');
  });

  it('redirects to home page after successful login', () => {
    cy.get('.email-input').type('example@example.com');
    cy.get('.password-input').type('testtest');
    cy.get('.login-button').click();

    cy.url().should('eq', 'http://localhost:3000/');
  });
});