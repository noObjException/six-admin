describe('tt', () => {
    it('should add input', function () {
		cy.visit('tools/form')

		const inputs = [
            {name: 'name', key: 'key', type: '输入框'},
            {name: 'name', key: 'key', type: '密码框'},
            {name: 'name', key: 'key', type: '数字输入框'},
        ]

        inputs.forEach(input => {
            cy.contains('Create Now').click()
            cy.get('#name input').type(input.name).should('have.value', input.name)
            cy.get('#key input').type(input.key).should('have.value', input.key)
            cy.get('#type').click()
            cy.contains(input.type).click()

            cy.get('.ant-modal-footer button').click()

            cy.contains(input.name)
            cy.contains(input.key)
            cy.contains(input.type)
        })
    })
})
