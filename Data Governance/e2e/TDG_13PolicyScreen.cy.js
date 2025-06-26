describe('Policy Screen', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Creates a new policy using values from userCredentials.json', function () {
    Cypress.on('uncaught:exception', () => false);

    cy.visit(credentials.url, { failOnStatusCode: false });
    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.username);
    cy.get('#password').should('be.visible').type(credentials.password);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('a[href="/dashboard"]').click();
    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    cy.get('a[href="/datagovernance/data-shield"]').click();

    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full').eq(4).click();
    cy.get('a.flex.items-center.justify-between').eq(11).click();
    //====================================Toggale And Refresh=====================================
    cy.get('button[type="button"]').eq(0).click(); 
    cy.wait(1000);
    cy.get('button[type="button"]').eq(0).click();
    cy.wait(1000);
    cy.get('button[type="button"]').eq(1).click(); // eq(1) because it's 0-based index

//=========================================Toggle And Refresh=================================================
    cy.wait(1000);
//===========================================Search with Name===============================================
cy.get('input[placeholder="Search Policy"]').type('Data Management');
    cy.wait(1000);
   cy.get('input[placeholder="Search Policy"]').clear();
   
   
       
//=================================Seacrh with Name Completed=================================================
cy.wait(2000);


//===================================Edit The policy=================================================
  cy.get('input[placeholder="Search Policy"]').type('Today16');
    cy.wait(1000);

    cy.get('button.p-1\\.5.rounded-full.hover\\:bg-gray-100').click(); // search or open action menu
    cy.wait(500);

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors').eq(0).click(); // click edit
    cy.wait(500);
    cy.get('select').eq(0).select(credentials.policy.mainCategory);
    cy.wait(1000);
    cy.get('select').eq(1).select('Today16edit');
    cy.contains('button', 'Next').click();
    cy.wait(1000);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(500);
    cy.contains('button', 'Next').click();
    cy.wait(1000);

    cy.contains('button', 'Skip Reports').click({ force: true });
    cy.contains('button', 'Yes, Save Policy').click();
    cy.wait(1000);
    cy.screenshot('Policy_Edited_Successfully');

   cy.wait(1000);

//===================================Edit completed================================================
// ==================================Delete Start======================================================
   cy.get('input[placeholder="Search Policy"]').clear().type('ForDelete');
    cy.wait(1000);

    cy.get('button.p-1\\.5.rounded-full.hover\\:bg-gray-100').click(); // search or open action menu
    cy.wait(500);

    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors').eq(1).click(); // click edit
    cy.wait(1000);
    cy.contains('button', 'Delete').should('be.visible').click({ force: true });
    cy.screenshot('Policy_Deleted');
    cy.wait(1000);
//====================================Delete Over===================================================
//====================================Refresh After Delete=========================================
    cy.get('input[placeholder="Search Policy"]').clear().type('Today16edit');
    cy.wait(1000);

    cy.get('button.p-1\\.5.rounded-full.hover\\:bg-gray-100').click(); // search or open action menu
    cy.wait(500);
     cy.wait(1000);
    cy.get('button.p-1\\.5.rounded-lg.hover\\:bg-gray-100.transition-colors').eq(2).click(); // click edit
     cy.screenshot('Policy Refreshed successfully');
//======================================Refresh Over ==========================================




     });
});