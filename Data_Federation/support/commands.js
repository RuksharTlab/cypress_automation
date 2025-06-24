Cypress.Commands.add('login', () => {
  console.log('Cypress.env:', Cypress.env());

  const username = Cypress.env('username');
  const password = Cypress.env('password');

  if (!username || !password) {
    throw new Error('Environment variables "username" and "password" must be defined.');
  }
  
  cy.visit(Cypress.env('url') || 'https://darch.app.tantor.io');
  cy.get('input[id="username"]').type(username);
  cy.get('input[id="password"]').type(password);
  cy.contains('button', 'Sign in').click();
});

Cypress.Commands.add('navigateToCreateBusinessView', () => {
  // Navigate to the Connections page
  cy.contains('span', 'Connections').click();
  cy.get('select.w-44', { timeout: 10000 }).should('be.visible');

  // Select the project from the dropdown
 // cy.get('select.w-44').select(Cypress.env('projectName'));

  // Navigate to the Federation page
  cy.contains('span', 'Federation').click();
  cy.contains('div', 'Create View', { timeout: 10000 }).should('be.visible');

  // Click on Create View button
  cy.contains('div', 'Create View').click();

  // Wait for the "Business View" option to be visible
  cy.contains('div', 'Business View', { timeout: 10000 }).should('be.visible');

  // Click on Business View button
  cy.contains('div', 'Business View').click();

  // Wait for the modal to appear by checking for its title
  cy.contains('h2', 'Create a View', { timeout: 10000 }).should('be.visible');

  // Click the "Create" button
  cy.get('button.bg-\\[\\#8E77BB\\]:contains("Create")', { timeout: 5000 })
    .should('be.visible')
    .and('be.enabled')
    .click();
});

Cypress.Commands.add('navigateToCreateComplexBusinessView', () => {
  // Navigate to the Connections page
  cy.contains('span', 'Connections').click();
  cy.get('select.w-44', { timeout: 10000 }).should('be.visible');

  // Select the project from the dropdown
  //cy.get('select.w-44').select(Cypress.env('projectName'));

  // Navigate to the Federation page
  cy.contains('span', 'Federation').click();
  cy.contains('div', 'Create View', { timeout: 10000 }).should('be.visible');

  // Click on Create View button
  cy.contains('div', 'Create View').click();

    // Click on Complex button
    cy.contains('button', 'Complex').click();
  

  // Wait for the "Business View" option to be visible
  cy.contains('div', 'Business View', { timeout: 10000 }).should('be.visible');

  // Click on Business View button
  cy.contains('div', 'Business View').click();

  // Wait for the modal to appear by checking for its title
  cy.contains('h2', 'Create a View', { timeout: 10000 }).should('be.visible');



  // Click the "Create" button
  cy.get('button.bg-\\[\\#8E77BB\\]:contains("Create")', { timeout: 5000 })
    .should('be.visible')
    .and('be.enabled')
    .click();
}); 

/**
 * @param {string} draggableSelector - The Cypress selector for the draggable element.
 * @param {string} droppableSelector - The Cypress selector for the area to drop onto.
 * @param {object} dropPosition - Optional. { x: number, y: number } relative to the droppable element.
 *                                If not provided, drops near the center.
 */
Cypress.Commands.add('dragAndDrop', (draggableSelector, droppableSelector, dropPosition) => {
  const dataTransfer = new DataTransfer();

  cy.get(draggableSelector).should('be.visible').as('draggable');
  cy.get(droppableSelector).should('be.visible').as('droppable');

  cy.get('@draggable').trigger('dragstart', { dataTransfer, force: true });

  cy.get('@droppable').then($droppable => {
    let clientX, clientY;
    const rect = $droppable[0].getBoundingClientRect();

    if (dropPosition && typeof dropPosition.x === 'number' && typeof dropPosition.y === 'number') {
      clientX = rect.left + dropPosition.x;
      clientY = rect.top + dropPosition.y;
    } else {
      // Default to center-ish if no position is given
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    }

    cy.get('@droppable')
      .trigger('dragenter', { dataTransfer, clientX, clientY, force: true })
      .trigger('dragover', { dataTransfer, clientX, clientY, force: true });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);

    cy.get('@droppable').trigger('drop', { dataTransfer, clientX, clientY, force: true });
  });

  cy.get('@draggable').trigger('dragend', { force: true });
});


Cypress.Commands.add('dragSourceViewToCanvas', (dropPosition) => {
  const sourceViewSelector = 'div[draggable="true"]:contains("Source View")';
  const canvasSelector = '.react-flow__pane';
  cy.dragAndDrop(sourceViewSelector, canvasSelector, dropPosition);
});

Cypress.Commands.add('dragConnectionToCanvas', (dropPosition) => {
  const connectionSelector = 'div[draggable="true"]:contains("Connection")';
  const canvasSelector = '.react-flow__pane';
  cy.dragAndDrop(connectionSelector, canvasSelector, dropPosition);
});

Cypress.Commands.add('dragConsolidationToCanvas', (dropPosition) => {
  const consolidationSelector = 'div[draggable="true"]:contains("Consolidation")';
  const canvasSelector = '.react-flow__pane';
  cy.dragAndDrop(consolidationSelector, canvasSelector, dropPosition);
});


Cypress.Commands.add('connectNodes', (sourceNodeContainerSelector, sourceHandlePos, targetNodeContainerSelector, targetHandlePos) => {
  const srcHandleSel = `${sourceNodeContainerSelector} .react-flow__handle.react-flow__handle-${sourceHandlePos}`;
  const tgtHandleSel = `${targetNodeContainerSelector} .react-flow__handle.react-flow__handle-${targetHandlePos}`;

  cy.log(`[connectNodes] Connecting: ${sourceNodeContainerSelector} (${sourceHandlePos}) -> ${targetNodeContainerSelector} (${targetHandlePos})`);

  cy.get(srcHandleSel, { timeout: 12000 })
    .should('exist')
    .and('be.visible')
    .first()
    .then($src => {
      const srcElement = $src[0];
      const srcRect = srcElement.getBoundingClientRect();
      if (srcRect.width === 0 || srcRect.height === 0) {
        cy.log(`[connectNodes] CRITICAL WARNING: Source handle has zero dimensions! Rect: ${JSON.stringify(srcRect)}`);
      }

      cy.get(targetNodeContainerSelector, { timeout: 12000 })
        .should('be.visible', `Target Node Container (${targetNodeContainerSelector}) should be visible.`)
        .and('have.length.at.least', 1, `Target Node Container (${targetNodeContainerSelector}) should exist.`)
        .first()
        .within(() => {
          cy.get(`.react-flow__handle.react-flow__handle-${targetHandlePos}`, { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .first()
            .as('currentTargetHandle');
        });

      cy.get('@currentTargetHandle').then($tgt => {
        const tgtElement = $tgt[0];
        const tgtRect = tgtElement.getBoundingClientRect();
        if (tgtRect.width === 0 || tgtRect.height === 0) {
          cy.log(`[connectNodes] CRITICAL WARNING: Target handle has zero dimensions! Rect: ${JSON.stringify(tgtRect)}`);
        }
        if (tgtRect.x < -5 || tgtRect.y < -5 || tgtRect.x > (window.innerWidth + 5) || tgtRect.y > (window.innerHeight + 5)) {
          cy.log(`[connectNodes] CRITICAL WARNING: Target handle appears to be off-screen or has invalid coordinates! Rect: ${JSON.stringify(tgtRect)}`);
        }

        const sourceCenterX = srcRect.x + (srcRect.width / 2);
        const sourceCenterY = srcRect.y + (srcRect.height / 2);
        const targetCenterX = tgtRect.x + (tgtRect.width / 2);
        const targetCenterY = tgtRect.y + (tgtRect.height / 2);


        cy.wrap($src)
          .trigger('mousedown', { button: 0, clientX: sourceCenterX, clientY: sourceCenterY, force: true, bubbles: true });

        const midPointX = (sourceCenterX + targetCenterX) / 2;
        const midPointY = (sourceCenterY + targetCenterY) / 2;
        cy.get('body')
          .trigger('mousemove', { button: 0, clientX: midPointX, clientY: midPointY, force: true, bubbles: true });
        cy.wait(50, {log: false});
        cy.get('body')
          .trigger('mousemove', { button: 0, clientX: targetCenterX, clientY: targetCenterY, force: true, bubbles: true });
        
        cy.wrap($tgt)
          .trigger('mouseenter', { force: true, bubbles: true, clientX: targetCenterX, clientY: targetCenterY })
          .trigger('mouseover', { force: true, bubbles: true, clientX: targetCenterX, clientY: targetCenterY });

        // Pause for RF to process hover, beneficial for stability
        cy.wait(100, {log: false}); 

        cy.wrap($tgt)
          .trigger('mouseup', { button: 0, clientX: targetCenterX, clientY: targetCenterY, force: true, bubbles: true });
      });
    });
});

