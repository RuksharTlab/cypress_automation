import 'cypress-xpath';
import {
  connectSourceViewToConsolidation,
  ConsolidationToConnection,
  FillConnectionCard,
  fillConsolidationModal,
  openConsolidationCard,
  fillSourceViewCard,
  validateFilterComplexData
} from '../../../../support/federation_helpers';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Load test data
let testData;
before(() => {
  cy.fixture('test-data/filter_and_operator_complex.json').then((data) => {
    testData = data;

  });
});

// --- Test Steps ---

describe('Federation View Automation', () => {
  it("Performs TDF_17.Join with filter and operator ('=' @ AND)", () => {
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
    cy.wait(500);
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

    // Click the code filter button and type the filter condition
    cy.get('button.p-1.rounded-md.hover\\:bg-gray-200:has(svg.lucide-file-code)').first().click();

    // Click the visible Ace Editor area to focus
    cy.get('#editor').click();
    // Dynamically construct the filter string with 2 conditions and consolidation operator
    let filterString;
    // Helper to quote string values
    const quoteIfString = v => (typeof v === 'string' && isNaN(Number(v))) ? `'${v}'` : v;
    
    // Construct first condition
    let condition1;
    if (testData.operator1 === 'BETWEEN') {
      condition1 = `${testData.column1} BETWEEN ${quoteIfString(testData.BetweenValue1)} and ${quoteIfString(testData.BetweenValue2)}`;
    } else if (testData.operator1 === 'LIKE') {
      condition1 = `${testData.column1} LIKE ${quoteIfString(testData.value1)}`;
    } else {
      condition1 = `${testData.column1} ${testData.operator1} ${quoteIfString(testData.value1)}`;
    }
    
    // Construct second condition
    let condition2;
    if (testData.operator2 === 'BETWEEN') {
      condition2 = `${testData.column2} BETWEEN ${quoteIfString(testData.BetweenValue1)} and ${quoteIfString(testData.BetweenValue2)}`;
    } else if (testData.operator2 === 'LIKE') {
      condition2 = `${testData.column2} LIKE ${quoteIfString(testData.value2)}`;
    } else {
      condition2 = `${testData.column2} ${testData.operator2} ${quoteIfString(testData.value2)}`;
    }
    
    // Combine conditions with consolidation operator
    filterString = `${testData.keyword} ${condition1} ${testData.consolidationFilterOperator} ${condition2}`;
    
    cy.get('#editor textarea.ace_text-input')
      .focus()
      .type(filterString, { force: true });
    cy.wait(1000)

    // Click the Save button in the Query Editor (robust selector, no numbers or special chars)
    cy.get('button').contains('Save').should('be.visible').click();
    
    // Proceed to the next step in the view creation process.
    cy.contains('button', 'Next')
      .should('be.visible')
      .click({ force: true });

    // Intercept the save view API call to verify its payload and response.
    cy.intercept('POST', '/api/api/v2/save-view?execute_query=true').as('saveView');
    
    // Validate the output table based on both filter conditions
    cy.get('table').should('be.visible').within(() => {
      cy.get('th').then(($headers) => {
        const headers = $headers.map((_, el) => el.textContent).get();
        const col1Index = headers.findIndex(h => h.toLowerCase().includes(testData.column1.split('.').pop().toLowerCase()));
        const col2Index = headers.findIndex(h => h.toLowerCase().includes(testData.column2.split('.').pop().toLowerCase()));
        expect(col1Index).to.not.equal(-1);
        expect(col2Index).to.not.equal(-1);

        cy.get('tbody tr').each(($row) => {
          cy.wrap($row).find('td').eq(col1Index).then(($cell1) => {
            const cellValue1 = $cell1.text().trim();
            let result1;
            if (testData.operator1 === 'BETWEEN') {
              result1 = checkCondition(cellValue1, testData.operator1, testData.BetweenValue1, testData.BetweenValue2);
            } else {
              result1 = checkCondition(cellValue1, testData.operator1, testData.value1);
            }
            
            cy.wrap($row).find('td').eq(col2Index).then(($cell2) => {
              const cellValue2 = $cell2.text().trim();
              let result2;
              if (testData.operator2 === 'BETWEEN') {
                result2 = checkCondition(cellValue2, testData.operator2, testData.BetweenValue1, testData.BetweenValue2);
              } else {
                result2 = checkCondition(cellValue2, testData.operator2, testData.value2);
              }
              
              // Both conditions must be true (AND logic)
              const finalResult = result1 && result2;
              let cond1Desc, cond2Desc;
              if (testData.operator1 === 'BETWEEN') {
                cond1Desc = `${testData.operator1} ${testData.BetweenValue1} and ${testData.BetweenValue2}`;
              } else {
                cond1Desc = `${testData.operator1} ${testData.value1}`;
              }
              if (testData.operator2 === 'BETWEEN') {
                cond2Desc = `${testData.operator2} ${testData.BetweenValue1} and ${testData.BetweenValue2}`;
              } else {
                cond2Desc = `${testData.operator2} ${testData.value2}`;
              }
              const errorMsg = `Row values: "${cellValue1}" and "${cellValue2}" did not satisfy conditions: ${cond1Desc} ${testData.consolidationFilterOperator} ${cond2Desc}`;
              
              if (!finalResult) {
                cy.log(errorMsg);
              } else {
                cy.log(`✓ Row values: "${cellValue1}" and "${cellValue2}" satisfied conditions: ${cond1Desc} ${testData.consolidationFilterOperator} ${cond2Desc}`);
              }
              expect(finalResult, errorMsg).to.be.true;
            });
          });
        });
      });
    });
    
    cy.screenshot('filter_and_operator_complex_end');
  });
});

// Add the checkCondition function at the end of the file
function checkCondition(value, operator, expectedValue, expectedValue2 = null) {
  // Remove quotes if present
  const stripQuotes = v => typeof v === 'string' && v.startsWith("'") && v.endsWith("'") ? v.slice(1, -1) : v;

  const op = operator.toUpperCase();

  if (op === 'LIKE') {
    const valueStr = value.toString().toLowerCase();
    const pattern = expectedValue.toString().toLowerCase();
    const parts = pattern.split('%');
    if (parts.length === 1 && parts[0] === '') {
      return true;
    }
    if (parts[0] !== '' && !valueStr.startsWith(parts[0])) {
      return false;
    }
    if (parts[parts.length - 1] !== '' && !valueStr.endsWith(parts[parts.length - 1])) {
      return false;
    }
    let currentIndex = 0;
    for (let i = 1; i < parts.length - 1; i++) {
      if (parts[i] === '') continue;
      const nextIndex = valueStr.indexOf(parts[i], currentIndex);
      if (nextIndex === -1) return false;
      currentIndex = nextIndex + parts[i].length;
    }
    return true;
  }

  const numericValue = parseFloat(value);
  const expected = parseFloat(expectedValue);
  const expected2 = expectedValue2 ? parseFloat(expectedValue2) : null;
  const bothNumbers = !isNaN(numericValue) && !isNaN(expected);

  switch (op) {
    case '=':
      if (bothNumbers) return Math.abs(numericValue - expected) < 0.0001;
      return stripQuotes(value) === stripQuotes(expectedValue);
    case '!=':
      if (bothNumbers) return Math.abs(numericValue - expected) >= 0.0001;
      return stripQuotes(value) !== stripQuotes(expectedValue);
    case '>':
      if (bothNumbers) return numericValue > expected;
      return stripQuotes(value) > stripQuotes(expectedValue);
    case '<':
      if (bothNumbers) return numericValue < expected;
      return stripQuotes(value) < stripQuotes(expectedValue);
    case '>=':
      if (bothNumbers) return numericValue >= expected;
      return stripQuotes(value) >= stripQuotes(expectedValue);
    case '<=':
      if (bothNumbers) return numericValue <= expected;
      return stripQuotes(value) <= stripQuotes(expectedValue);
    case 'BETWEEN':
      if (!expectedValue2) throw new Error('Between operator requires two values');
      if (bothNumbers && !isNaN(expected2)) return numericValue >= expected && numericValue <= expected2;
      // String range comparison
      return stripQuotes(value) >= stripQuotes(expectedValue) && stripQuotes(value) <= stripQuotes(expectedValue2);
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}