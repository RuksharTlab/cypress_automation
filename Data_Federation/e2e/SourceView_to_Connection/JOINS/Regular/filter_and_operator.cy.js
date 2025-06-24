import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  fillConsolidationModal,
  openConsolidationCard,
  fillSourceViewCard
} from '../../../../support/federation_helpers';

describe('Federation View Automation with Multiple Conditions in Single Group', () => {
  // Helper function to apply a single condition to a filter group.
  const applyFilterGroup = (groupSelector, condition) => {
    // Validate condition object
    if (!condition || typeof condition !== 'object') {
      throw new Error(`Invalid condition object for ${groupSelector}: ${JSON.stringify(condition)}`);
    }
    if (!condition.column || !condition.value) {
      throw new Error(`Missing required properties in condition object for ${groupSelector}. Expected {column, value}, got: ${JSON.stringify(condition)}`);
    }

    cy.log('Applying filter group:', { groupSelector, condition });

    cy.contains('div.border', groupSelector).within(() => {
      // Set the condition in the group.
      cy.get('div.bg-gray-50.p-2.rounded-lg').first().within(() => {
          cy.get('select').first().select(condition.column);
          if (condition.operator) {
            cy.get('select').eq(1).select(condition.operator);
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

  // Helper function to add a second condition to a group
  const addSecondCondition = (groupSelector, condition) => {
    cy.log('Adding second condition:', { groupSelector, condition });

    cy.contains('div.border', groupSelector).within(() => {
      // Click the + Condition button
      cy.contains('button', '+ Condition').click();

      // Set the second condition
      cy.get('div.bg-gray-50.p-2.rounded-lg').last().within(() => {
        cy.get('select').first().select(condition.column);
        if (condition.operator) {
          cy.get('select').eq(1).select(condition.operator);
        }
        cy.get('input[type="text"]').type(condition.value);
      });

      // Wait for any toast notifications to disappear
      cy.get('.Toastify__toast').should('not.exist');
    });
  };

  beforeEach(() => {
    // Before each test, log in and navigate to the business view creation page.
    cy.log('Starting test: Logging in and navigating to business view creation');
    cy.login();
    cy.navigateToCreateBusinessView();
  });

  it('Creates a federated view with multiple conditions in a single group and verifies the output', () => {
    // Load test data from fixture
    cy.log('Loading test data from fixture');
    cy.fixture('test-data/filter_and_operator.json').then((testData) => {
      // Get all variables from test data
      const {
        mainGroupFilter,
        mainGroupSecondFilter,
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

      // 1. Set up the federation canvas by dragging and dropping nodes.
      cy.log('Step 1: Setting up federation canvas');
      cy.dragSourceViewToCanvas({ x: 200, y: 400 });
      cy.dragConsolidationToCanvas({ x: 600, y: 400 });
      cy.dragConnectionToCanvas({ x: 800, y: 200 });
      cy.get('button[aria-label="fit view"]').click();

      // 2. Connect the nodes on the canvas.
      cy.log('Step 2: Connecting nodes');
      connectSourceViewToConsolidation();
      ConsolidationToConnection();

      // Zoom out to get a better view.
      for (let i = 0; i < 3; i++) {
        cy.get('button.react-flow__controls-button.react-flow__controls-zoomout').click();
      }

      // 3. Configure the Source View node.
      cy.log('Step 3: Configuring Source View');
      fillSourceViewCard(SourceViewName);
      cy.get('#selectAll').click();
      cy.contains('button', 'OK').click();

      // 4. Configure the Connection node.
      cy.log('Step 4: Configuring Connection');
      FillConnectionCard('Connection', connectionName);
      cy.wait(1000);
      FillConnectionCard('Schema', schemaName);
      cy.wait(1000);
      FillConnectionCard('Table', tableName);
      cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection"))').find('#selectAll').first().check({ force: true });
      cy.wait(1000);
      cy.get('div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection"))').contains('button', 'OK').first().click({ force: true });

      // 5. Configure the Consolidation (Join) node.
      cy.log('Step 5: Configuring Consolidation');
      openConsolidationCard();
      fillConsolidationModal({
        left: consolidationLeft,
        right: consolidationRight,
        type: consolidationType,
        operator: consolidationOperator
      });
      
      // 6. Proceed to the filter configuration step.
      cy.log('Step 6: Moving to filter configuration');
      cy.contains('button', 'Next').should('be.visible').click({ force: true });
      cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');
      cy.contains('h2', 'Filter', { timeout: 10000 }).should('be.visible');

      // 7. Apply first condition to the main group
      cy.log('Step 7: Applying first filter condition');
      applyFilterGroup('Main Group', mainGroupFilter);

      // 8. Add second condition to the main group
      cy.log('Step 8: Adding second filter condition');
      addSecondCondition('Main Group', mainGroupSecondFilter);

      // Set the group operator
      cy.log('Setting group operator:', groupFilterOperator);
      cy.get('div.flex.items-center.h-10 select.border.rounded.px-2.py-1.text-xs.bg-white.text-black')
        .should('be.visible')
        .select(groupFilterOperator);

      // 9. Apply the filters
      cy.log('Step 9: Applying filters');
      cy.contains('button', 'Apply Filters').click();

      // 10. Verify that the view was saved successfully.
      cy.log('Step 10: Verifying view save');
      cy.wait('@saveView').then((interception) => {
        expect(interception.request.body.joins).to.not.be.empty;
        expect(interception.response.statusCode).to.eq(200);
      });

      // 11. Verify the output preview data
      cy.log('Step 11: Verifying output preview');
      // Wait for any loading states to complete
      cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');
      
      // Wait for the preview table to be visible
      cy.get('div.bg-white.shadow.overflow-hidden.h-\\[32\\%\\].z-50', { timeout: 15000 })
        .should('be.visible')
        .within(() => {
          // Wait for table to be fully loaded
          cy.get('table.w-full').should('be.visible');
          cy.get('thead.sticky.top-0.bg-\\[\\#29304a\\].text-white tr').should('be.visible');
          
          // Add a small wait to ensure data is populated
          cy.wait(1000);
          
          // Verify table structure
          cy.get('table.w-full').should('be.visible');
          
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

          // Verify table body
          cy.get('tbody.text-sm').should('be.visible');
          
          // Verify rows have correct structure
          cy.get('tbody tr.border-b.bg-white').should('have.length.at.least', 1);
          
          // First get all headers to find column indices
          cy.get('thead.sticky.top-0.bg-\\[\\#29304a\\].text-white tr')
            .should('be.visible')
            .find('th')
            .should('exist')
            .then(($headers) => {
              const headers = $headers.map((_, el) => el.textContent).get();
              const firstColumnName = mainGroupFilter.column.split('.').pop();
              const secondColumnName = mainGroupSecondFilter.column.split('.').pop();
              
              // Log all found headers
              cy.log('All table headers:', headers);
              cy.log('Looking for columns:', { firstColumnName, secondColumnName });
              
              // Find column indices by exact match or qualified name
              const firstColIndex = headers.findIndex(h => {
                const headerText = h.toLowerCase();
                return headerText === firstColumnName.toLowerCase() || 
                       headerText.endsWith(`.${firstColumnName.toLowerCase()}`);
              });
              
              const secondColIndex = headers.findIndex(h => {
                const headerText = h.toLowerCase();
                return headerText === secondColumnName.toLowerCase() || 
                       headerText.endsWith(`.${secondColumnName.toLowerCase()}`);
              });
              
              // Log the found indices and their corresponding headers
              cy.log('Column indices found:', {
                firstColumn: {
                  name: firstColumnName,
                  index: firstColIndex,
                  header: firstColIndex !== -1 ? headers[firstColIndex] : 'not found'
                },
                secondColumn: {
                  name: secondColumnName,
                  index: secondColIndex,
                  header: secondColIndex !== -1 ? headers[secondColIndex] : 'not found'
                }
              });

              // Verify we found both columns
              expect(firstColIndex, `Could not find column ${firstColumnName}`).to.not.equal(-1);
              expect(secondColIndex, `Could not find column ${secondColumnName}`).to.not.equal(-1);
              
              // Then verify each row's data
              cy.get('tbody tr').each(($row, index) => {
                cy.wrap($row)
                  .should('exist')
                  .within(() => {
                    // Get first column value
                    cy.get('td').eq(firstColIndex).invoke('text').then((text1) => {
                      const value1 = text1.trim();
                      // Get second column value
                      cy.get('td').eq(secondColIndex).invoke('text').then((text2) => {
                        const value2 = text2.trim();

                        // Debug logging for values
                        cy.log('Row values:', {
                          rowIndex: index + 1,
                          value1,
                          value2,
                          firstCondition: {
                            operator: mainGroupFilter.operator,
                            value: mainGroupFilter.value,
                            value2: mainGroupFilter.value2
                          },
                          secondCondition: {
                            operator: mainGroupSecondFilter.operator,
                            value: mainGroupSecondFilter.value,
                            value2: mainGroupSecondFilter.value2
                          }
                        });

                        // Check first condition
                        const firstConditionSatisfied = checkCondition(
                          value1,
                          mainGroupFilter.operator,
                          mainGroupFilter.value,
                          mainGroupFilter.value2
                        );

                        // Check second condition
                        const secondConditionSatisfied = checkCondition(
                          value2,
                          mainGroupSecondFilter.operator,
                          mainGroupSecondFilter.value,
                          mainGroupSecondFilter.value2
                        );

                        // Debug logging for condition results
                        cy.log('Condition results:', {
                          rowIndex: index + 1,
                          firstConditionSatisfied,
                          secondConditionSatisfied,
                          groupOperator: groupFilterOperator
                        });

                        // Apply group operator (AND/OR)
                        const finalResult = groupFilterOperator === 'OR'
                          ? firstConditionSatisfied || secondConditionSatisfied
                          : firstConditionSatisfied && secondConditionSatisfied;

                        // Assert based on group operator
                        if (groupFilterOperator === 'OR') {
                          expect(finalResult, 
                            `Neither condition satisfied for row ${index + 1}. Values: ${value1}, ${value2}. First condition (${mainGroupFilter.operator} ${mainGroupFilter.value}): ${firstConditionSatisfied}, Second condition (${mainGroupSecondFilter.operator} ${mainGroupSecondFilter.value}): ${secondConditionSatisfied}`).to.be.true;
                        } else {
                          expect(finalResult,
                            `Not all conditions satisfied for row ${index + 1}. Values: ${value1}, ${value2}. First condition (${mainGroupFilter.operator} ${mainGroupFilter.value}): ${firstConditionSatisfied}, Second condition (${mainGroupSecondFilter.operator} ${mainGroupSecondFilter.value}): ${secondConditionSatisfied}`).to.be.true;
                        }
                      });
                    });
                  });
              });

            });
        });
        cy.screenshot('filter_and_operator_end');
    });
  });
});

// Helper function to check if a value satisfies a condition
function checkCondition(value, operator, expectedValue, expectedValue2 = null) {
  // For string comparisons (LIKE operator)
  if (operator === 'LIKE') {
    const valueStr = value.toString().toLowerCase();
    const pattern = expectedValue.toString().toLowerCase();
    
    // Split the pattern by % to get the parts we need to match
    const parts = pattern.split('%');
    
    // If pattern is just %, it matches everything
    if (parts.length === 1 && parts[0] === '') {
      return true;
    }
    
    // Check if the value starts with the first part (if it's not empty)
    if (parts[0] !== '' && !valueStr.startsWith(parts[0])) {
      return false;
    }
    
    // Check if the value ends with the last part (if it's not empty)
    if (parts[parts.length - 1] !== '' && !valueStr.endsWith(parts[parts.length - 1])) {
      return false;
    }
    
    // Check all middle parts are present in order
    let currentIndex = 0;
    for (let i = 1; i < parts.length - 1; i++) {
      if (parts[i] === '') continue; // Skip empty parts
      const nextIndex = valueStr.indexOf(parts[i], currentIndex);
      if (nextIndex === -1) return false;
      currentIndex = nextIndex + parts[i].length;
    }
    
    return true;
  }

  // For numeric comparisons
  const numericValue = parseFloat(value);
  const expected = parseFloat(expectedValue);
  const expected2 = expectedValue2 ? parseFloat(expectedValue2) : null;

  // Check if the value is a valid number
  if (isNaN(numericValue)) {
    return false;
  }

  switch (operator) {
    case '>':
      return numericValue > expected;
    case '<':
      return numericValue < expected;
    case '=':
      return Math.abs(numericValue - expected) < 0.0001; // Handle floating point comparison
    case '!=':
      return Math.abs(numericValue - expected) >= 0.0001; // Handle floating point comparison
    case '>=':
      return numericValue >= expected;
    case '<=':
      return numericValue <= expected;
    case 'Between':
      if (!expectedValue2) {
        throw new Error('Between operator requires two values');
      }
      return numericValue >= expected && numericValue <= expected2;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
