describe('template spec', () => {
  beforeEach(() => {
    cy.visit('/auth')
  })

  it('Check is login form loaded and fields working', () => {
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


  it("Shouldn't login with empty fields", () => {
    cy.get('#loginBtn').click()

    cy.get('#email-error')
      .should('be.visible')

    cy.get('#pass-error')
      .should('be.visible')
  })


  it("Shouldn't login with empty Email", () => {
    cy.get('#loginPass')
      .should('exist')
      .type('123123')

    cy.get('#loginBtn').click()

    cy.get('#email-error')
      .should('be.visible')
  })


  it("Shouldn't login with empty Password", () => {
    cy.get('#loginEmail')
      .should('exist')
      .type('example@email.com')

    cy.get('#loginBtn').click()

    cy.get('#pass-error')
      .should('be.visible')
  })


  it("Shouldn't accept invalid Email", () => {
    cy.get('#loginEmail')
      .should('exist')
      .type('exampleemail.com')

    cy.get('#loginBtn').click()

    cy.get('#email-error')
      .should('be.visible')
      .should('have.text', 'Invalid email address')
  })


  it("Shouldn't accept too short/long Password", () => {
    cy.get('#loginEmail')
      .type('example@email.com')

    cy.get('#loginPass')
      .type('123')

    cy.get('#loginBtn').click()

    cy.get('#pass-error')
      .should('be.visible')
      .should('have.text', 'Must be 6 characters or more')


    cy.get('#loginPass')
      .type('123456789123456789123456789')

    cy.get('#loginBtn').click()

    cy.get('#pass-error')
      .should('be.visible')
      .should('have.text', 'Must be 20 characters or less')
  })


  it('Should show loader while logging in', () => {
    cy.get('#loginEmail')
      .type('example@email.com')

    cy.get('#loginPass')
      .type('123123')

    cy.get('#loginBtn')
      .click()

    cy.get('#loader-login')
      .should('be.visible')
  })


  it('Should Login', () => {
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*').as('firebaseLogin')

    cy.get('#loginEmail')
      .type('testing@email.com');

    cy.get('#loginPass')
      .type('123123');

    cy.get('#loginBtn')
      .click();

    cy.wait('@firebaseLogin')

    cy.url()
      .should('eq', 'http://localhost:3000/')
  })
});