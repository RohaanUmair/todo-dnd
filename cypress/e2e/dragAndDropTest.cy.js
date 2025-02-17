describe('test', () => {
    it('test dnd', () => {
        Cypress.config('scrollBehavior', false)
        cy.visit('/')

        // cy.get('#task').wait(500).drag('#column-1 #drop-zone', { force: true });
        cy.get('#column-0 > .w-60 > .border-teal-900 > .py-3').drag('#column-1 > .w-60 > .rounded > .py-3', { force: true })

        // cy.get('#task').dragTo('#column-1 #drop-zone')
        // cy.get('#column-0 > .w-60 > .border-teal-900 > .py-3').dragTo('#column-1 > .w-60 > .rounded > .py-3')


    })
})