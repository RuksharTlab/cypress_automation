
describe('Add Policy With Hashing ', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Creates a new policy using values from userCredentials.json', function () {
    Cypress.on('uncaught:exception', () => false);

    cy.visit(credentials.url, { failOnStatusCode: false });
    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/data-shield"]').click();

    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full').eq(4).click();
    cy.get('a.flex.items-center.justify-between').eq(11).click();
    cy.get('button[type="button"]').eq(2).click();

    // Using values from JSON
    cy.get('select').eq(0).select(credentials.policy.mainCategory);
    cy.wait(1000);

    //=================Add Subpolicy================
    // Click on the "Add Subpolicy" button
/*cy.contains('button', 'Add Subpolicy').click();
// Enter "Automation1" in the subpolicy name input field
cy.get('input[placeholder="Enter subpolicy name"]').type('AutomationSubpolicy');
// Enter "Automation" in the description textarea
cy.get('textarea[placeholder="Enter description"]').type('Automation');
cy.wait(500);
// Click on the "Add" button
cy.contains('button', /^Add$/).click();*/

cy.wait(1000);
    //==================End=======================
    cy.get('select').eq(1).select(credentials.policy.subPolicy);

    cy.contains('button', 'Next').click();

    cy.get('input[type="text"]').eq(2).type(credentials.policy.RoleName);
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });

    cy.contains('button', 'Next').click();
    cy.wait(1000);

    cy.contains('div', 'Select Connection').click();
    cy.get('input[placeholder="Search..."]').type(credentials.policy.connection);
    cy.wait(500);
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.wait(1000);
    cy.contains('div', 'Select Schema').click();
    cy.wait(1000);
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.contains('div', 'Select Table').click();
    cy.get('input[placeholder="Search..."]').type(credentials.policy.table);
    cy.wait(1000);
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });

    cy.contains('div', 'Select Column').click();
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.contains('button', 'Next').click();

    // Select schema keyword
    cy.contains('div', 'Select Table').click();
    cy.get('input.border-b').type(credentials.policy.schemaKeyword);
    cy.get('div.hover\\:bg-gray-100').first().click();
    cy.wait(1000);
    //Add condition for row
    /*cy.contains('button', 'Add Condition').click();
     cy.wait(1000);
    cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm').eq(0).select('id');
    cy.wait(500);
    cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm').eq(1).select('=');
cy.wait(500);
    cy.get('input.w-full.p-2.border.border-gray-300.rounded-md.text-sm').type('3');
    cy.wait(500);*/
    cy.contains('button', 'Next').click();

//  condtions over
// Add Column access control start

    cy.contains('div', 'Select Table').click();
    cy.get('input.border-b').type(credentials.policy.schemaKeyword);
    cy.get('div.hover\\:bg-gray-100').first().click();
    cy.wait(1000);
    // Applying conditon for cloumn  access control 
    cy.contains('button', 'Add Column Control').click();

//cy.wait(1000);
//This is for Hashing 
cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm', { timeout: 10000 })
  .eq(0)
  .should('be.visible')
  .select(credentials.policy.Columnselect);
cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm', { timeout: 10000 })
  .eq(1)
  .should('be.visible')
  .select('Hashing');
  cy.wait(1000);
  // till here*/

    cy.contains('button', 'Next').click();

    cy.get('#permission-read').check({ force: true });
    cy.contains('button', 'Next').click();


    cy.get('button.px-6.py-2.rounded-md').click();
    cy.contains('button', 'Yes, Save Policy').click();
    cy.wait(1000);
    cy.screenshot('Policy Added Successfully');
  });
});
