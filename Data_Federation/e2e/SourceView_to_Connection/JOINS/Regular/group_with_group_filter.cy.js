import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  fillConsolidationModal,
  openConsolidationCard,
  fillSourceViewCard
} from '../../../../support/federation_helpers';

describe('Federation View Automation', () => {

  // Helper function to apply a single condition to a filter group.
  const applyFilterGroup = (groupSelector, condition) => {
    // Validate condition object
    if (!condition || typeof condition !== 'object') {
      throw new Error(`Invalid condition object for ${groupSelector}: ${JSON.stringify(condition)}`);
    }
    if (!condition.column || !condition.value) {
      throw new Error(`Missing required properties in condition object for ${groupSelector}. Expected {column, value}, got: ${JSON.stringify(condition)}`);
    }

    cy.contains('div.border', groupSelector).within(() => {
      // Set the condition in the group.
      cy.get('div.bg-gray-50.p-2.rounded-lg').first().within(() => {
          cy.get('select').select(condition.column);
          cy.get('input[type="text"]').type(condition.value);
      });

      // Wait for any toast notifications to disappear
      cy.get('.Toastify__toast').should('not.exist');
    });
  };

  beforeEach(() => {
    // Before each test, log in and navigate to the business view creation page.
    cy.login();
    cy.navigateToCreateBusinessView();
  });

  it('Creates a federated view with grouped filters and verifies the output', () => {
    // Load test data from fixture
    cy.fixture('test-data/group_with_group_filter.json').then((testData) => {
      // Get all variables from test data
      const {
        mainGroupFilter,
        secondGroupFilter,
        thirdGroupFilter,
        fourthGroupFilter,
        groupFilterOperator,
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
      cy.log('Filter variables:', {
        mainGroupFilter,
        secondGroupFilter,
        thirdGroupFilter,
        fourthGroupFilter
      });

      // Verify environment variables are loaded
      expect(mainGroupFilter).to.exist;
      expect(mainGroupFilter).to.have.property('column');
      expect(mainGroupFilter).to.have.property('value');
      expect(secondGroupFilter).to.exist;
      expect(secondGroupFilter).to.have.property('column');
      expect(secondGroupFilter).to.have.property('value');

      // 1. Set up the federation canvas by dragging and dropping nodes.
      cy.dragSourceViewToCanvas({ x: 200, y: 400 });
      cy.dragConsolidationToCanvas({ x: 600, y: 400 });
      cy.dragConnectionToCanvas({ x: 800, y: 200 });
      cy.get('button[aria-label="fit view"]').click();

      // 2. Connect the nodes on the canvas.
      connectSourceViewToConsolidation();
      ConsolidationToConnection();

      // Zoom out to get a better view.
      for (let i = 0; i < 3; i++) {
        cy.get('button.react-flow__controls-button.react-flow__controls-zoomout').click();
      }

      // 3. Configure the Source View node.
      fillSourceViewCard(SourceViewName);
      cy.get('#selectAll').click();
      cy.contains('button', 'OK').click();

      // 4. Configure the Connection node.
      FillConnectionCard('Connection', connectionName);
      FillConnectionCard('Schema', schemaName);
      FillConnectionCard('Table', tableName);
      cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection"))').find('#selectAll').first().check({ force: true });
      cy.wait(500)
      cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection"))').contains('button', 'OK').first().click({ force: true });

      // 5. Configure the Consolidation (Join) node.
      openConsolidationCard();
      fillConsolidationModal({
        left: consolidationLeft,
        right: consolidationRight,
        type: consolidationType,
        operator: consolidationOperator
      });
      
      // 6. Proceed to the filter configuration step.
      cy.contains('button', 'Next').should('be.visible').click({ force: true });
      cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');
      cy.contains('h2', 'Filter', { timeout: 10000 }).should('be.visible');

      // 7. Apply filters to the main group and a new second group.
      applyFilterGroup('Main Group', mainGroupFilter);
      cy.screenshot('7-main-group-filters-applied');
      cy.contains('button', '+Add New Group').click();
      applyFilterGroup('Group 2', secondGroupFilter);
      cy.contains('button', 'Apply Filters').click();

      // 8. Verify that the view was saved successfully.
      cy.wait('@saveView').then((interception) => {
        expect(interception.request.body.joins).to.not.be.empty;
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.screenshot('group_with_group_filter_end');
    });
  });
});