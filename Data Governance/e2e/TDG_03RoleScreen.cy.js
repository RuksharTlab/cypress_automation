//=======================================Through Json===================================================

/// <reference types="cypress" />

describe('Role Screen', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal, edits TDGRole and deletes Test122', function () {
    Cypress.on('uncaught:exception', () => false);

    // ---------------- LOGIN ----------------
    cy.visit(credentials.url, {
      failOnStatusCode: false,
    });

    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();

    cy.screenshot('before-test');
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();

    // ---------------- NAVIGATION ----------------
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
cy.wait(2000);
//===========================================Toggle and refresh====================================================
    //cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50')
      //.eq(0)
      //.click();
    //cy.wait(2000);
    cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(0).then(($btn) => {
  cy.wrap($btn).click();
  cy.wait(2000);
  cy.wrap($btn).click();
});
cy.wait(2000);
    //cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50')
      //.eq(0)
      //.click();
    //cy.wait(2000);

//==============================Serach with exact Name======================================
    cy.get('input[placeholder="Search role"]').type(credentials.Searchwithexactname.Searchrole);
    cy.wait(1000);
   cy.get('input[placeholder="Search role"]').clear();
   cy.wait(1000);
   cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50')
      .eq(0)
      .click();
      cy.wait(1000);

  //=================================================================================================
// ---------------- EDIT  only editing Name----------------
    cy.contains('td', credentials.EditAndDeleteRole.roleeditname)
      .parents('tr')
      .within(() => {
        cy.get('button').last().click({ force: true }); // Open ⋮ menu
      });

    cy.wait(1000);

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
      .first()
      .click(); // Click Edit

    cy.get('input[type="text"]').eq(2)
      .should('be.visible')
      .clear()
      .type(credentials.EditAndDeleteRole.roleeditedwithname);

    cy.contains('button', 'Update').should('be.visible').click();
    cy.wait(1000);
    cy.screenshot('Role_Edited_Successfully');

//==============Editing the Role with Both Name and Description==============================================
    /*cy.contains('td', 'TDGRole')
  .parents('tr')
  .within(() => {
    cy.get('button').last().click({ force: true }); // Open ⋮ menu
  });

cy.wait(1000);

cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
  .first()
  .click(); // Click Edit

// Edit description (try adjusting index if needed)
cy.get('input[type="text"]').eq(3)
  .should('be.visible')
  .clear()
  .type('Updated description for TDGRole');

cy.contains('button', 'Update').should('be.visible').click();
cy.wait(1000);
cy.screenshot('TDGRole_Description_Edited');*/
 
//=========================================================================================================
// ---------------- DELETE ----------------------------------- ----------------
    // Inside the 'Test122' row
cy.contains('td', credentials.EditAndDeleteRole.roledeletename)
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

cy.screenshot('Role_Deleted_Successfully');

//====================================Card View=============================================================
//=====================================Edit============================================================
/*cy.wait(1000);
cy.get('input[placeholder="Search role"]').type(credentials.EditAndDeleteRole.roleeditname);
    cy.wait(1000);
    cy.get('button.p-1\\.5.rounded-full.hover\\:bg-gray-100').eq(0).click();

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
  .first()
  .click(); // Click Edit
  cy.get('input[type="text"]').eq(3)
  .should('be.visible')
  .clear()
  .type('Updated description for TDGRole');

cy.contains('button', 'Update').should('be.visible').click();
cy.wait(1000);
cy.screenshot('Role_Edited');
//======================================Edit completed========================================================
//=======================================Delete Started====================================================
cy.wait(1000);
cy.get('input[placeholder="Search role"]').type(credentials.EditAndDeleteRole.roledeletename);
    cy.wait(1000);
    cy.get('button.p-1\\.5.rounded-full.hover\\:bg-gray-100').eq(1).click();
  // Click the 2nd action button (assuming Delete is second)
cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
  .eq(1) // or .last() if only 2 buttons
  .click({ force: true });

cy.wait(1000);
cy.contains('button', 'Yes', { timeout: 5000 }).should('be.visible').click({ force: true });
cy.wait(500);
// Close the popup
cy.contains('button', 'Close', { timeout: 5000 }).should('be.visible').click({ force: true });

cy.screenshot('Role_Deleted_Successfully');*/
//======================================Delete completed===================================================





  });
});
