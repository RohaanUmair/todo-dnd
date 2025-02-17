describe('home page spec', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    // it('Should login', () => {
    //     cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*').as('firebaseLogin')

    //     cy.get('#loginEmail')
    //         .type('testing@email.com');

    //     cy.get('#loginPass')
    //         .type('123123');

    //     cy.get('#loginBtn')
    //         .click();

    //     cy.wait('@firebaseLogin')

    //     cy.url()
    //         .should('eq', 'http://localhost:3000/')
    // })


    // it('Check Home page loaded', () => {
    //     // cy.wait(5000)
    //     cy.get('#heading')
    //         .should('exist')

    //     cy.get('#profile-btn')
    //         .should('exist')

    //     cy.get('#add-task-inp')
    //         .should('exist')

    //     cy.get('#select-inp')
    //         .should('exist')

    //     cy.get('#add-task-btn')
    //         .should('exist')

    //     cy.get('#new-card-btn')
    //         .should('exist')

    //     cy.get('#column-0')
    //         .should('exist')

    //     cy.get('#column-1')
    //         .should('exist')

    //     cy.get('#column-2')
    //         .should('exist')
    // })


    //     it('Add a new Card', () => {
    // cy.get('#new-card-btn')
    //     .click()

    // cy.get('#add-card-inp')
    //     .type('Test Card')

    // cy.get('#add-card-btn')
    //     .click()
    //     })


    //     it('Add a task in first Card', () => {
    // cy.get('#add-task-inp')
    //     .type('Test Task')

    // cy.get('#column-0 > .w-60 > .rounded > .mt-4 > .mx-auto')
    //     .click()
    //     })


    //     it('Clears all task in first Card', () => {
    // cy.get('#column-0 #open-card-menu-btn')
    //     .click()

    // cy.get('#column-0 #del-all-tasks-btn')
    //     .click()
    //     })


    // it('Edit a task', () => {
    //     cy.get('#column-0 #edit-btn')
    //         .click()

    //     cy.get('#column-0 #edit-task-inp')
    //         .clear()
    //         .type('Edited Task')

    //     cy.get('#column-0 #edit-task-save-btn')
    //         .click()
    // })


    // it('Add, edit & delete Task', () => {
    //     cy.get('#column-0 #add-task-btn-card')
    //         .click()


    //     cy.wait(1500)
    //     cy.get('#column-0 #edit-btn')
    //         .click()

    //     cy.get('#column-0 #edit-task-inp')
    //         .clear()
    //         .type('Edited Task')

    //     cy.get('#column-0 #edit-task-save-btn')
    //         .click()


    //     cy.wait(1500)
    //     cy.get('#column-0 #open-card-menu-btn')
    //         .click()

    //     cy.get('#column-0 #del-all-tasks-btn')
    //         .click()
    //     cy.wait(1500)
    // })



    // it('Add Card, add task, edit Card name, del Card', () => {
    //     cy.get('#new-card-btn')
    //         .click()

    //     cy.get('#add-card-inp')
    //         .type('Test Card')

    //     cy.get('#add-card-btn')
    //         .click()


    //     cy.wait(1500)
    //     cy.get('#column-3 #add-task-btn-card')
    //         .click()


    //     cy.wait(1500)
    //     cy.get('#column-3 #open-card-menu-btn')
    //         .click()

    //     cy.get('#column-3 #edit-card-title-btn')
    //         .click()

    //     cy.get('#column-3 #edit-card-title-inp')
    //         .clear()
    //         .type('New title')

    //     cy.get('#column-3 #edit-card-title-save-btn')
    //         .click()


    //     cy.wait(1500)
    //     cy.get('#column-3 #open-card-menu-btn')
    //         .click()
    //     cy.get('#column-3 #del-card-btn')
    //         .click()
    //     cy.wait(1500)
    // })


    // it('Drags task to another Card', () => {
    //     cy.get('#task').drag('#column-1')

    //     cy.wait(4000)
    // })

    it('Opens modal, add desc, add comment, dels both and closes modal', () => {
        cy.wait(1500)
        cy.get('#task').click()

        cy.wait(1500)
        cy.get('#watch-btn').click()

        cy.wait(1500)
        cy.get('#desc-inp')
            .type('This is a test Description which will be deleted soon.')

        cy.wait(1500)
        cy.get('#save-desc-btn')
            .click()

        cy.wait(1500)
        cy.get('#comment-inp')
            .type('Adding a test comment')

        cy.wait(1500)
        cy.get('#add-comment-btn')
            .click()

        cy.get('#modal')
            .scrollTo('top')

        cy.wait(1500)
        cy.get('#del-desc-btn')
            .click()

        cy.wait(1500)
        cy.get('#del-comment-btn')
            .click()

        cy.get('#modal')
            .scrollTo('top')

        cy.wait(1500)
        cy.get('#close-modal-btn')
            .click()
    })



})