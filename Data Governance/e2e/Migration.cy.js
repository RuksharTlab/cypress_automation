describe('Tantor Migration Flow', () => {
  let credentials;


  before(() => {
    // Load credentials from fixture file
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Creates a new migration successfully', () => {
    Cypress.on('uncaught:exception', () => false); // Ignore uncaught exceptions

    // Visit Tantor login page
    
    cy.visit(credentials.url, { failOnStatusCode: false });


    // Login
    cy.get('#username').type(credentials.username);
    cy.get('#password').type(credentials.password);
    cy.get('button[type="submit"]').click();

    // Resize window
    cy.viewport(1366, 768);

    // Navigate to Connections page
    cy.get('a[href="/connections"]').click();
    cy.wait(2000);

    // Navigate to Migration page
    cy.get('a[href="/migration"]').click();
    cy.wait(2000);

    // Click "Create Migration"
    cy.contains('button', 'Create Migration').click();

    // Open source dropdown
    cy.get('span.text-gray-800.text-lg.font-bold').click();

    
//cy.get('input[placeholder="Select Connection"]').eq(0).click();

// Step: Type into the search field
// Click the Source dropdown
cy.get('input[placeholder="Select Connection"]').eq(0).click();
cy.wait(2000);
// Type into the search input
cy.get('input[type="text"]').last().type('Oracle_demo', { force: true });
cy.wait(2000);
//===========================



//===========================================
cy.contains('Oracle_demo').click({ force: true });
cy.get('input[placeholder="Select Schema"]').eq(0).click(); // assuming the placeholder is correct

cy.get('input[type="text"]').last().type('test_user1', { force: true });
cy.wait(2000);
cy.contains('test_user1').click({ force: true });
//cy.get('input[id="table-bulk-pipeline_1749037032158"]').click();

cy.get('*').contains('Bulk').click({ force: true });
    cy.contains('Data Set')
  .parent() // move to the container that has the icon
  .find('svg') // or use 'button' or specific class if it's not an SVG
  .click({ force: true });
  // Step 1: Click to open dropdown
  //==========================================================
  cy.get('input[type="search"]').should('be.visible').type('CHK_DATA');
    cy.get('input[type="checkbox"]').eq(1).should('be.visible').check();
  //============================================

//cy.get('div.flex.items-center.gap-1.cursor-pointer').click();
//cy.wait(2000);
// Step 2: Click option with text CHK_DATA
//cy.contains('div', 'CHK_DATA').click();


// Step 1: Click "Target" Select Connection dropdown (index 1 means 2nd box)
//cy.get('input[placeholder="Select Connection"]').eq(1).click({ force: true });
// Step 1: Open Target Connection dropdown (usually index 1)
// Open Target Connection dropdown (2nd Select Connection input)
cy.get('input[placeholder="Select Connection"]').eq(1).click({ force: true });

// Type the search term in the Target dropdown's search box
cy.get('input[type="search"]').should('be.visible').clear({ force: true }).type('POSTGRES_BOTH1', { force: true });

// Click on the option that matches the search term
cy.contains('div', 'POSTGRES_BOTH1', { timeout: 10000 }).should('be.visible').click({ force: true });










//cy.get('input[type="text"]').last().type('Postgres_Demo', { force: true });
//cy.contains('div', 'Postgres_Demo', { timeout: 10000 })  // increase timeout just in case
 // .should('be.visible')
  //.click({ force: true });




cy.get('input[placeholder="Select Schema"]').eq(0).click(); // assuming the placeholder is correct

cy.get('input[type="text"]').last().type('public', { force: true });
cy.wait(2000);



  });
});