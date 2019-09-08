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

            cy.get('table tr td').should('contain', input.name)
            cy.get('table tr td').should('contain', input.key)
            cy.get('table tr td').should('contain', input.type)
        })

        // test updateItem
        const editIndex = 0
        const editInput = {name: 'name_update', key: 'key_update', type: '开关'}
        cy.get('button i.anticon-edit').eq(editIndex).parent().click()
        cy.get('#name input').clear().type(editInput.name).should('have.value', editInput.name)
        cy.get('#key input').clear().type(editInput.key).should('have.value', editInput.key)
        cy.get('#type').click()
        cy.contains(editInput.type).click()

        cy.get('.ant-modal-footer button').click()

        cy.get('table tr').should('length', inputs.length + 1)
        cy.get('table tr td').should('contain', editInput.name)
        cy.get('table tr td').should('contain', editInput.key)
        cy.get('table tr td').should('contain', editInput.type)

        // test deleteItem
        const deleteIndex = 0
        cy.get('button i.anticon-delete').eq(deleteIndex).parent().click()
        cy.get('table tr').should('length', inputs.length)
        cy.get('table td').eq(deleteIndex).should('not.text', inputs[deleteIndex].name)
    })
})
