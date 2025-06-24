import {
    connectSourceViewToConsolidation,
    ConsolidationToConnection,
    FillConnectionCard,
    fillConsolidationModal,
    openConsolidationCard,
    fillSourceViewCard
  } from '../../../../support/federation_helpers';
  
  // --- Test Steps ---
  
  describe('Federation View Automation with orderby', () => {
      it('Performs federation view actions', () => {
        // Load test data from fixture
        cy.fixture('test-data/orderby.json').then((testData) => {
          // Get all variables from test data
          const {
            SourceViewName,
            connectionName,
            schemaName,
            tableName,
            consolidationLeft,
            consolidationRight,
            consolidationType,
            consolidationOperator,
            columns,
            assertionHeaders
          } = testData;

          // Debug logging
          cy.log('Test data loaded:', testData);

          // Log in and navigate to the create business view page.
          cy.login();
          cy.navigateToCreateBusinessView();
      
          // Drag and drop the required nodes onto the canvas.
          cy.dragSourceViewToCanvas({ x: 200, y: 400 });
          cy.dragConsolidationToCanvas({ x: 600, y: 400 });
          cy.dragConnectionToCanvas({ x: 800, y: 200 });
      
          // Zoom out and fit the view to see all nodes.
          const clicks = 6;
          for (let i = 0; i < clicks; i++) {
            cy.get('button.react-flow__controls-button.react-flow__controls-zoomout').click();
          }
          cy.get('button[aria-label="fit view"]').click();
      
          // Connect the nodes on the canvas.
          connectSourceViewToConsolidation();
          ConsolidationToConnection();

          // Zoom out to get a better view.
          for (let i = 0; i < 3; i++) {
            cy.get('button.react-flow__controls-button.react-flow__controls-zoomout').click();
        }
      
          // Fill in the details for the Source View card.
          fillSourceViewCard(SourceViewName);
          cy.get('#selectAll').click();
          cy.wait(500);
          
          // Configure orderby column settings
          const orderbyColumn = testData.orderbyColumn;
          cy.get(`#${orderbyColumn}`).check();
          cy.get(`#${orderbyColumn}`).closest('.flex.justify-between').find('svg[name="edit"]').click();
          cy.get('input[name="order"]').clear().type('1');
          cy.wait(1000)
          cy.get('select[name="sort"]').select(testData.orderby);
          cy.get('div.absolute').contains('button', 'OK').click({ force: true });
          
          cy.contains('button', 'OK').click();
      
          
      
          // Fill in the details for the Connection card.
          FillConnectionCard('Connection', connectionName);
          FillConnectionCard('Schema', schemaName);
          FillConnectionCard('Table', tableName);
          
          // Select all columns in the Connection card and confirm.
          cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
            .find('#selectAll')
            .should('be.visible')
            .first()
            .check({ force: true });
          cy.wait(400);
          cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)')
            .contains('button', 'OK')
            .should('be.visible')
            .first()
            .click({ force: true });
      
          
      
          // Open and fill the Consolidation (Join) modal.
          openConsolidationCard();
          fillConsolidationModal({
            left: consolidationLeft,
            right: consolidationRight,
            type: consolidationType,
            operator: consolidationOperator
          });
          
          // Proceed to the next step in the view creation process.
          cy.contains('button', 'Next')
            .should('be.visible')
            .click({ force: true });
            
          // Skip the optional step.
          cy.contains('button', 'Skip')
            .should('be.visible')
            .click({ force: true });

          // Validate the output table is sorted correctly
          cy.get('table').should('be.visible').within(() => {
            cy.get('th').then(($headers) => {
              const headers = $headers.map((_, el) => el.textContent).get();
              const colIndex = headers.findIndex(h => h.toLowerCase().includes(testData.orderbyColumn.toLowerCase()));
              expect(colIndex).to.not.equal(-1);

              // Get all values in the orderby column
              const columnValues = [];
              cy.get('tbody tr').each(($row) => {
                cy.wrap($row).find('td').eq(colIndex).then(($cell) => {
                  const cellValue = $cell.text().trim();
                  columnValues.push(parseFloat(cellValue) || cellValue);
                });
              }).then(() => {
                // Check if values are sorted in descending order
                const isDescending = columnValues.every((val, index) => {
                  if (index === 0) return true;
                  return val <= columnValues[index - 1];
                });
                
                if (testData.orderby === 'Descending') {
                  expect(isDescending, `Values in column ${testData.orderbyColumn} are not sorted in descending order: ${columnValues.join(', ')}`).to.be.true;
                  cy.log(`✓ Column ${testData.orderbyColumn} is correctly sorted in descending order: ${columnValues.join(', ')}`);
                } else if (testData.orderby === 'Ascending') {
                  const isAscending = columnValues.every((val, index) => {
                    if (index === 0) return true;
                    return val >= columnValues[index - 1];
                  });
                  expect(isAscending, `Values in column ${testData.orderbyColumn} are not sorted in ascending order: ${columnValues.join(', ')}`).to.be.true;
                  cy.log(`✓ Column ${testData.orderbyColumn} is correctly sorted in ascending order: ${columnValues.join(', ')}`);
                }
              });
            });
          });

          cy.screenshot('orderby_end');

        });
    });
});