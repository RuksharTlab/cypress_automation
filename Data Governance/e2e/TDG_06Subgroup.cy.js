describe('Sub-group Creation Automation', () => {
  let credentials;


  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal and performs migration creation', function () {
    Cypress.on('uncaught:exception', () => false);

    cy.visit(credentials.url, {
      failOnStatusCode: false,
    });

    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();

    cy.screenshot('before-test');
 cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();

    
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
cy.wait(2000);
cy.get('a[href="/datagovernance/user"]').click();
cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300')
      .first()
      .should('be.visible')
      .click();

      cy.get('a.flex.items-center.justify-between').eq(2).click();
      cy.contains('button', 'Add Subgroup').click();
      cy.wait(1000);
      cy.get('select[name="group"]', { timeout: 15000 }).should('be.visible');
    cy.get('select[name="group"] option').contains(credentials.group).should('exist');
    cy.get('select[name="group"]').select(credentials.group);

    // Fill in subgroup name and description
    cy.get('input[name="name"]').type(credentials.subgroupName);
    cy.get('textarea[name="description"]').type(credentials.description);


    // Submit the form
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.get('iconify-icon.text-gray-600').eq(0).click(); // 0-based index
    cy.screenshot('sub-Group  edited Successfully');
    




 });
});
