import 'cypress-xpath';

// --- Helper Functions ---

// Connects the 'Source View' node to the 'Consolidation' (purple network) node on the canvas.
export function connectSourceViewToConsolidation() {
  const sourceNodeContainerSelector = 'div:has(h3:contains("Source View")):has(svg.lucide-square-kanban)';
  const targetNodeContainerSelector = 'div.bg-\\[\\#8E77BB\\].rounded-full:has(svg.lucide.lucide-network)';
  const sourceHandlePosition = 'right';
  const targetHandlePosition = 'left';
  cy.log('Attempting to connect "Source View" to "Purple Network Node"...');
  cy.log(`Source: "${sourceNodeContainerSelector}" (handle: ${sourceHandlePosition})`);
  cy.log(`Target: "${targetNodeContainerSelector}" (handle: ${targetHandlePosition})`);
  cy.connectNodes(
    sourceNodeContainerSelector,
    sourceHandlePosition,
    targetNodeContainerSelector,
    targetHandlePosition
  );
}

// Connects the 'Consolidation' (purple network) node to the 'Connection' node on the canvas.
export function ConsolidationToConnection() {
  const sourceNodeContainerSelector = 'div.bg-\\[\\#8E77BB\\].rounded-full:has(svg.lucide.lucide-network)';
  const targetNodeContainerSelector = 'div.bg-white.rounded-lg.p-4.shadow-lg:has(h3:contains("Connection")):has(svg.lucide-cable)';
  const sourceHandlePosition = 'right';
  const targetHandlePosition = 'left';
  cy.log('Attempting to connect "Consolidation" to "Connection"...');
  cy.log(`Source: "${sourceNodeContainerSelector}" (handle: ${sourceHandlePosition})`);
  cy.log(`Target: "${targetNodeContainerSelector}" (handle: ${targetHandlePosition})`);
  cy.connectNodes(
    sourceNodeContainerSelector,
    sourceHandlePosition,
    targetNodeContainerSelector,
    targetHandlePosition
  );
}

// Helper for selecting an item from a dropdown in the Connection node.
export function FillConnectionCard(labelText, itemToSelect) {
  cy.wait(500);
  cy.contains('div.cursor-pointer', `Select a ${labelText.toLowerCase()}`)
    .should('be.visible')
    .then($el => $el[0].click());
  cy.get('div.absolute.z-10.w-full.mt-1.bg-white.border.rounded-lg.shadow-lg', { timeout: 7000 })
    .should('be.visible')
    .then($panel => {
      cy.wrap($panel).find('input[type="text"]')
        .should('be.visible')
        .then($input => {
          $input.val(itemToSelect);
          $input[0].dispatchEvent(new Event('input', { bubbles: true }));
        });
      cy.wait(200);
      cy.wrap($panel)
        .contains('div.p-2.cursor-pointer', new RegExp(`^${itemToSelect}$`))
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    });
}

// Helper to fill the Consolidation modal by selecting 'Join' and filling all dropdowns.
export function fillConsolidationModal({ left, right, type, operator }) {
  cy.contains('button', 'Join').should('be.visible').click({ force: true });
  cy.get('label').contains('Left').parent().find('select').select(left);
  cy.get('label').contains('Right').parent().find('select').select(right);
  cy.get('label').contains('Type').parent().find('select').select(type);
  cy.get('label').contains('Operator').parent().find('select').select(operator);
  cy.contains('button', 'Save').should('be.visible').click();
  cy.contains('h3', 'Consolidation').should('not.exist');
}


// Helper to open the Consolidation card by clicking the purple network node.
export function openConsolidationCard() {
  cy.get('div.bg-\\[\\#8E77BB\\].rounded-full.p-6.shadow-lg.relative.group.flex.justify-center')
    .scrollIntoView()
    .find('svg.lucide-network')
    .click({ force: true });
  cy.wait(500);
  cy.contains('h3', 'Consolidation', { timeout: 7000 }).should('be.visible');
}

// Helper to fill the Source View card by selecting a view.
export function fillSourceViewCard(viewToSelect) {
  cy.xpath("//div[span[text()='Select View']]").click();
  cy.get('div.absolute.z-10.w-full').should('be.visible');
  cy.xpath(`//div[contains(@class, 'max-h-60')]/div[text()='${viewToSelect}']`).click();
  //cy.contains('button', 'OK').click();
}

// Helper to handle the Union modal: click Union, select Union radio, select all columns, and click Next.
export function FillUnionDetails() {
  // Click the "Union" tab/button
  cy.contains('button', 'Union').should('be.visible').click({ force: true });

  // Click the "Union" radio/option (left one)
  cy.contains('div', /^Union$/)
    .should('be.visible')
    .parent()
    .find('svg.lucide-circle')
    .first()
    .click({ force: true });

  // Check the "Select All" checkbox
  cy.get('input[type="checkbox"]#selectAll').should('be.visible').check({ force: true });

  // Click the "Next" button
  cy.get('div:has(h3:contains("Consolidation"))')
    .contains('button', 'Next')
    .should('be.visible')
    .and('not.be.disabled')
    .click({ force: true });

    mapColumnsToSelf();
}

// Helper to handle the Union modal: click Union, select Union radio, select all columns, and click Next.
export function FillUnionAllDetails() {
  // Click the "Union" tab/button
  cy.contains('button', 'Union').should('be.visible').click({ force: true });

  // Click the "Union All" option (robust selector)
  cy.get('div.flex.mt-3.w-full.justify-between')
    .contains('div', 'Union All')
    .should('be.visible')
    .click({ force: true });

  // Check the "Select All" checkbox
  cy.get('input[type="checkbox"]#selectAll').should('be.visible').check({ force: true });

  // Click the "Next" button
  cy.get('div:has(h3:contains("Consolidation"))')
    .contains('button', 'Next')
    .should('be.visible')
    .and('not.be.disabled')
    .click({ force: true });

  mapColumnsToSelf();
}

/**
 * Maps each left column to the same-named right column in the Column Mappings modal.
 * It finds each row, clicks the right dropdown, and selects the left column name.
 */
export function mapColumnsToSelf() {
  // Wait for the modal to appear
  cy.contains('h2', 'Column Mappings', { timeout: 7000 }).should('be.visible');

  // For each row in the mapping table
  cy.get('div.border-gray-300.p-4 > .flex.justify-between.items-center').each($row => {
    // Get the left column name from the disabled input
    cy.wrap($row).find('input[disabled]').invoke('val').then(leftColName => {
      // Click the right dropdown (combobox)
      cy.wrap($row).find('input[role="combobox"]').click({ force: true }).clear().type(leftColName, { force: true });
      // Select the value from the dropdown list (case-insensitive match)
      cy.get('li').filter((i, el) => {
        return el.innerText.trim().toLowerCase() === leftColName.trim().toLowerCase();
      }).first().click({ force: true });
    });
  });

  // Click the Save button
  cy.contains('button', 'Save').should('be.visible').and('not.be.disabled').click({ force: true });
}

/**
 * Verifies that all rows in a table match the given filter condition.
 * @param {string} tableContainerSelector - Selector for the table container (should contain the table and headers)
 * @param {object} mainGroupFilter - { column, operator, value, value2 }
 * @param {string} [startScreenshot] - Optional screenshot name before verification
 * @param {string} [endScreenshot] - Optional screenshot name after verification
 */
export function verifyTableFilterResults(tableContainerSelector, mainGroupFilter, startScreenshot, endScreenshot) {
  if (startScreenshot) cy.screenshot(startScreenshot);
  cy.get(tableContainerSelector, { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      cy.get('table.w-full').should('be.visible');
      const columnName = mainGroupFilter.column.split('.').pop();
      cy.get('th').then(($headers) => {
        const headers = $headers.map((_, el) => el.textContent).get();
        const colIndex = headers.findIndex(h => 
          h.toLowerCase().endsWith(`.${columnName.toLowerCase()}`) || 
          h.toLowerCase() === columnName.toLowerCase()
        );
        expect(colIndex, `Column ${columnName} not found in headers: ${headers.join(', ')}`).to.not.equal(-1);
        cy.get('tbody tr').each(($row, rowIndex) => {
          cy.wrap($row)
            .find('td')
            .eq(colIndex)
            .scrollIntoView()
            .should('exist')
            .then(($cell) => {
              const value = $cell.text().trim();
              const operator = mainGroupFilter.operator;
              const expectedValue = mainGroupFilter.value;
              const expectedValue2 = mainGroupFilter.value2;
              let expectedMsg = '';
              if (operator === 'LIKE') {
                expectedMsg = `${operator} \"${expectedValue}\"`;
              } else if (operator === 'Between') {
                expectedMsg = `${operator} ${expectedValue} and ${expectedValue2}`;
              } else {
                expectedMsg = `${operator} ${expectedValue}`;
              }
              const result = checkCondition(value, operator, expectedValue, expectedValue2);
              const logMsg = result
                ? `✓ Row ${rowIndex + 1} value: \"${value}\" satisfied condition: ${expectedMsg}`
                : `Row ${rowIndex + 1} value: \"${value}\" did NOT satisfy condition: ${expectedMsg}`;
              cy.log(logMsg);
              expect(result, `Row ${rowIndex + 1} value: \"${value}\" did not satisfy condition: ${expectedMsg}`).to.be.true;
            });
        });
      });
    });
  if (endScreenshot) cy.screenshot(endScreenshot);
}

/**
 * Checks if a value satisfies a filter condition.
 * @param {string|number} value
 * @param {string} operator
 * @param {string|number} expectedValue
 * @param {string|number|null} [expectedValue2]
 * @returns {boolean}
 */
export function checkCondition(value, operator, expectedValue, expectedValue2 = null) {
  if (operator === 'LIKE') {
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
  if (isNaN(numericValue)) {
    return false;
  }
  switch (operator) {
    case '>':
      return numericValue > expected;
    case '<':
      return numericValue < expected;
    case '=':
      return Math.abs(numericValue - expected) < 0.0001;
    case '!=':
      return Math.abs(numericValue - expected) >= 0.0001;
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

