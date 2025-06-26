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
      cy.wait(1000);
// Click the "Select existing policy" button
      cy.contains('button', 'Select existing policy').click();
      cy.wait(1000); // Optional if you can wait for next element directly
// Type into the search box
      cy.get('input[placeholder="Search by ID / Type / Name"]').type('34');
      cy.wait(1000); // Optional
//=====================================Verifing the Details========================================
// Click 2nd td a
cy.get('button[title="View Roles Details"]').click();
cy.wait(1000);
//cy.screenshot('Roles');
//cy.wait(1000);
cy.contains('button', 'Close').click({ force: true });
cy.wait(1000);
//====column control====
cy.get('button').filter((index, el) => el.innerText.trim() === '1').eq(15).click({ force: true });
cy.wait(1000);
//cy.screenshot('Column control');
//cy.wait(1000);
cy.contains('button', 'Close').click({ force: true });
cy.wait(1000);
// Permissions
cy.get('button').filter((index, el) => el.innerText.trim() === '1').eq(16).click({ force: true });
cy.wait(1000);
//cy.screenshot('Permissions');
//cy.wait(1000);
cy.contains('button', 'Close').click({ force: true });
cy.wait(1000);
// View Connections
cy.get('button[title="View Connections"]').click({ force: true });
cy.wait(1000);
//cy.screenshot('All Details');
// Type 'Salary' into the search input
cy.get('input[placeholder="Search connections, schemas, tables or columns..."]')
  .should('be.visible')
  .type('Salary');

// Optional: Wait for search results to populate
cy.wait(1000); // adjust based on actual app behavior

// Clear the input field
cy.get('input[placeholder="Search connections, schemas, tables or columns..."]')
  .clear();
cy.wait(1000);
cy.contains('button', 'Close').click({ force: true });

//=====================================================================
 cy.wait(1000);

      cy.get('th.p-3.text-left.text-xs.font-medium.uppercase.tracking-wider.w-12').click();
     cy.wait(1000);
   cy.contains('button', /^Apply Policies\s*\(\d+\)$/).click({ force: true });
   cy.get('body').should('be.visible');
      cy.screenshot('User_Page');
   cy.wait(1000);
      cy.contains('button', 'Save').click();
      cy.wait(1000);
      cy.get('body').should('be.visible');
      cy.screenshot('User_Page');
//==========================================User creation is completed======================================
  

 });
});
});