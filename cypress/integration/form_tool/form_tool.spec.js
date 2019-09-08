describe('tt', () => {
    it('should add input', function () {
		cy.visit('tools/form')

		const inputs = [
            {name: 'name1', key: 'key1', type: '输入框'},
            {name: 'name2', key: 'key2', type: '密码框'},
            {name: 'name3', key: 'key3', type: '数字输入框'},
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

        // test deleteItem
        const deleteIndex = 0
        cy.get('button i.anticon-delete').eq(deleteIndex).parent().click()
        cy.get('table td').should('length', (inputs.length - 1) * 5)
        cy.get('table td').eq(deleteIndex).should('not.text', inputs[deleteIndex].name)
    })
})
