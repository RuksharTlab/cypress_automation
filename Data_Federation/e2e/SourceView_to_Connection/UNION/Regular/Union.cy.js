import 'cypress-xpath';
import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  FillUnionDetails,
  openConsolidationCard,
  fillSourceViewCard
} from '../../../../support/federation_helpers';



// --- Test Steps ---

describe('Federation View Automation', () => {
  it('Performs TDF_22 create Union view', function () {
    cy.fixture('test-data/union/union.json').then((data) => {
      // Log in and navigate to the create business view page.
      cy.login();
      cy.navigateToCreateBusinessView();

      

      // Drag and drop the required nodes onto the canvas.
      cy.dragSourceViewToCanvas({ x: 200, y: 400 });
      cy.dragConsolidationToCanvas({ x: 600, y: 400 });
      cy.dragConnectionToCanvas({ x: 800, y: 200 });

      
      cy.get('button[aria-label="fit view"]').click();

      // Connect the nodes on the canvas.
      connectSourceViewToConsolidation();
      ConsolidationToConnection();
      

      // Fill in the details for the Source View card.
      fillSourceViewCard(data.SourceViewName);
      cy.get('#selectAll').click();
      cy.contains('button', 'OK').click();

      // Fill in the details for the Connection card.
      FillConnectionCard('Connection', data.connectionName);
      FillConnectionCard('Schema', data.schemaName);
      FillConnectionCard('Table', data.tableName);

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
      FillUnionDetails();
      
      // Skip the optional step.
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
        .type(data.viewName);
      cy.contains('button', 'Save View').should('be.visible').click();
      cy.screenshot('union');

    
    });
  });
});

