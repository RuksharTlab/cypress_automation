import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  fillConsolidationModal,
  openConsolidationCard,
  fillSourceViewCard,
  verifyTableFilterResults
} from '../../../../support/federation_helpers';

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

  beforeEach(() => {
    // Before each test, log in and navigate to the business view creation page
    cy.login();
    cy.navigateToCreateBusinessView();
  });

  it('Creates a federated view with a single filter and verifies the output', () => {
    // Load test data from fixture
    cy.fixture('test-data/filter.json').then((testData) => {
      // Get all variables from test data
      const {
        mainGroupFilter,
        assertionHeaders,
        SourceViewName,
        connectionName,
        schemaName,
        tableName,
        consolidationLeft,
        consolidationRight,
        consolidationType,
        consolidationOperator
      } = testData;

      // Debug logging
      cy.log('Test data loaded:', testData);

      // 1. Set up the federation canvas by dragging and dropping nodes
      cy.dragSourceViewToCanvas({ x: 200, y: 400 });
      cy.dragConsolidationToCanvas({ x: 600, y: 400 });
      cy.dragConnectionToCanvas({ x: 800, y: 200 });
      cy.get('button[aria-label="fit view"]').click();

      // 2. Connect the nodes on the canvas
      connectSourceViewToConsolidation();
      ConsolidationToConnection();

      // Zoom out to get a better view
      for (let i = 0; i < 3; i++) {
        cy.get('button.react-flow__controls-button.react-flow__controls-zoomout').click();
      }

      // 3. Configure the Source View node
      fillSourceViewCard(SourceViewName);
      cy.get('#selectAll').should('be.visible').click({ force: true });
      cy.contains('button', 'OK').should('be.visible').click({ force: true });

      // 4. Configure the Connection node
      FillConnectionCard('Connection', connectionName);
      FillConnectionCard('Schema', schemaName);
      FillConnectionCard('Table', tableName);
      cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection"))')
        .find('#selectAll')
        .first()
        .should('be.visible')
        .check({ force: true });
      cy.wait(400)
      cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection"))')
        .contains('button', 'OK')
        .first()
        .should('be.visible')
        .click({ force: true });

      // 5. Configure the Consolidation (Join) node
      openConsolidationCard();
      fillConsolidationModal({
        left: consolidationLeft,
        right: consolidationRight,
        type: consolidationType,
        operator: consolidationOperator
      });
      
      // 6. Proceed to the filter configuration step
      cy.contains('button', 'Next')
        .should('be.visible')
        .click({ force: true });
      cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');
      cy.contains('h2', 'Filter', { timeout: 10000 }).should('be.visible');

      // 7. Apply single condition to the main group
      applyFilterGroup('Main Group', mainGroupFilter);

      // 8. Apply the filter
      cy.contains('button', 'Apply Filters')
        .should('be.visible')
        .click({ force: true });

      // 9. Verify that the view was saved successfully
      cy.wait('@saveView').then((interception) => {
        expect(interception.request.body.joins).to.not.be.empty;
        expect(interception.response.statusCode).to.eq(200);
      });

      // 10. Verify the output preview data
      // Wait for any loading states to complete
      cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');
      // Use the reusable helper for table filter verification
      verifyTableFilterResults('div.bg-white.shadow.overflow-hidden.z-50', mainGroupFilter, undefined, 'filter_end');
    });
  });
});
