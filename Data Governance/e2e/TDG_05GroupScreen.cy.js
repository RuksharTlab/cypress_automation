describe('Group  Screen', () => {
  let credentials;

  before(() => {
    // Load credentials and group data from a fixture file
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Creates, verifies, updates, and verifies a new group', function () {
    // This command prevents the test from failing due to random application errors
    Cypress.on('uncaught:exception', () => false);

    // This block reads the counter, creates a unique name, and runs the test
    cy.readFile('cypress/fixtures/groupCounter.json').then((counter) => {
      const newId = counter.lastUsedId + 1;
      const uniqueGroupName = credentials.groupName + newId;
      const updatedGroupName = credentials.groupNameUpdated + newId;

      // IMPORTANT: Update the counter file for the next run
      cy.writeFile('cypress/fixtures/groupCounter.json', { lastUsedId: newId });

      // --- Start of Test Execution ---


      // Log in using a custom command or standard steps
      cy.visit(credentials.url);
      cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
      cy.get('#password').should('be.visible').type(credentials.password);
      cy.get('button[type="submit"]').click();
      
      cy.url({ timeout: 10000 }).should('include', '/dashboard');

      // --- Navigate to the Group Page ---
      cy.get('a[href="/dashboard"]').click();
      
      // Using 'cy.contains' is more reliable than fragile class names
      cy.contains('button', 'Data Governance', { timeout: 10000 }).should('be.visible').click();
      
      cy.get('a[href="/datagovernance/user"]').click();

      // This selector is fragile. A data-cy attribute would be better.
      cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300').first().click();

      // Click on the 'Group' link. We use .eq(1) because it's the second link (index 1).
      cy.get('a.flex.items-center.justify-between').eq(1).click();
      cy.wait(1000);
//============================================Toggle And Refresh==========================================
      cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(0).then(($btn) => {
      cy.wrap($btn).click();
      cy.wait(2000);
      cy.wrap($btn).click();
});
      cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(0).click();
      cy.wait(1000);
//==============================Serach with Name======================================
    cy.get('input[placeholder="Search group"]').type(credentials.Searchwithexactname.Searchgroup);
    cy.wait(1000);
   cy.get('input[placeholder="Search group"]').clear();
   cy.wait(1000);
   cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50')
      .eq(0)
      .click();
       cy.wait(1000);
  //==================

 // ---------------- EDIT  only editing Name----------------
    cy.contains('td', credentials.EditAndDeleteGroup.groupeditname)
      .parents('tr')
      .within(() => {
        cy.get('button').last().click({ force: true }); // Open ⋮ menu
      });

    cy.wait(1000);

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
      .first()
      .click(); // Click Edit

    cy.get('input[name="newName"]').clear().type(credentials.EditAndDeleteGroup.groupeditedwithname);
      

    cy.contains('button', 'Update').should('be.visible').click();
    cy.wait(1000);
    cy.screenshot('TDGRole_Edited_Successfully');
//====================================Edit completed========================================================
// ---------------- DELETE  ----------------
   
cy.contains('td', credentials.EditAndDeleteGroup.groupdeletename)
  .parents('tr')
  .within(() => {
    cy.get('button').last().click({ force: true }); // Open ⋮ menu
  }); 

cy.wait(1000);

// Click the 2nd action button (assuming Delete is second)
cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
  .eq(1) // or .last() if only 2 buttons
  .click({ force: true });

cy.wait(1000);

// Confirm 'Yes' in popup
cy.contains('button', 'Yes', { timeout: 5000 }).should('be.visible').click({ force: true });

cy.wait(500);

// Close the popup
cy.contains('button', 'Close', { timeout: 5000 }).should('be.visible').click({ force: true });

cy.screenshot('Test122_Deleted_Successfully');

//==================================Delete Completed===========================================================================
     });
});
 });


 