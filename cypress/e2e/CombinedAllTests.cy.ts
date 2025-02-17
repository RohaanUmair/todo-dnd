describe('All tests', () => {
    beforeEach(() => {
        Cypress.config('scrollBehavior', false)
        cy.visit('/')
        cy.viewport(1180, 800)
    })

    it('Check is signup form loaded and fields working', () => {
        cy.get('#createAcc')
            .click()

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


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


        cy.get('#signup-btn').click()

        cy.get('#username-error')
            .should('be.visible')

        cy.get('#email-error')
            .should('be.visible')

        cy.get('#pass-error')
            .should('be.visible')


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


        cy.get('#signup-email')
            .type('example@email.com')

        cy.get('#signup-pass')
            .type('123123')

        cy.get('#signup-btn').click()

        cy.get('#username-error')
            .should('be.visible')


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


        cy.get('#signup-username')
            .type('Username test')

        cy.get('#signup-pass')
            .type('123123')

        cy.get('#signup-btn').click()

        cy.get('#email-error')
            .should('be.visible')


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


        cy.get('#signup-username')
            .type('Username test')

        cy.get('#signup-email')
            .should('exist')
            .type('example@email.com')

        cy.get('#signup-btn').click()

        cy.get('#pass-error')
            .should('be.visible')


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


        cy.get('#signup-email')
            .type('exampleemail.com')

        cy.get('#signup-btn').click()

        cy.get('#email-error')
            .should('be.visible')
            .should('have.text', 'Invalid email address')


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


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


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


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


        cy.get('#signup-username')
            .clear()

        cy.get('#signup-email')
            .clear()

        cy.get('#signup-pass')
            .clear()


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
    });



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


        cy.get('#loginEmail')
            .clear()

        cy.get('#loginPass')
            .clear()


        cy.get('#loginBtn').click()

        cy.get('#email-error')
            .should('be.visible')

        cy.get('#pass-error')
            .should('be.visible')


        cy.get('#loginEmail')
            .clear()

        cy.get('#loginPass')
            .clear()


        cy.get('#loginPass')
            .should('exist')
            .type('123123')

        cy.get('#loginBtn').click()

        cy.get('#email-error')
            .should('be.visible')


        cy.get('#loginEmail')
            .clear()

        cy.get('#loginPass')
            .clear()


        cy.get('#loginEmail')
            .should('exist')
            .type('example@email.com')

        cy.get('#loginBtn').click()

        cy.get('#pass-error')
            .should('be.visible')


        cy.get('#loginEmail')
            .clear()

        cy.get('#loginPass')
            .clear()


        cy.get('#loginEmail')
            .should('exist')
            .type('exampleemail.com')

        cy.get('#loginBtn').click()

        cy.get('#email-error')
            .should('be.visible')
            .should('have.text', 'Invalid email address')


        cy.get('#loginEmail')
            .clear()

        cy.get('#loginPass')
            .clear()


        cy.get('#loginEmail')
            .type('example@email.com')

        cy.get('#loginPass')
            .type('123')

        cy.get('#loginBtn').click()

        cy.get('#pass-error')
            .should('be.visible')
            .should('have.text', 'Must be 6 characters or more')


        cy.get('#loginEmail')
            .clear()

        cy.get('#loginPass')
            .clear()


        cy.get('#loginPass')
            .type('123456789123456789123456789')

        cy.get('#loginBtn').click()

        cy.get('#pass-error')
            .should('be.visible')
            .should('have.text', 'Must be 20 characters or less')


        cy.get('#loginEmail')
            .clear()

        cy.get('#loginPass')
            .clear()


        cy.get('#loginEmail')
            .type('example@email.com')

        cy.get('#loginPass')
            .type('123123')

        cy.get('#loginBtn')
            .click()

        cy.get('#loader-login')
            .should('be.visible')

        cy.url()
            .should('eq', 'http://localhost:3000/')
    })



    it('Check Home page loaded', () => {
        // cy.wait(5000)
        cy.get('#heading')
            .should('exist')

        cy.get('#profile-btn')
            .should('exist')

        cy.get('#add-task-inp')
            .should('exist')

        cy.get('#select-inp')
            .should('exist')

        cy.get('#add-task-btn')
            .should('exist')

        cy.get('#new-card-btn')
            .should('exist')

        cy.get('#column-0')
            .should('exist')

        cy.get('#column-1')
            .should('exist')

        cy.get('#column-2')
            .should('exist')


        cy.get('#add-task-inp')
            .type('Test Task')
            .clear()


        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()
        cy.wait(1000)

        cy.get('#column-0 #open-card-menu-btn')
            .click()

        cy.get('#column-0 #del-all-tasks-btn')
            .click()
        cy.wait(1000)


        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.get('#column-1 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-1 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-1 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-1 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-1 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.get('#column-2 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-2 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-2 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(500)
        cy.get('#column-2 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(1000)
        cy.get('#column-0 #task-1 #edit-btn')
            .click()
        cy.wait(1000)

        cy.get('#column-0 #task-1 #edit-task-inp')
            .clear()
            .type('Edited Task')

        cy.get('#column-0 #task-1 #edit-task-save-btn')
            .click()


        cy.wait(1000)
        cy.get('#column-0 #open-card-menu-btn')
            .click()

        cy.get('#column-0 #del-all-tasks-btn')
            .click()
        cy.wait(1000)
    })


    it('tests', () => {
        cy.wait(1000)

        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.get('#new-card-btn')
            .click()

        cy.get('#add-card-inp')
            .type('Test Card')

        cy.get('#add-card-btn')
            .click()


        cy.wait(1000)
        cy.get('#add-task-inp')
            .type('Test Task')

        cy.get('#select-inp')
            .select('Test Card')

        cy.wait(1000)
        cy.get('#add-task-btn')
            .click()

        cy.wait(1000)
        cy.get('#add-task-inp')
            .type('Second task')

        cy.get('#select-inp')
            .select('Test Card')

        cy.wait(1000)
        cy.get('#add-task-btn')
            .click()


        cy.wait(1000)
        cy.get('#column-3 #open-card-menu-btn')
            .click()

        cy.get('#column-3 #edit-card-title-btn')
            .click()

        cy.get('#column-3 #edit-card-title-inp')
            .clear()
            .type('New title')

        cy.get('#column-3 #edit-card-title-save-btn')
            .click()


        cy.wait(1000)
        cy.get('#add-task-inp')
            .type('3rd test task')

        cy.get('#select-inp')
            .select('Test Card')

        cy.wait(1000)
        cy.get('#add-task-btn')
            .click()


        cy.wait(1000)
        cy.get('#column-3 #open-card-menu-btn')
            .click()
        cy.get('#column-3 #del-card-btn')
            .click()
        cy.wait(1000)


        cy.wait(1000)
        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(1000)
        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()

        cy.wait(1000)
        cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
            .click()


        cy.wait(1000)
        cy.get('#column-0 task-0').click()

        cy.wait(1000)
        cy.get('#watch-btn').click()

        cy.wait(1000)
        cy.get('#desc-inp')
            .type('This is a test Description which will be deleted soon.')

        cy.wait(1000)
        cy.get('#save-desc-btn')
            .click()

        cy.wait(1000)
        cy.get('#comment-inp')
            .type('Adding a test comment')

        cy.wait(1000)
        cy.get('#add-comment-btn')
            .click()

        cy.wait(1000)
        cy.get('#del-desc-btn')
            .click()

        cy.wait(1000)
        cy.get('#del-comment-btn')
            .click()

        cy.wait(1000)
        cy.get('body').click(0, 0)

        cy.get('#del-task-btn')
            .click()
        cy.wait(1000)

        cy.get('.swal2-confirm')
            .click()
        cy.wait(1000)


        cy.wait(1000)
        cy.get('#column-0 #open-card-menu-btn')
            .click()

        cy.get('#column-0 #del-all-tasks-btn')
            .click()

        cy.wait(1000)
        cy.get('#column-1 #open-card-menu-btn')
            .click()

        cy.get('#column-1 #del-all-tasks-btn')
            .click()

        cy.wait(1000)
        cy.get('#column-2 #open-card-menu-btn')
            .click()

        cy.get('#column-2 #del-all-tasks-btn')
            .click()
        cy.wait(1000)
    })


    it('Logout', () => {
        cy.wait(1500)
        cy.get('#profile-btn')
            .click()

        cy.wait(1000)
        cy.get('#logout-btn')
            .click()
        cy.wait(1000)
    })

})