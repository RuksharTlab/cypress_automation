import 'cypress-xpath';
import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  FillUnionDetails,
  openConsolidationCard,
  fillSourceViewCard,
  verifyTableFilterResults
} from '../../../../support/federation_helpers';

// --- Test Steps ---
describe('Federation View Automation with Single Filter', () => {
  // Helper function to apply a single condition to a filter group
  const applyFilterGroup = (groupSelector, condition) => {
    // Validate condition object
    if (!condition || typeof condition !== 'object') {
      throw new Error(`Invalid condition object for ${groupSelector}: ${JSON.stringify(condition)}`);
    }
    if (!condition.column || !condition.value) {
      throw new Error(`Missing required properties in condition object for ${groupSelector}. Expected {column, value}, got: ${JSON.stringify(condition)}`);
    }

    // Wait for the group to be visible and stable
    cy.contains('div.border', groupSelector)
      .should('be.visible')
      .within(() => {
        // Wait for the condition container to be ready
        cy.get('div.bg-gray-50.p-2.rounded-lg')
          .first()
          .should('be.visible')
          .within(() => {
            // Select column with retry
            cy.get('select')
              .first()
              .should('be.visible')
              .select(condition.column, { force: true });

            // Select operator if present
            if (condition.operator) {
              cy.get('select')
                .eq(1)
                .should('be.visible')
                .select(condition.operator, { force: true });
            }

            // Handle different operators
            if (condition.operator === 'Between') {
              // Wait for both input fields to be ready
              cy.get('input[type="text"]')
                .first()
                .should('be.visible')
                .clear()
                .type(condition.value, { force: true });

              cy.get('input[type="text"]')
                .last()
                .should('be.visible')
                .clear()
                .type(condition.value2, { force: true });
            } else {
              // For other operators, just use the first input field
              cy.get('input[type="text"]')
                .first()
                .should('be.visible')
                .clear()
                .type(condition.value, { force: true });
            }
          });

        // Wait for any toast notifications to disappear
        cy.get('.Toastify__toast').should('not.exist');
      });
  };

  it('Performs TDF_22 create Union view', function () {
    cy.fixture('test-data/union/filter.json').then((data) => {
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
      cy.wait(500)
      FillConnectionCard('Schema', data.schemaName);
      cy.wait(500)
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

      // Apply the filter group using the fixture's mainGroupFilter
      applyFilterGroup('Main Group', data.mainGroupFilter);

      // 8. Apply the filter
      cy.contains('button', 'Apply Filters')
        .should('be.visible')
        .click({ force: true });

      // Intercept the save view API call to verify its payload and response.
      cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');

      
      //cy.screenshot('union');

      // Wait for the preview table to be visible and verify filter results
      cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');
      verifyTableFilterResults('div.bg-white.shadow.overflow-hidden.z-50', data.mainGroupFilter, undefined, 'union_filter_end');
    });
  });
});

