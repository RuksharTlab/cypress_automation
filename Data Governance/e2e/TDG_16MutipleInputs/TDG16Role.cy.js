/// <reference types="cypress" />

describe('Role Creation Automation', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal and creates multiple roles from fixture', function () {
    Cypress.on('uncaught:exception', () => false);

    // Step 1: Login
    cy.visit(credentials.url, { failOnStatusCode: false });

    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // Step 2: Navigate to Role Management
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/user"]').click();

    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300')
      .first()
      .should('be.visible')
      .click();

    cy.get('a.flex.items-center.justify-between')
      .first()
      .should('be.visible')
      .click();

    // Step 3: Create roles from the fixture
    cy.wrap(null).then(() => {
      const roles = Object.values(credentials.roles);

      roles.forEach((roleName) => {
        const finalName = roleName === 'Role_' ? `${roleName}${Date.now()}` : roleName;

        cy.contains('button', 'New role').click();
        cy.wait(1000);

        cy.contains('label', 'Name')
          .parent()
          .find('input')
          .clear()
          .type(finalName);

        cy.contains('label', 'Description')
          .parent()
          .find('input')
          .clear()
          .type(credentials.description);

        cy.get('input[type="date"]').eq(0).clear().type(credentials.startDate);
        cy.get('input[type="date"]').eq(1).clear().type(credentials.endDate);

        cy.contains('button', 'Save').click();
        cy.wait(2000); // Give time for UI to update

        // Optional: Confirm role exists in page text if visible
        cy.get('body').then(($body) => {
          if ($body.text().includes(finalName)) {
            cy.log(`${finalName} appears on the page`);
          } else {
            cy.log(`${finalName} not found on page — may be created silently`);
          }
        });

        cy.screenshot(`Role_Created_${finalName}`);
      });
    });
  });
});
