import 'cypress-xpath';
import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  fillConsolidationModal,
  openConsolidationCard,
  fillSourceViewCard
} from '../../../../support/federation_helpers';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Load test data
let testData;
before(() => {
  cy.fixture('test-data/groupby_multiple_complex.json').then((data) => {
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
    // Configure the Source View column
    cy.get(`#${testData.groupbycolumn1}`).check();
    cy.get(`#${testData.groupbycolumn1}`).closest('.flex.justify-between').find('svg[name="edit"]').click();
    cy.get('input[name="alias"]').type(testData.alias1);
    cy.get('select[name="output"]').select(testData.output1);
    cy.get('select[name="aggregate"]').select(testData.aggregate1);
    cy.get('div.absolute').contains('button', 'OK').click({ force: true });
    cy.contains('button', 'OK').click();

    // Fill in the details for the Connection card.
    FillConnectionCard('Connection', testData.connectionName);
    FillConnectionCard('Schema', testData.schemaName);
    cy.wait(500)
    FillConnectionCard('Table', testData.tableName);
    // Select only the specified column in the Connection card
    cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
      .find(`#${testData.groupbycolumn2}`)
      .check({ force: true });

      cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
      .find(`#${testData.groupbycolumn3}`)
      .check({ force: true });
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

    // Click the code filter button and type the group by statement
    cy.get('button.p-1.rounded-md.hover\\:bg-gray-200:has(svg.lucide-file-code)').first().click();
    cy.get('#editor').click();
    const groupByString = `${testData.keyword} ${testData.connectionName}_${testData.schemaName}_${testData.tableName}.${testData.groupbycolumn2},${testData.connectionName}_${testData.schemaName}_${testData.tableName}.${testData.groupbycolumn3}`;
    cy.get('#editor textarea.ace_text-input')
      .focus()
      .type(groupByString, { force: true });
    cy.wait(1000);
    cy.screenshot("groupby_strings")

    // Click the Save button in the Query Editor
    cy.get('button').contains('Save').should('be.visible').click();

    // Proceed to the next step in the view creation process.
    cy.contains('button', 'Next')
      .should('be.visible')
      .click({ force: true });

    // Intercept the save view API call to verify its payload and response.
    cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');
    
    // Validate output headers
    cy.get('div.bg-white.shadow.overflow-hidden.h-\\[32\\%\\].z-50', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.get('table.w-full').should('be.visible');
        cy.get('thead.sticky.top-0.bg-\\[\\#29304a\\].text-white tr').should('be.visible');
        cy.wait(1000);
        cy.get('thead.sticky.top-0.bg-\\[\\#29304a\\].text-white tr')
          .should('be.visible')
          .within(() => {
            cy.get('th').should('exist');
            Object.entries(testData.assertionHeaders).forEach(([key, value]) => {
              cy.get('th').then(($headers) => {
                const headerTexts = $headers.map((_, el) => el.textContent).get();
                cy.log('Found headers:', headerTexts);
                const expectedValue = value.toLowerCase();
                const found = headerTexts.some(text => {
                  const headerText = text.toLowerCase();
                  const matches = headerText === expectedValue || 
                                  headerText.endsWith(`.${expectedValue}`) ||
                                  headerText === expectedValue.split('.').pop();
                  if (matches) {
                    cy.log(`Found matching header: ${text} for value: ${value}`);
                  }
                  return matches;
                });
                expect(found, `Header containing \"${value}\" not found. Available headers: ${headerTexts.join(', ')}`).to.be.true;
              });
            });
          });
      });
      cy.screenshot('groupby_multiple_complex_end');
});
});