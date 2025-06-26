/// <reference types="cypress" />

describe('Group Creataion', () => {
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
      cy.get('a.flex.items-center.justify-between').eq(1).click();
      
      // --- Create a New Group ---
      cy.contains('button', 'Add Group').click();// Using text is more reliable

      cy.get('input[name="groupname"]').type(credentials.groupName);
      cy.get('textarea[name="description"]').type(credentials.groupDescription);

      cy.contains('button', 'Save').click();
      cy.wait(3000);
      cy.screenshot('Group_Creation');

    //=============================Group created=============================================================
    //=============================For confiramtion we need to search with created name=====================

    cy.get('input[placeholder="Search group"]').type(credentials.groupName);
    cy.wait(1000);
   cy.get('input[placeholder="Search group"]').clear();
   cy.wait(1000);
   cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50')
      .eq(0)
      .click();
       cy.wait(1000);

  
  });
});
