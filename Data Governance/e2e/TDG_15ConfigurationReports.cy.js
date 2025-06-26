/*describe('Cofiguration_Reports', () => {
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
    cy.get('button[type="button"]').eq(2).click();

    // Using values from JSON
    cy.get('select').eq(0).select(credentials.policy.mainCategory);
    cy.wait(1000);

    //=================Add Subpolicy================
    // Click on the "Add Subpolicy" button
/*cy.contains('button', 'Add Subpolicy').click();
// Enter "Automation1" in the subpolicy name input field
cy.get('input[placeholder="Enter subpolicy name"]').type(credentials.policy.subpolicyName);
// Enter "Automation" in the description textarea
cy.get('textarea[placeholder="Enter description"]').type('Automation');
cy.wait(500);
// Click on the "Add" button
cy.contains('button', /^Add$/).click();*/
//==========1 
/*cy.wait(1000);
    //==================End=======================
    cy.get('select').eq(1).select("2demo");

    cy.contains('button', 'Next').click();
    cy.wait(4000);
    cy.get('input[type="text"]').eq(2).type("Translab");
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });

    cy.contains('button', 'Next').click();
    cy.wait(14000);

    cy.contains('div', 'Select Connection').click();
    cy.get('input[placeholder="Search..."]').type(credentials.policy.connection);
    cy.wait(500);
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });


    cy.wait(1000);
    cy.contains('div', 'Select Schema').click();
    cy.wait(1000);
    //cy.get('input[type="checkbox"]').eq(1).check({ force: true });
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.contains('div', 'Select Table').click();
    cy.get('input[placeholder="Search..."]').type(credentials.policy.table);
    cy.wait(1000);
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });

    cy.contains('div', 'Select Column').click();
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.contains('button', 'Next').click();

    // Select schema keyword
    cy.contains('div', 'Select Table').click();
    cy.get('input.border-b').type(credentials.policy.schemaKeyword);
    cy.get('div.hover\\:bg-gray-100').first().click();
    cy.wait(1000);*/
    //================1 e
    //Add condition for row
    /*cy.contains('button', 'Add Condition').click();
     cy.wait(1000);
    cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm').eq(0).select('id');
    cy.wait(500);
    cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm').eq(1).select('=');
cy.wait(500);
    cy.get('input.w-full.p-2.border.border-gray-300.rounded-md.text-sm').type('3');
   
   //=====2 cy.wait(500);*/
    /*cy.contains('button', 'Next').click();

//  condtions over
// Add Column access control start

    cy.contains('div', 'Select Table').click();
    cy.get('input.border-b').type(credentials.policy.schemaKeyword);
    cy.get('div.hover\\:bg-gray-100').first().click();
    cy.wait(1000);
    // Applying conditon for cloumn  access control 
    cy.contains('button', 'Add Column Control').click();
cy.wait(1000);
//===this is for Mapping
cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm', { timeout: 10000 })
  .eq(0)
  .should('be.visible')
  .select('age');
//cy.wait(1000);
//This is for Hashing 
/*cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm', { timeout: 10000 })
  .eq(1)
  .should('be.visible')
  .select('Hashing');
  cy.wait(1000);*/
  //=====2 e
  // till here

//===========================================Clear and Back==================================================
//cy.get('button.px-5.py-1\\.5.rounded-md.border.border-gray-300.text-gray-700.hover\\:bg-gray-100').eq(1).click();
//cy.wait(1000);
//cy.get('button.px-5.py-1\\.5.rounded-md.border.border-gray-300.text-gray-700.hover\\:bg-gray-100').eq(2).click();

//===========================================Clear and back=============================================
     /*=======3 cy.wait(1000);
    cy.contains('button', 'Next').click();

    cy.get('#permission-read').check({ force: true });
    cy.contains('button', 'Next').click();
  cy.wait(1000);

//================================================Reports===============================================
   /// Click the 2nd dropdown
cy.get('div.block.w-full.pl-3.pr-10.py-2.text-base.border.border-gray-300.focus\\:outline-none.focus\\:ring-\\[\\#8e78b7\\].focus\\:border-\\[\\#8e78b7\\].rounded-md.cursor-pointer')
  .eq(1)
  .click();

cy.wait(1000);

// Type "LOANS" into the 3rd text input
cy.get('input[type="text"]').eq(2).type('LOANS');

cy.wait(1000);

// Click the first matching dropdown suggestion
cy.get('div.flex.items-center.px-3.py-2.text-sm.cursor-pointer.hover\\:bg-gray-100')
  .eq(0)
  .click();
  //=============================================================

  // Click on the 1st dropdown
cy.get('div.block.w-full.pl-3.pr-10.py-2.text-base.border.border-gray-300.focus\\:outline-none.focus\\:ring-\\[\\#8e78b7\\].focus\\:border-\\[\\#8e78b7\\].rounded-md.cursor-pointer')
  .eq(0)
  .click();

cy.wait(1000); // Optional - better to use `.should(...)` checks

// Type "GRID" into the 3rd text input
cy.get('input[type="text"]').eq(2).type('GRID');

// Click the 1st suggestion
cy.get('div.flex.items-center.px-3.py-2.text-sm.cursor-pointer.hover\\:bg-gray-100')
  .eq(0)
  .click();
//====================================================================
// Click the 3rd dropdown (index 2)
cy.get('div.block.w-full.pl-3.pr-10.py-2.text-base.border.border-gray-300.focus\\:outline-none.focus\\:ring-\\[\\#8e78b7\\].focus\\:border-\\[\\#8e78b7\\].rounded-md.cursor-pointer')
  .eq(2)
  .click();

cy.wait(1000); // Can be replaced with better waiting logic

// Type "AgilusReport" into the 3rd input
cy.get('input[type="text"]').eq(2).type('Remittance_Under_RDA');

// Click the 1st dropdown suggestion
cy.get('div.flex.items-center.px-3.py-2.text-sm.cursor-pointer.hover\\:bg-gray-100')
  .eq(0)
  .click();
 cy.wait(1000); 
  cy.get('button.px-6.py-2.rounded-md.bg-\\[\\#8e78b7\\].text-white.hover\\:bg-\\[\\#7a66a3\\].flex.items-center').click();



//==================================================Reports=========================================
    //cy.get('button.px-6.py-2.rounded-md').click();

    //cy.contains('button', 'Yes, Save Policy').click();
    cy.wait(1000);
    cy.screenshot('Policy Added Successfully');
  });
});


//===========================================================================================================

/*describe('Add Policy Automation', () => {
  let credentials;

  before(() => {
    cy.fixture('userCredentials').then((data) => {
      credentials = data;
    });
  });

  it('Logs into Tantor portal and creates all users from credentials', function () {
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
 

    
    cy.get('button.p-1.hover\\:bg-gray-200.rounded-full')
      .eq(4) // 5th button = index 4
      .click();

    cy.get('a.flex.items-center.justify-between').eq(11).click(); // index adjusted

    cy.get('button[type="button"]').eq(2).click();

    cy.get('select').eq(0).select('Data Management');
cy.wait(1000);
   cy.get('select').eq(1).select('Automation2');
    cy.contains('button', 'Next').click();

    cy.get('input[type="text"]').eq(2).type('Translab');
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });
    cy.contains('button', 'Next').click();

    // Wait for next page to load
    cy.wait(1000);
cy.contains('div', 'Select Connection').click(); // More robust than using .eq()


cy.get('input[placeholder="Search..."]').type('Postgres_233_SRC');


  cy.wait(500);
  cy.get('input[type="checkbox"]').eq(0).check({ force: true });

 
cy.wait(1000);
  cy.contains('div', 'Select Schema').click();
cy.wait(1000);
  cy.get('input[type="checkbox"]').eq(0).check({ force: true });
cy.wait(500);
    cy.contains('div', 'Select Table').click();
    cy.get('input[placeholder="Search..."]').type('Postgres_233_SRC.public.postgres_simple_tbl');
    cy.wait(1000);
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });

    cy.contains('div', 'Select Column').click();
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.contains('button', 'Next').click();

    cy.contains('div', 'Select Table').click();
    // Select dropdown with "simple"
    cy.get('input.border-b').type('simple');
    cy.get('div.hover\\:bg-gray-100').first().click();

    cy.contains('button', 'Next').click();

    cy.contains('div', 'Select Table').click();
    cy.get('input.border-b').type('simple');
    cy.get('div.hover\\:bg-gray-100').first().click();

    cy.contains('button', 'Next').click();

    cy.get('#permission-read').check({ force: true });
    cy.contains('button', 'Next').click();

    cy.get('button.px-6.py-2.rounded-md').click();
    cy.contains('button', 'Yes, Save Policy').click();
     cy.wait(1000);
    cy.screenshot('Policy Added Successfully');
    
    

         });
});*/


//===========================================================================================================


describe('ConfigurationReports', () => {
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
    cy.get('button[type="button"]').eq(2).click();

    // Using values from JSON
    cy.get('select').eq(0).select(credentials.policy.mainCategory);
    cy.wait(1000);

    //=================Add Subpolicy================
    // Click on the "Add Subpolicy" button
cy.contains('button', 'Add Subpolicy').click();
// Enter "Automation1" in the subpolicy name input field
cy.get('input[placeholder="Enter subpolicy name"]').type(credentials.policy.subpolicyName);
// Enter "Automation" in the description textarea
cy.get('textarea[placeholder="Enter description"]').type('Automation');
cy.wait(500);
// Click on the "Add" button
cy.contains('button', /^Add$/).click();

cy.wait(1000);
    //==================End=======================
    cy.get('select').eq(1).select(credentials.policy.subPolicy);

    cy.contains('button', 'Next').click();
    cy.wait(1000);
    cy.get('input[type="text"]').eq(2).type(credentials.policy.RoleName);
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });

    cy.contains('button', 'Next').click();
    cy.wait(11000);

    cy.contains('div', 'Select Connection').click();
    cy.get('input[placeholder="Search..."]').type(credentials.policy.connection);
    cy.wait(500);
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.wait(1000);
    cy.contains('div', 'Select Schema').click();
    cy.wait(1000);
    //cy.get('input[type="checkbox"]').eq(1).check({ force: true });
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.contains('div', 'Select Table').click();
    cy.get('input[placeholder="Search..."]').type(credentials.policy.table);
    cy.wait(1000);
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });

    cy.contains('div', 'Select Column').click();
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });

    cy.contains('button', 'Next').click();

    // Select schema keyword
    cy.contains('div', 'Select Table').click();
    cy.get('input.border-b').type(credentials.policy.schemaKeyword);
    cy.get('div.hover\\:bg-gray-100').first().click();
    cy.wait(1000);
    //Add condition for row
    /*cy.contains('button', 'Add Condition').click();
     cy.wait(1000);
    cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm').eq(0).select('id');
    cy.wait(500);
    cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm').eq(1).select('=');
cy.wait(500);
    cy.get('input.w-full.p-2.border.border-gray-300.rounded-md.text-sm').type('3');
    cy.wait(500);*/
    cy.contains('button', 'Next').click();

//  condtions over
// Add Column access control start

    cy.contains('div', 'Select Table').click();
    cy.get('input.border-b').type(credentials.policy.schemaKeyword);
    cy.get('div.hover\\:bg-gray-100').first().click();
    cy.wait(1000);
    // Applying conditon for cloumn  access control 
    cy.contains('button', 'Add Column Control').click();
cy.wait(1000);
//===this is for Mapping
cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm', { timeout: 10000 })
  .eq(0)
  .should('be.visible')
  .select('age');

      cy.wait(1000);
    cy.contains('button', 'Next').click();

    cy.get('#permission-read').check({ force: true });
    cy.contains('button', 'Next').click();
    cy.wait(1000);
    //================================================Reports===============================================
   /// Click the 2nd dropdown
cy.get('div.block.w-full.pl-3.pr-10.py-2.text-base.border.border-gray-300.focus\\:outline-none.focus\\:ring-\\[\\#8e78b7\\].focus\\:border-\\[\\#8e78b7\\].rounded-md.cursor-pointer')
  .eq(1)
  .click();

cy.wait(1000);

// Type "LOANS" into the 3rd text input
cy.get('input[type="text"]').eq(2).type(credentials.Reports.ReportGroups);

cy.wait(1000);

// Click the first matching dropdown suggestion
cy.get('div.flex.items-center.px-3.py-2.text-sm.cursor-pointer.hover\\:bg-gray-100')
  .eq(0)
  .click();
  //=============================================================

  // Click on the 1st dropdown
cy.get('div.block.w-full.pl-3.pr-10.py-2.text-base.border.border-gray-300.focus\\:outline-none.focus\\:ring-\\[\\#8e78b7\\].focus\\:border-\\[\\#8e78b7\\].rounded-md.cursor-pointer')
  .eq(0)
  .click();

cy.wait(1000); // Optional - better to use `.should(...)` checks

// Type "GRID" into the 3rd text input
cy.get('input[type="text"]').eq(2).type(credentials.Reports.ReportTypes);

// Click the 1st suggestion
cy.get('div.flex.items-center.px-3.py-2.text-sm.cursor-pointer.hover\\:bg-gray-100')
  .eq(0)
  .click();
//====================================================================
// Click the 3rd dropdown (index 2)
cy.get('div.block.w-full.pl-3.pr-10.py-2.text-base.border.border-gray-300.focus\\:outline-none.focus\\:ring-\\[\\#8e78b7\\].focus\\:border-\\[\\#8e78b7\\].rounded-md.cursor-pointer')
  .eq(2)
  .click();

cy.wait(1000); // Can be replaced with better waiting logic

// Type "AgilusReport" into the 3rd input
cy.get('input[type="text"]').eq(2).type(credentials.Reports.ReportNames);

// Click the 1st dropdown suggestion
cy.get('div.flex.items-center.px-3.py-2.text-sm.cursor-pointer.hover\\:bg-gray-100')
  .eq(0)
  .click();
 cy.wait(1000); 
  cy.get('button.px-6.py-2.rounded-md.bg-\\[\\#8e78b7\\].text-white.hover\\:bg-\\[\\#7a66a3\\].flex.items-center').click();



//==================================================Reports=========================================


    //cy.get('button.px-6.py-2.rounded-md').click();
    cy.contains('button', 'Yes, Save Policy').click();
    cy.wait(1000);
    cy.screenshot('Policy Added Successfully');
  });
});

