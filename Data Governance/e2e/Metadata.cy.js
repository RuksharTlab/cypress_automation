/*describe('Metadata Migration Automation', () => {
  let testdata;

  before(() => {
    cy.fixture('testdata').then((data) => {
      testdata = data;
    });
  });

  it('Logs in and performs metadata migration', () => {
    cy.visit(testdata.url);

    // Confirm we land on login page
    cy.url().should('include', 'tantor');

    // Adjusted selectors with timeout in case it loads dynamically
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible').type(testdata.username);
    cy.get('input[name="password"]').type(testdata.password);
    cy.get('button[type="submit"]').click();

    // Resize window
    cy.viewport(1366, 768);

    // Navigate to Connections Page
    cy.get('a[href="/connections"]', { timeout: 10000 }).click();
    cy.wait(2000);

    // Select Tantor.2 from dropdown
    cy.get('select.text-slate-500').select('Tantor.2');

    // Navigate to Migration Page
    cy.get('a[href="/migration"]').click();
    cy.wait(2000);

    // Create Migration
    cy.contains('button', 'Create Migration').click();
    cy.get('span.text-gray-800.text-lg.font-bold').click();
    cy.get('div.px-3.py-2.hover\\:bg-gray-100.cursor-pointer.text-sm.text-gray-800').eq(1).click();

    // Source Connection & Schema
    cy.get('select#connection-select').eq(0).select(testdata.sourceConnection);
    cy.get('select#schema-select').eq(0).select(testdata.sourceSchema);

    // Select table
    cy.get('input[type="search"]').type(testdata.sourceTable);
    cy.get('input[type="checkbox"]').eq(1).check();

    // Target Connection & Schema
    cy.get('select#connection-select').eq(1).select(testdata.targetConnection);
    cy.get('select#schema-select').eq(1).select(testdata.targetSchema);

    // Transformation
    cy.get('select.w-full.p-2').eq(2).select(testdata.transformation);

    // Save migration
    cy.contains('button', 'Save').click();
    cy.wait(2000);

    // Run Migration
    cy.get('button.bg-[#8e78b7]').click();

    // Confirm
    cy.contains('Alright').click();

    // Log success
    cy.log('Metadata process completed successfully');
  });
});*/
describe('Tantor Login Test', () => {
  let credentials;
  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });
  it('Logs into Tantor portal and performs migration creation', () => {
    Cypress.on('uncaught:exception', () => false);
    cy.visit(credentials.url, {
      failOnStatusCode: false,
    });
    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();
    cy.screenshot('before-test');
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
    // ✅ Navigate to Connections Page
    cy.get('a[href="/connections"]').click();
    cy.wait(2000);
    // ✅ Select Tantor.2 from dropdown
    //cy.get('select.text-slate-500').should('be.visible').select('Tantor.2');
    // ✅ Navigate to Migration Page
    cy.get('a[href="/migration"]').click();
    cy.wait(2000);
    // ✅ Create new migration
    cy.contains('button', 'Create Migration').should('be.visible').click();
    // ✅ Click the first dropdown (with class text-gray-800 text-lg font-bold)
    cy.get('span.text-gray-800.text-lg.font-bold').should('be.visible').click();
    // ✅ Click the second option in dropdown
    cy.get('div.px-3.py-2.hover\\:bg-gray-100.cursor-pointer.text-sm.text-gray-800')
      .eq(1) // zero-based index, so 1 = second item
      .should('be.visible')
      .click();
          // ✅ Source: Connection & Schema
    cy.get('select#connection-select').eq(0).should('be.visible').select(credentials.sourceConnection);
    cy.get('select#schema-select').eq(0).should('be.visible').select(credentials.sourceSchema);
    // ✅ Select source table
    cy.get('input[type="search"]').should('be.visible').type(credentials.sourceTable);
    cy.get('input[type="checkbox"]').eq(1).should('be.visible').check();
    // ✅ Target: Connection & Schema
    cy.get('select#connection-select').eq(1).should('be.visible').select(credentials.targetConnection);
    cy.get('select#schema-select').eq(1).should('be.visible').select(credentials.targetSchema);
    // ✅ Transformation: Prefix
    /*cy.get('select.w-full.px-2') // Adjust class if needed
      .eq(2)
      .should('be.visible')
      .select(credentials.transformationType);*/
   cy.contains('Settings')
  .parent()
  .find('select')
  .should('be.visible')
  .select(credentials.transformationType);  // where credentials.transformationType = "Prefix"


          // ✅ Save migration
    cy.contains('button', 'Save').should('be.visible').click();
    cy.wait(2000);
    // ✅ Take screenshot
    //cy.screenshot('connection_success_screenshot');
    // ✅ Run migration
    /*cy.get('button.bg-\\[\\#8e78b7\\]')
      .should('contain.text', 'Run')
      .click();*/
      cy.contains('button', 'Yes')
  .should('be.visible')
  .click();

    // ✅ Confirm with "Alright" button
    cy.contains('button', 'Alright').should('be.visible').click();
    cy.screenshot('connection_success_screenshot');
    // ✅ Final log (you can see this in Cypress test runner logs)
    cy.log('Migration process completed successfully.');

  });
});

