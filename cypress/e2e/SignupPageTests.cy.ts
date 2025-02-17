describe('template spec', () => {
    beforeEach(() => {
        cy.visit('/auth')

        cy.get('#createAcc')
            .click()
    })

    it('Check is signup form loaded and fields working', () => {
        cy.get('#signup-text')
            .should('exist');

        cy.get('#signup-username')
            .should('exist')
            .type('Username test')

        cy.get('#signup-email')
            .should('exist')
            .type('example@email.com')

        cy.get('#signup-pass')
            .should('exist')
            .type('123123')

        cy.get('#signup-btn')
            .should('exist')
            .should('have.text', 'Signup')

        cy.get('#login')
            .should('exist')
            .should('include.text', 'Login')
    });


    it("Shouldn't signup with empty fields", () => {
        cy.get('#signup-btn').click()

        cy.get('#username-error')
            .should('be.visible')

        cy.get('#email-error')
            .should('be.visible')

        cy.get('#pass-error')
            .should('be.visible')
    })


    it("Shouldn't signup with empty Username", () => {
        cy.get('#signup-email')
            .type('example@email.com')

        cy.get('#signup-pass')
            .type('123123')

        cy.get('#signup-btn').click()

        cy.get('#username-error')
            .should('be.visible')
    })


    it("Shouldn't signup with empty Email", () => {
        cy.get('#signup-username')
            .type('Username test')

        cy.get('#signup-pass')
            .type('123123')

        cy.get('#signup-btn').click()

        cy.get('#email-error')
            .should('be.visible')
    })


    it("Shouldn't signup with empty Password", () => {
    cy.get('#signup-username')
        .type('Username test')

        cy.get('#signup-email')
            .should('exist')
            .type('example@email.com')

        cy.get('#signup-btn').click()

        cy.get('#pass-error')
            .should('be.visible')
    })


    it("Shouldn't accept invalid Email", () => {
        cy.get('#signup-email')
            .type('exampleemail.com')

        cy.get('#signup-btn').click()

        cy.get('#email-error')
            .should('be.visible')
            .should('have.text', 'Invalid email address')
    })


    it("Shouldn't accept too short/long Password", () => {
        cy.get('#signup-username')
            .type('Username test')

        cy.get('#signup-email')
            .type('example@email.com')

        cy.get('#signup-pass')
            .type('123')

        cy.get('#signup-btn').click()

        cy.get('#pass-error')
            .should('be.visible')
            .should('have.text', 'Must be 6 characters or more')


        cy.get('#signup-pass')
            .type('123456789123456789123456789')

        cy.get('#signup-btn').click()

        cy.get('#pass-error')
            .should('be.visible')
            .should('have.text', 'Must be 20 characters or less')
    })


    it("Shouldn't accept too long Username", () => {
        cy.get('#signup-email')
            .type('example@email.com')

        cy.get('#signup-pass')
            .type('123123')

        cy.get('#signup-username')
            .type('Username test very long')

        cy.get('#signup-btn').click()

        cy.get('#username-error')
            .should('be.visible')
            .should('have.text', 'Must be 20 characters or less')
    })


    it('Should show loader while signing up', () => {
        cy.get('#signup-username')
            .type('Username test')

        cy.get('#signup-email')
            .type('example@email.com')

        cy.get('#signup-pass')
            .type('123123')

        cy.get('#signup-btn')
            .click()

        cy.get('#loader-signup')
            .should('be.visible')
    })


    // it('Intercepts API', () => {
    //     cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?*', {
    //         forceNetworkError: true,
    //     }).as('firebaseSignup');

    //     cy.get('#signup-username')
    //         .type('Username test')

    //     cy.get('#signup-email')
    //         .type('test@example.com');

    //     cy.get('#signup-pass')
    //         .type('123456');

    //     cy.get('#signup-btn')
    //         .click();

    //     cy.wait('@firebaseSignup');
    // })
});