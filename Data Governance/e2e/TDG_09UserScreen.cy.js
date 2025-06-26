// =================================================Using Json file============================================
describe('User Scrren', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Edits and Deletes users using credentials from fixture', function () {
    Cypress.on('uncaught:exception', () => false);

    cy.visit(credentials.url, { failOnStatusCode: false });

    cy.get('#username').should('be.visible').type(credentials.username);
    cy.get('#password').type(credentials.password);
    cy.get('button[type="submit"]').click();

    // Wait for dashboard
    //cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/user"]').click();

    cy.wait(2000);
    //=============================Refresh================================================================
    cy.get('button.p-2\\.5.rounded-lg.bg-gray-100.disabled\\:opacity-50').click();
    cy.wait(2000);
    //=====================================================================================================
    //==============================Searach with Name======================================
    cy.get('input[placeholder="Search all user"]').type(credentials.Searchwithexactname.Serachuser);
    cy.wait(1000);
   cy.get('input[placeholder="Search all user"]').clear();
   cy.wait(1000);
//==============================Verify the assigned Role,Group,Subgroup to the user=========================
    cy.get('input[placeholder="Search all user"]').type(credentials.Searchwithexactname.Serachuser);
    cy.wait(1000);
//==========For Role============
    cy.get('button.text-center.font-medium.underline.decoration-1.underline-offset-4').eq(0).click();
   cy.wait(1000);
   cy.screenshot('Role is visible_Successfully');
   cy.contains('button', 'Close').click({ force: true });
   cy.wait(1000);
//=========For Group============
    cy.get('button.text-center.font-medium.underline.decoration-1.underline-offset-4').eq(2).click();
   cy.wait(1000);
   cy.screenshot('Group is visible_Successfully');
   cy.contains('button', 'Close').click({ force: true });
   cy.wait(1000);
//==========For Sub-group =================
  cy.get('button.text-center.font-medium.underline.decoration-1.underline-offset-4').eq(3).click();
   cy.wait(1000);
   cy.screenshot('Sub-Group is visible_Successfully');
   cy.contains('button', 'Close').click({ force: true });
   cy.wait(1000);
  
   //====================================verified========================================================

    // ===================== EDIT USER ======================
    
    /*cy.get('input[placeholder="Search all user"]').clear().type(credentials.EditAndDeleteUser.usereditname);

    cy.get('button.p-1\\.5.rounded-full.hover\\:bg-gray-100').click(); // search or open action menu
    cy.wait(500);

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors').eq(0).click(); // click edit

    cy.get('input[name="firstName"]').clear().type(credentials.EditAndDeleteUser.usereditedwithname);

    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click();
    cy.screenshot('User_Edited_Successfully');

    cy.wait(1000);

    // ===================== DELETE USER ======================
    cy.get('input[placeholder="Search all user"]').clear().type(credentials.EditAndDeleteUser.userdeletename);

    cy.get('button.p-1\\.5.rounded-full.hover\\:bg-gray-100').click();
    cy.wait(500);

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors').eq(1).click(); // click delete

    cy.contains('button', 'Yes').should('be.visible').click();
    cy.wait(500);
    cy.contains('button', 'Close', { timeout: 5000 }).should('be.visible').click({ force: true });
    cy.screenshot('User_Deleted_Successfully');*/
  });
});

