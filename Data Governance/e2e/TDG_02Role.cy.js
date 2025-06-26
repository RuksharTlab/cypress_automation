/// <reference types="cypress" />

describe('Role Creation Automation', () => {
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

    //cy.screenshot('before-test');
 cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();

    
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
cy.wait(2000);
cy.get('a[href="/datagovernance/user"]').click();
cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300')
      .first()
      .should('be.visible')
      .click();

    // Select first user option link with flex and justify-between classes
    cy.get('a.flex.items-center.justify-between')
      .first()
      .should('be.visible')
      .click();

    cy.contains('button', 'New role').click();
 

     const uniqueName = `Role_${Date.now()}`;
    cy.wrap(uniqueName).as('uniqueRoleName');

cy.contains('label', 'Name')
      .parent()
      .find('input')
      .type(credentials.Name);



cy.contains('label', 'Description')
      .parent()
      .find('input')
      .type(credentials.description);
 cy.get('input[type="date"]').eq(0).type(credentials.startDate);
cy.get('input[type="date"]').eq(1).type(credentials.endDate);

    cy.contains('button', 'Save').click();
    cy.wait(1000);
    cy.screenshot('Role edited Successfully');
    
  });
});
