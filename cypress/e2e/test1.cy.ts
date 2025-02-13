describe('template spec', () => {
  it('check login form', () => {
    cy.visit('/');

    cy.get('#login-text')
      .should('exist');

    cy.get('#loginEmail')
      .should('exist')
      .type('example@email.com')

    cy.get('#loginPass')
      .should('exist')
      .type('123123')

    cy.get('#forgotPass')
      .should('exist')
      .should('have.text', 'Forgot Password?')

    cy.get('#loginBtn')
      .should('exist')
      .should('have.text', 'Login')

    cy.get('#createAcc')
      .should('exist')
      .should('include.text', 'Create Account')
  });

  
});
