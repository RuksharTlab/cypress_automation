import 'cypress-xpath';
import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  fillConsolidationModal,
  openConsolidationCard,
  fillSourceViewCard
} from '../../../../support/federation_helpers';



// --- Test Steps ---

describe('Federation View Automation', () => {
  it('Performs federation view actions', () => {
    // Log in and navigate to the create business view page.
    cy.login();
    cy.navigateToCreateBusinessView();

    // Get filter conditions from environment variables.
    const condition1 = Cypress.env('filterCondition1');
    const condition2 = Cypress.env('filterCondition2');
    const operator = Cypress.env('filterOperator');
    const assertionHeaders = Cypress.env('assertionHeaders');

    // Drag and drop the required nodes onto the canvas.
    cy.dragSourceViewToCanvas({ x: 200, y: 400 });
    cy.dragConsolidationToCanvas({ x: 600, y: 400 });
    cy.dragConnectionToCanvas({ x: 800, y: 200 });

    
    cy.get('button[aria-label="fit view"]').click();

    // Connect the nodes on the canvas.
    connectSourceViewToConsolidation();
    ConsolidationToConnection();
    

    // Fill in the details for the Source View card.
    const viewToSelect = Cypress.env('SourceViewName');
    fillSourceViewCard(viewToSelect);
    cy.get('#selectAll').click();
    cy.contains('button', 'OK').click();

    // Fill in the details for the Connection card.
    const connectionName = Cypress.env('connectionName');
    const schemaName = Cypress.env('schemaName');
    const tableName = Cypress.env('tableName');
    FillConnectionCard('Connection', connectionName);
    FillConnectionCard('Schema', schemaName);
    FillConnectionCard('Table', tableName);

    // Select all columns in the Connection card and confirm.
    cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
      .find('#selectAll')
      .should('be.visible')
      .first()
      .check({ force: true });
      cy.wait(500)
    cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
      .contains('button', 'OK')
      .should('be.visible')
      .first()
      .click({ force: true });
    

    // Zoom out to get a better view.
    for (let i = 0; i < 3; i++) {
      cy.get('button.react-flow__controls-button.react-flow__controls-zoomout').click();
    }
    // Open and fill the Consolidation (Join) modal.
    openConsolidationCard();
    fillConsolidationModal({
      left: Cypress.env('consolidationLeft'),
      right: Cypress.env('consolidationRight'),
      type: Cypress.env('consolidationType'),
      operator: Cypress.env('consolidationOperator')
    });
    
    // Proceed to the next step in the view creation process.
    cy.contains('button', 'Next')
      .should('be.visible')
      .click({ force: true });

    // Skip the optional step.
    cy.contains('button', 'Skip')
      .should('be.visible')
      .click({ force: true });


    // Intercept the save view API call to verify its payload and response.
    cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');

    
   cy.contains('button', 'Create view').should('be.visible').click();

    // Wait for the modal, enter the view name, and save.
    cy.contains('h2', 'View Name').should('be.visible');
    cy.get('input[placeholder="Enter View Name"]')
      .should('be.visible')
      .type(Cypress.env('viewName'));
    cy.contains('button', 'Save View').should('be.visible').click();
    cy.screenshot('sourceview_to_connection_end');

  
  });
});

