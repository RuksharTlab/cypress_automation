describe('Login with New user', () => {

  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal and performs migration creation', () => {
    Cypress.on('uncaught:exception', () => false);

    cy.visit(credentials.url, {
      failOnStatusCode: false,
    });

    cy.get('#username', { timeout: 10000 }).should('be.visible').type(credentials.NewUser.newusername);
    cy.wait(1000);
    cy.get('#password').should('be.visible').type(credentials.NewUser.newpassword);
    cy.wait(500);
    cy.get('button[type="submit"]').click();

    cy.screenshot('before-test');

    
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    cy.contains('Data Governance', { timeout: 10000 }).should('be.visible').click();
    cy.wait(2000);
    // Click Data Governance button (second button with specified class)
    cy.get('button.px-4.py-2.rounded-full.text-sm')
      .eq(1)
      .click();

    // Click Data Catalogue
    cy.get('a[href="/datagovernance/data-catalogue"]').click();
    cy.wait(1000);

    // Click the second rounded icon to open sub-menu
    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full').eq(1).click();

    // Click on the Database tab
    cy.get('a[href="/datagovernance/data-catalogue/database"]').click();
    cy.wait(1000);

    //===========================================Toggle And Refresh==========================================
     cy.get('button.p-1.px-1\\.5.rounded-lg.border.border-gray-400.hover\\:bg-gray-50').eq(0).then(($btn) => {
  cy.wrap($btn).click();
  cy.wait(2000);
  cy.wrap($btn).click();
});

    // Click disabled button if it's enabled dynamically
    cy.get('button.disabled\\:opacity-50').click({ force: true });
    cy.wait(1000);

    // See details
    cy.contains('button', 'See details').eq(0).click();  //for oracle
      //cy.contains('button', 'See details').eq(1).click(); // for postgres
     //cy.contains('See details').eq(1).click({ force: true }); // Postgres is 2nd
     //cy.contains('button', 'See details').eq(1).click({ force: true });


    cy.wait(1000);

    // Close popup
    cy.get('button.absolute.top-3.right-3').click();
    cy.wait(1000);

    // ==================================Go to Schema tab====================================================
    cy.get('a[href="/datagovernance/data-catalogue/schema"]').click();
    cy.wait(1000);
    cy.get('button.disabled\\:opacity-50').click({ force: true });
    cy.wait(1000);

    // ==================================Go to Table tab=======================================================
    cy.get('a[href="/datagovernance/data-catalogue/table"]').click();
    cy.wait(1000);
    cy.get('button.disabled\\:opacity-50').click({ force: true });
    cy.wait(1000);
    //cy.get('input[name="selectAll"]').click({ force: true });
    //cy.wait(1000);
    //cy.get('button.disabled\\:opacity-50').click({ force: true });
    //cy.contains('button', 'View').click({ force: true });
    cy.wait(1000);
    // Click the close (X) button at top right
//cy.get('button.absolute.top-3.right-3.text-gray-500.hover\\:text-gray-700.z-10').click({ force: true });
  //  cy.wait(1000);
    // ===================================Go to Column tab=====================================================
    cy.get('a[href="/datagovernance/data-catalogue/column"]').click();
    cy.wait(1000);
    cy.get('button.disabled\\:opacity-50').click({ force: true });
    //cy.wait(3000);
    //cy.get('input[name="selectAll"]').click({ force: true });
    cy.wait(1000);
    //cy.get('button.disabled\\:opacity-50').click({ force: true });
//=========================================Validation Over================================================
    //cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full').eq(1).click();
    cy.wait(2000);
    cy.get('a[href="/dashboard"]').click();
    cy.contains('button', 'Platform').click();
    cy.wait(2000);

    // Step 2: Click on Federation
    cy.get('a[href="/federation"]').click();
    cy.wait(1000);

    // Step 3: Click on the first 'flex justify-between' div
    //cy.get('(//div[@class="flex justify-between"])[1]').click();
    //cy.wait(1000);
// Scroll to the element before clicking
cy.get('div.flex.justify-between').first().scrollIntoView().should('be.visible').click();
cy.wait(1000);

    // Step 4: Focus ACE editor
    cy.get('div.ace_content').click();

    // Step 5: Type into the hidden textarea used by ACE editor
    cy.get('textarea.ace_text-input').type(credentials.NewUser.quarry);
    cy.wait(1000);
    //cy.get('div.flex.justify-between.items-center').click({ force: true });
    cy.contains('button', 'Run').click({ force: true });
    cy.wait(1000);
    cy.screenshot('Quarry is executed ');
    cy.wait(1000);
//==========================================Quary excuting over=========================================
//==========================================Configution Reports===========================================
    //cy.get('button.p-1.hover\\:bg-gray-200.rounded-full').eq(1).click();
    cy.wait(2000);
    cy.get('a[href="/dashboard"]').click();
    cy.contains('button', 'Platform').click();
    cy.wait(2000);
    // Click the first "/config/rule" link
cy.get('a[href="/config/rule"]').eq(0).click();
cy.wait(1000); // Optional, consider replacing with a better wait

// Click the button with specific classes
cy.get('button.p-1.hover\\:bg-gray-200.rounded-full.transition-transform.duration-300').click();
cy.wait(1000);

// Click the "/config/report" link
cy.get('a[href="/config/report"]').click();
cy.scrollTo('bottom');
cy.wait(1000);
//cy.screenshot('Reports are visible in the table');







    });

});