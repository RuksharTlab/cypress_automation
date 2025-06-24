
cy.dragSourceViewToCanvas({ x: 200, y: 400 });
cy.dragSourceViewToCanvas({ x: 800, y: 400 });

function ConsolidationToSourceview() {
  const sourceNodeContainerSelector = 'div.bg-\\[\\#8E77BB\\].rounded-full:has(svg.lucide.lucide-network)';
  //const targetNodeContainerSelector = 'div:has(h3:contains("Connection")):has(svg.lucide.lucide-cable)';
  // In your helper function like connectConsolidationToConnection:
  const targetNodeContainerSelector = 'div:has(h3:contains("Source View")):has(svg.lucide-square-kanban)';
  
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
   ConsolidationToSourceview();


 // Verify the data in the output preview table.
 cy.xpath("//div[contains(., 'Output Preview')]/..")
 .find('table', { timeout: 10000 })
 .should('be.visible')
 .within(() => {
   // Find the index of the 'Dept_id' column header, case-insensitively.
   cy.contains('thead th', /dept_id/i).invoke('index').then((deptIdIndex) => {
     // Iterate over each row in the table body.
     cy.get('tbody tr').each(($row) => {
       // Get the cell in the 'Dept_id' column for the current row.
       cy.wrap($row).find('td').eq(deptIdIndex).invoke('text').then((cellText) => {
         // Parse the text to a number and assert it's greater than 10.
         const deptId = parseFloat(cellText.trim());
         expect(deptId).to.be.gt(0);
       });
     });
   });
 });   