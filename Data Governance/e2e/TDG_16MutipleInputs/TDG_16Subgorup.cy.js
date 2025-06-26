/// <reference types="cypress" />

describe('Sub-group Creation Automation', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal and creates multiple subgroups', function () {
    Cypress.on('uncaught:exception', () => false);

    // Step 1: Login
    cy.visit(credentials.url, { failOnStatusCode: false });
    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // Step 2: Navigate to Subgroup Page
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/user"]').click();
    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300')
      .first()
      .should('be.visible')
      .click();
    cy.get('a.flex.items-center.justify-between').eq(2).click();

    // Step 3: Loop over subgroups
    cy.wrap(null).then(() => {
      const subgroupList = Object.values(credentials.subgroups);

      for (const subgroupName of subgroupList) {
        cy.contains('button', 'Add Subgroup').click();
        cy.wait(1000);

        // Select group from dropdown
        cy.get('select[name="group"]', { timeout: 15000 }).should('be.visible');
        cy.get('select[name="group"] option').contains(credentials.group).should('exist');
        cy.get('select[name="group"]').select(credentials.group);

        // Fill in subgroup form
        cy.get('input[name="name"]').clear().type(subgroupName);
        cy.get('textarea[name="description"]').clear().type(credentials.subgroups.SGdescription);

        // Submit
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        // Optional: Click close icon or success icon
        cy.get('iconify-icon.text-gray-600').eq(0).click();

        // Screenshot for each subgroup
        cy.screenshot(`SubGroup_Created_${subgroupName}`);
      }
    });
  });
});
