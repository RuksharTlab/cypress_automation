describe('Add Connector Flow', () => {
  it('Logs in and adds a connector', () => {
  console.log('Before calling cy.login()');
  cy.login();
  console.log('After calling cy.login()');

    // Navigate to Connections page
    cy.contains('span', 'Connections').click();
    cy.wait(2000);

    // Select the project from dropdown
    cy.get('select.w-44').select(Cypress.env('projectName'));

    // Click Add Connector button
    cy.contains('button', 'Add Connector').click();
    cy.wait(2000);

    // Search for the connector type
    cy.get('input[placeholder="Search Connector"]').type(Cypress.env('connectorType'));
    cy.wait(2000);

    const connectorAlt = Cypress.env('connectorAlt'); // Load "connectorAlt" from environment variables
    cy.get(`img[alt="${connectorAlt}"]`)
    .parents('div.cursor-pointer') // Traverse to parent div with class "cursor-pointer"
    .click();
    cy.wait(2000); // Wait for 2 seconds (again, prefer assertions if possible)


    // Click the "Next" button
    cy.contains('button', 'Next').click();
    cy.wait(2000); // Wait for 2 seconds (if absolutely necessary)


    // Fill in connection details
    cy.get('input[name="connection_name"]').type(Cypress.env('connectionName'));
    cy.get('input[name="description"]').type(Cypress.env('description'));
    cy.get('select[name="pool_type"]').select(Cypress.env('poolType'));
    cy.get('input[name="host_address"]').type(Cypress.env('host'));
    cy.get('input[name="port_number"]').type(Cypress.env('port'));
    cy.get('input[name="username"]').type(Cypress.env('dbUsername'));
    cy.get('input[name="password"]').type(Cypress.env('dbPassword'));
    cy.get('input[name="database_name"]').type(Cypress.env('databaseName'));

    // Test Connection
    cy.contains('button', 'Test Connection').click();
    cy.wait(3000);

    // Save Connection
    cy.contains('button', 'Create and Save').click();
    // Wait for the success popup and click "Alright"
    cy.contains('button', 'Alright').should('be.visible').click();  });
});
