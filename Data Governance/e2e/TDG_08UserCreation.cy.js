describe('User Creation Automation', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal and creates all users from credentials', function () {
    Cypress.on('uncaught:exception', () => false);

    cy.visit(credentials.url, { failOnStatusCode: false });
    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/user"]').click();

    // Loop through each user
    credentials.users.forEach((user) => {
      cy.contains('button', 'Add user').click();

      cy.get('input[placeholder="User name"]').type(user.username);
      cy.get('input[placeholder="Password"]').type(user.password);
      cy.get('input[placeholder="Confirm password"]').type(user.password);
      cy.get('input[placeholder="First name"]').type(user.firstName);
      cy.get('input[placeholder="Last name"]').type(user.lastName);
      cy.get('input[placeholder="Email id"]').type(user.email);

      // Role dropdown
      cy.wait(1000);
      cy.get('div.w-full.p-2\\.5.border.border-gray-400.rounded-lg.flex.justify-between.items-center.cursor-pointer.bg-white')
  .eq(0)
  .click({ force: true });

      //cy.get('div.w-full.p-2\\.5.border.border-gray-400.rounded-lg.flex.justify-between.items-center.cursor-pointer.bg-white')
        //.eq(0).click();
      cy.wait(1000);
      cy.get('input[placeholder="Search roles"]').type(user.role);
      cy.contains('div', user.role).click();
/////  Group and Sub-group commented===========================================================================
      // Group dropdown
     /* cy.get('div.w-full.p-2\\.5.border.border-gray-400.rounded-lg.flex.justify-between.items-center.cursor-pointer.bg-white')
        .eq(1).click();
      cy.get('input[placeholder="Search groups"]').type(user.group);
      cy.contains('div', user.group).click();

cy.wait(2000);
cy.get('div.w-full.p-2\\.5.border.border-gray-400.rounded-lg.flex.justify-between.items-center.cursor-pointer.bg-white')
  .eq(2)  // zero-based index: 2 means the 3rd element
  .click();

cy.get('input[placeholder="Search sub-groups"]').type(user.subgroupName);
cy.wait(500);
cy.contains('div', user.subgroupName).click();*/

//===================================Group and subgroup commented till here==========================================
      cy.wait(1000);
      cy.contains('button', 'Save').click();
      cy.wait(1000);
      cy.screenshot('USercreated');
    });
  });
});
