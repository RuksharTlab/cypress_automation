/// <reference types="cypress" />

describe('Group Creation Automation', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal and creates multiple groups', function () {
    Cypress.on('uncaught:exception', () => false);

    // Step 1: Login
    cy.visit(credentials.url, { failOnStatusCode: false });

    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // Step 2: Navigate to Group Management Page
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/user"]').click();
    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300')
      .first()
      .should('be.visible')
      .click();
    cy.get('a.flex.items-center.justify-between').eq(1).click();

    // Step 3: Loop over groups and create them
    cy.wrap(null).then(() => {
      const groupList = Object.values(credentials.groups);

      for (const groupName of groupList) {
        cy.contains('button', 'Add Group').click();

        cy.get('input[name="groupname"]').clear().type(groupName);
        cy.get('textarea[name="description"]').clear().type(credentials.description);
        cy.contains('button', 'Save').click();
        cy.wait(2000);

        // Screenshot for confirmation
        cy.screenshot(`Group_Created_${groupName}`);

        // Search to confirm creation
        cy.get('input[placeholder="Search group"]').clear().type(groupName);
        cy.wait(1000);
        cy.get('input[placeholder="Search group"]').clear();
        cy.wait(1000);

        // Optional: Open group details
        cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50')
          .eq(0)
          .click();

        cy.wait(1000);
      }
    });
  });
});
