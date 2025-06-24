import 'cypress-xpath';
import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  fillConsolidationModal,
  openConsolidationCard,
  fillSourceViewCard
} from '../../../../support/federation_helpers';

// Load test data
let testData;
before(() => {
  cy.fixture('test-data/sorurceview_to_connection_complex.json').then((data) => {
    testData = data;
  });
});

// --- Test Steps ---

describe('Federation View Automation', () => {
  it('Performs federation view actions', () => {
    // Log in and navigate to the create business view page.
    cy.login();
    cy.navigateToCreateComplexBusinessView();

    // Drag and drop the required nodes onto the canvas.
    cy.dragSourceViewToCanvas({ x: 200, y: 400 });
    cy.dragConsolidationToCanvas({ x: 600, y: 400 });
    cy.dragConnectionToCanvas({ x: 800, y: 200 });

    cy.get('button[aria-label="fit view"]').click();

    // Connect the nodes on the canvas.
    connectSourceViewToConsolidation();
    ConsolidationToConnection();

    for (let i = 0; i < 4; i++) {
      cy.get('button.react-flow__controls-button.react-flow__controls-zoomout').click();
    }

    // Fill in the details for the Source View card.
    fillSourceViewCard(testData.SourceViewName);
    cy.get('#selectAll').click();
    cy.contains('button', 'OK').click();

    // Fill in the details for the Connection card.
    FillConnectionCard('Connection', testData.connectionName);
    cy.wait(400)
    FillConnectionCard('Schema', testData.schemaName);
    cy.wait(400)
    FillConnectionCard('Table', testData.tableName);
    cy.wait(400)

    // Select all columns in the Connection card and confirm.
    cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
      .find('#selectAll')
      .should('be.visible')
      .first()
      .check({ force: true });

    cy.wait(400)
    cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
      .contains('button', 'OK')
      .should('be.visible')
      .first()
      .click({ force: true });

    // Open and fill the Consolidation (Join) modal.
    openConsolidationCard();
    fillConsolidationModal({
      left: testData.consolidationLeft,
      right: testData.consolidationRight,
      type: testData.consolidationType,
      operator: testData.consolidationOperator
    });
    
    // Proceed to the next step in the view creation process.
    cy.contains('button', 'Next')
      .should('be.visible')
      .click({ force: true });

    // Intercept the save view API call to verify its payload and response.
    cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');
    
    cy.contains('button', 'Create view').should('be.visible').click();

    // Wait for the modal, enter the view name, and save.
    cy.contains('h2', 'View Name').should('be.visible');
    cy.get('input[placeholder="Enter View Name"]')
      .should('be.visible')
      .type(testData.viewName);
    cy.contains('button', 'Save View').should('be.visible').click();
    cy.screenshot('sorurceview_to_connection_complex_end');
  });
});

