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
        // Load test data from fixture
        cy.fixture('test-data/groupby.json').then((testData) => {
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
          
          // Configure ID column
          const idColumn = columns.id;
          cy.get(`#${idColumn.id}`).check();
          cy.get(`#${idColumn.id}`).closest('.flex.justify-between').find('svg[name="edit"]').click();

          // Fill in the Column Settings based on test data
          cy.get('input[name="alias"]').type(idColumn.alias);
          cy.get('select[name="output"]').select(idColumn.output);
          cy.get('select[name="aggregate"]').select(idColumn.aggregate);
          cy.get('div.absolute').contains('button', 'OK').click({ force: true });

          cy.contains('button', 'OK').click();
      
          // Fill in the details for the Connection card.
          FillConnectionCard('Connection', connectionName);
          FillConnectionCard('Schema', schemaName);
          FillConnectionCard('Table', tableName);
      
          // Configure dept_id column settings
          /*const deptIdColumn = columns.dept_id;
          cy.get(`#${deptIdColumn.id}`).check();
          cy.get(`#${deptIdColumn.id}`).closest('.flex.justify-between').find('svg[name="edit"]').click();
          cy.get('input[name="order"]').clear().type(deptIdColumn.order);
          cy.get('select[name="sort"]').select(deptIdColumn.sort);
          cy.get('select[name="groupBy"]').select(deptIdColumn.groupBy);
          cy.get('div.absolute').contains('button', 'OK').click({ force: true });*/

          // Configure department column settings
          const departmentColumn = columns.department;
          cy.get(`#${departmentColumn.id}`).check();
          cy.get(`#${departmentColumn.id}`).closest('.flex.justify-between').find('svg[name="edit"]').click();
          cy.get('select[name="groupBy"]').select(departmentColumn.groupBy);
          cy.get('div.absolute').contains('button', 'OK').click({ force: true });
          
          
          
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

          // Verify the output preview data
          cy.get('div.bg-white.shadow.overflow-hidden.h-\\[32\\%\\].z-50', { timeout: 15000 })
            .should('be.visible')
            .within(() => {
              // Wait for table to be fully loaded
              cy.get('table.w-full').should('be.visible');
              cy.get('thead.sticky.top-0.bg-\\[\\#29304a\\].text-white tr').should('be.visible');
              
              // Add a small wait to ensure data is populated
              cy.wait(1000);
              
              // Verify headers
              cy.get('thead.sticky.top-0.bg-\\[\\#29304a\\].text-white tr')
                .should('be.visible')
                .within(() => {
                  // Get all headers
                  cy.get('th').should('exist');
                  
                  // Verify only the headers we care about from test data
                  Object.entries(assertionHeaders).forEach(([key, value]) => {
                    cy.get('th').then(($headers) => {
                      const headerTexts = $headers.map((_, el) => el.textContent).get();
                      // Debug log to see what headers we actually have
                      cy.log('Found headers:', headerTexts);
                      
                      // Convert both the expected value and actual headers to lowercase for comparison
                      const expectedValue = value.toLowerCase();
                      const found = headerTexts.some(text => {
                        const headerText = text.toLowerCase();
                        // Check for exact match, qualified name, or just the column name
                        const matches = headerText === expectedValue || 
                                      headerText.endsWith(`.${expectedValue}`) ||
                                      headerText === expectedValue.split('.').pop();
                        
                        if (matches) {
                          cy.log(`Found matching header: ${text} for value: ${value}`);
                        }
                        return matches;
                      });
                      expect(found, `Header containing "${value}" not found. Available headers: ${headerTexts.join(', ')}`).to.be.true;
                    });
                  });
                });
            });
        });
        cy.screenshot('groupby_end');
      });
  });