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

    
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    
    cy.get('a[href="/connections"]').click();
    cy.wait(2000);

    
    //cy.get('select.text-slate-500').should('be.visible').select('Tantor.2');

   cy.wait(1000);
    cy.get('a[href="/migration"]').click();
    cy.wait(2000);

 
    cy.contains('button', 'Create Migration').should('be.visible').click();

 


    
    cy.get('span.text-gray-800.text-lg.font-bold').should('be.visible').click();

    
    cy.get('div.px-3.py-2.hover\\:bg-gray-100.cursor-pointer.text-sm.text-gray-800')
      .eq(1) // zero-based index, so 1 = second item
      .should('be.visible')
      .click();

          
    cy.get('select#connection-select').eq(0).should('be.visible').select(credentials.sourceConnection);
    cy.get('select#schema-select').eq(0).should('be.visible').select(credentials.sourceSchema);

    
    cy.get('input[type="search"]').should('be.visible').type(credentials.sourceTable);
    cy.get('input[type="checkbox"]').eq(1).should('be.visible').check();

   
    cy.get('select#connection-select').eq(1).should('be.visible').select(credentials.targetConnection);
    cy.get('select#schema-select').eq(1).should('be.visible').select(credentials.targetSchema);

    
   cy.contains('Settings')
  .parent()
  .find('select')
  .should('be.visible')
  .select(credentials.transformationType);  // where credentials.transformationType = "Prefix"



        
    cy.contains('button', 'Save').should('be.visible').click();
    cy.wait(2000);

    
    //cy.screenshot('connection_success_screenshot');

    
    /*cy.get('button.bg-\\[\\#8e78b7\\]')
      .should('contain.text', 'Run')
      .click();*/

      cy.contains('button', 'Yes')
  .should('be.visible')
  .click();


    cy.wait(8000);
    cy.contains('button', 'Alright').should('be.visible').click();
cy.wait(2000);
    cy.screenshot('connection_success_screenshot');

    cy.wait(2000);
    cy.log('Metadata process completed successfully.');




  });

});



/*describe('Tantor Login & Migration Test', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor and creates a migration', () => {
    Cypress.on('uncaught:exception', () => false);

    // Login
    cy.visit(credentials.url, { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('#username').should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    // Navigate to Connections
    cy.get('a[href="/connections"]').click();
    cy.wait(2000);

    // Select Tantor.2 from dropdown
    cy.get('select.text-slate-500').should('be.visible').select('Tantor.2');
cy.wait(2000);
    // Navigate to Migration Page
    cy.get('a[href="/migration"]').click();
    cy.wait(1000);

    // Create new migration
    cy.contains('button', 'Create Migration').click();
    cy.wait(1000);
    cy.get('span.text-gray-800.text-lg.font-bold').click();
    cy.get('div.px-3.py-2.hover\\:bg-gray-100').eq(1).click(); // Assuming 2nd option

    // ✅ Source: Connection & Schema
    cy.get('#connection-select').eq(0).select(credentials.sourceConnection);
    cy.get('#schema-select').eq(0).select(credentials.sourceSchema);

    // Select source table
    cy.get('input[type="search"]').type(credentials.sourceTable);
    cy.get('input[type="checkbox"]').eq(1).check();

    // ✅ Target: Connection & Schema
    cy.get('#connection-select').eq(1).select(credentials.targetConnection);
    cy.get('#schema-select').eq(1).select(credentials.targetSchema);

    // ✅ Transformation: Prefix
    cy.contains('label', 'Transformation')
      .parent()
      .find('select')
      .should('be.visible')
      .select(credentials.transformationType);

    // Save migration
    cy.contains('button', 'Save').click();
    cy.wait(2000);
    cy.screenshot('connection_success_screenshot');

    // Run migration
    cy.get('button.bg-\\[#8e78b7\\]').click();
    cy.contains('Alright').click();

    cy.log('Migration process completed.');
  });
});*/









