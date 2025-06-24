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
  cy.fixture('test-data/filter_complex.json').then((data) => {
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
    // Dynamically construct the filter string based on the operator
    let filterString;
    // Helper to quote string values
    const quoteIfString = v => (typeof v === 'string' && isNaN(Number(v))) ? `'${v}'` : v;
    if (testData.operator === 'BETWEEN') {
      filterString = `${testData.keyword} ${testData.column} BETWEEN ${quoteIfString(testData.value)} and ${quoteIfString(testData.value2)}`;
    } else if (testData.operator === 'LIKE') {
      filterString = `${testData.keyword} ${testData.column} LIKE ${quoteIfString(testData.value)}`;
    } else {
      filterString = `${testData.keyword} ${testData.column} ${testData.operator} ${quoteIfString(testData.value)}`;
    }
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
    
    /*cy.contains('button', 'Create view').should('be.visible').click();

    // Wait for the modal, enter the view name, and save.
    cy.contains('h2', 'View Name').should('be.visible');
    cy.get('input[placeholder="Enter View Name"]')
      .should('be.visible')
      .type(testData.viewName);
    cy.contains('button', 'Save View').should('be.visible').click();*/

    // After proceeding to the next step, validate the output table based on the filter
    // Wait for the preview table to be visible
    cy.get('table').should('be.visible').within(() => {
      cy.get('th').then(($headers) => {
        const headers = $headers.map((_, el) => el.textContent).get();
        const colIndex = headers.findIndex(h => h.toLowerCase().includes(testData.column.split('.').pop().toLowerCase()));
        expect(colIndex).to.not.equal(-1);

        cy.get('tbody tr').each(($row) => {
          cy.wrap($row).find('td').eq(colIndex).then(($cell) => {
            const cellValue = $cell.text().trim();
            let result, errorMsg;
            if (testData.operator.toUpperCase() === 'BETWEEN') {
              result = checkCondition(
                cellValue,
                testData.operator,
                testData.value,
                testData.value2
              );
              errorMsg = `Row value: "${cellValue}" did not satisfy condition: ${testData.operator} ${testData.value} and ${testData.value2}`;
            } else {
              result = checkCondition(
                cellValue,
                testData.operator,
                testData.value
              );
              errorMsg = `Row value: "${cellValue}" did not satisfy condition: ${testData.operator} ${testData.value}`;
            }
            if (!result) {
              cy.log(errorMsg);
            } else {
              cy.log(`Row value: "${cellValue}" satisfied condition: ${testData.operator} ${testData.value}`);
            }
            expect(result, errorMsg).to.be.true;
          });
        });
      });
    });
    cy.screenshot('filter_complex_end');
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

