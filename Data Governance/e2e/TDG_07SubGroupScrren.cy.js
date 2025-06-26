describe('Sub-group  Edit Automation', () => {
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

    cy.screenshot('before-test');
 cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();

    
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
cy.wait(2000);
cy.get('a[href="/datagovernance/user"]').click();
cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300')
      .first()
      .should('be.visible')
      .click();
cy.get('a.flex.items-center.justify-between').eq(2).click();
//===========================================Toggle and refresh===========================================================
//cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(0).click();
//cy.wait(2000);
//cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(0).click();
cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(0).then(($btn) => {
  cy.wrap($btn).click();
  cy.wait(2000);
  cy.wrap($btn).click();
});
   cy.wait(1000);
   cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(1).click();

//============================================Search with Exact Name==============================================================
cy.get('input[placeholder="Search subgroup"]').type(credentials.Searchwithexactname.Searchsubgroup);
    cy.wait(1000);
   cy.get('input[placeholder="Search subgroup"]').clear();
   cy.wait(1000);
   cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50')
      .eq(0)
      .click();
       cy.wait(1000);
//=====================================Edit Process=====================================================================
cy.contains('td', credentials.EditAndDeleteSubGroup.subgroupeditname)
      .parents('tr')
      .within(() => {
        cy.get('button').last().click({ force: true }); // Open ⋮ menu
      });

    cy.wait(1000);

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
      .first()
      .click(); // Click Edit

    //cy.get('input[name="newName"]').clear().type('Subgroup updated ');
    cy.get('input[name="new_name"]')
  .should('be.visible')
  .and('not.be.disabled')
  .clear()
  .type(credentials.EditAndDeleteSubGroup.subgroupeditedwithname);
  cy.contains('button', 'Update').should('be.visible').click();
    cy.wait(1000);
    cy.screenshot('TDGRole_Edited_Successfully');


//======================================Edit End==================================================================
// ==================================== DELETE Process ========================================================
   
cy.contains('td', credentials.EditAndDeleteSubGroup.subgroupdeletename)
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

//==================================Delete COmpleted===========================================================




  });
});