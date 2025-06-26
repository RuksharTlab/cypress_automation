/*describe('Policy Page Screen', () => {
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
    //cy.get('button[type="button"]').eq(2).click();
    //===========================================
    cy.get('tbody tr')
  // 2. Select the very last row. Cypress automatically scrolls this into view.
  .last()
  // 3. Within that specific row, find the button in the last cell (the "Action" column).
  .find('td:last-child button')
  // 4. Click the three-dots menu button to open the menu.
  .click();
  //===========================================uncommetn
  cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors')
      .first()
      .click();

    // Using values from JSON
    cy.get('select').eq(0).select(credentials.policy.mainCategory);
    cy.wait(1000);
    //cy.get('input[name="subpolicy"]').clear().type(credentials.policy.subpolicyedit);
cy.get('select').eq(1).select(credentials.policy.subpolicyedit);
    cy.contains('button', 'Next').click();
     cy.wait(1000);
     cy.contains('button', 'Next').click();
     cy.wait(500);
     cy.contains('button', 'Next').click();
     cy.wait(500);
     cy.contains('button', 'Next').click();
     cy.wait(500);
     cy.contains('button', 'Next').click();
     cy.wait(500);
     cy.contains('button', 'Next').click();
     cy.wait(1000);

      cy.contains('button', 'Skip Reports').click({ force: true });

       cy.contains('button', 'Yes, Save Policy').click();
    cy.wait(1000);
    cy.screenshot('Policy edited Successfully');

    cy.wait(2000);

    //==========delete========================
/*
    // Open the action menu of the last row
// Step 1: Target the last row
cy.get('tbody tr').last().within(() => {
  // Step 2: Find all buttons in the action cell (usually last <td>)
  cy.get('td:last-child button')
    .eq(2) 
    .should('be.visible')
    .click({ force: true }); // force helps avoid hover issues
});


cy.wait(1000); // wait for modal to appear

cy.contains('button', 'Delete').should('be.visible').click();
cy.screenshot('Policy_Deleted Successfully');*/
/*cy.wait(1000); 
// Step 1: Locate the row with "Test30"
cy.get('tbody tr').contains('td', 'Test30').parents('tr').within(() => {
  // Step 2: Click the Delete icon (second button in Action column)
  cy.get('td:last-child button').eq(1).should('be.visible').click({ force: true });
});

// Step 3: Wait for modal and confirm deletion
cy.wait(1000);
cy.contains('button', 'Delete').should('be.visible').click({ force: true });

// Optional: Screenshot for report/log
cy.screenshot('Test30_Policy_Deleted');

});
});*/



//===============================================================================================

describe('Policy Page Screen', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Edits Policy_3 and deletes Test30', function () {
    Cypress.on('uncaught:exception', () => false);

    // ========== LOGIN ==========
    cy.visit(credentials.url, { failOnStatusCode: false });
    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/data-shield"]').click();
    cy.wait(1000);
    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full').eq(4).click();
    cy.get('a.flex.items-center.justify-between').eq(11).click();
    cy.wait(1000);

    // ========== EDIT specific policy: Policy_3 ==========
    cy.get('tbody tr').filter(':has(td)').each(($row) => {
      const name = $row.find('td').eq(2).text().trim(); // 3rd column = Name
      if (name === 'Policy_3') {
        cy.wrap($row).within(() => {
          cy.get('td:last-child button').eq(0).click({ force: true }); // Edit (✏️)
        });
      }
    });

    // ========== Policy Edit Steps ==========
    cy.get('select').eq(0).select(credentials.policy.mainCategory);
    cy.wait(1000);
    cy.get('select').eq(1).select(credentials.policy.subpolicyedit);
    cy.contains('button', 'Next').click();
    cy.wait(1000);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(1000);

    cy.contains('button', 'Skip Reports').click({ force: true });
    cy.contains('button', 'Yes, Save Policy').click();
    cy.wait(1000);
    cy.screenshot('Policy_3_Edited_Successfully');
    cy.wait(2000);

    // ========== DELETE specific policy: Test30 ==========
    cy.get('tbody tr').contains('td', 'Test30').parents('tr').within(() => {
      cy.get('td:last-child button').eq(1).should('be.visible').click({ force: true }); // Delete icon 🗑️
    });

    cy.wait(1000);
    cy.contains('button', 'Delete').should('be.visible').click({ force: true });
    cy.screenshot('Test30_Policy_Deleted');
  });
});



