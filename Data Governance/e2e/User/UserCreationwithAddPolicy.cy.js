describe('User Creation with Add New Policy', () => {
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
    cy.get('a[href="/datagovernance/user"]').click();

    // Loop through each user
    credentials.users.forEach((user) => {
      cy.contains('button', 'Add user').click();

      cy.get('input[placeholder="User name"]').type(user.username);
      cy.get('input[placeholder="Password"]').type(user.password);
      cy.get('input[placeholder="Confirm password"]').type(user.password);
      cy.get('input[placeholder="First name"]').type(user.firstName);
      cy.get('input[placeholder="Last name"]').type(user.lastName);
      cy.get('input[placeholder="Email id"]').type(user.email);
      cy.wait(1000);

      //============================================Add new Policy==============================================
      cy.contains('button', 'Add new policy').click({ force: true });
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

      cy.wait(1000);
      //==================End=======================
      cy.get('select').eq(1).select(credentials.policy.subPolicy);

    cy.contains('button', 'Next').click();
    cy.wait(1000);
    //=====================Role select======================
    // Type "Ticket" into the input with id ":r0:"
cy.get('input[id=":r0:"]').type(credentials.policy.RoleName);

// Click the 13th checkbox on the page (index 12 because it's zero-based)
cy.get('input[type="checkbox"]').eq(12).check({ force: true });



      //=====================for group and subgroup================
      cy.wait(1000);
      cy.contains('button', 'Group').click({ force: true });
      cy.wait(1000);
      cy.get('input[placeholder="Search group..."]').type(credentials.policy.GroupName, { force: true });
      cy.get('input[type="checkbox"]').eq(12).check({ force: true });
      cy.wait(1000);
      cy.contains('button', 'Sub-group').click({ force: true });
      cy.wait(1000);
      cy.get('input[placeholder="Search sub-group..."]').type(credentials.policy.SubgroupName, { force: true });
      cy.get('input[type="checkbox"]').eq(12).check({ force: true });


      //=========================================================================================ggg
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
      cy.contains('button', 'Next').click();

      //  condtions over
      // Add Column access control start

      cy.contains('div', 'Select Table').click();
      cy.get('input.border-b').type(credentials.policy.schemaKeyword);
      cy.get('div.hover\\:bg-gray-100').first().click();
      cy.wait(1000)
      // Applying conditon for cloumn  access control 
      cy.contains('button', 'Add Column Control').click();
      cy.wait(1000);
      //===this is for Mapping
      cy.get('select.w-full.p-2.border.border-gray-300.rounded-md.text-sm', { timeout: 10000 })
        .eq(0)
        .should('be.visible')
        .select(credentials.policy.Columnselect);
      cy.wait(1000);
      cy.contains('button', 'Next').click();

      cy.get('#permission-read').check({ force: true });
      cy.contains('button', 'Next').click();
      cy.get('button.px-6.py-2.rounded-md').click();
      cy.contains('button', 'Yes, Save Policy').click();
      cy.wait(1000);
      cy.screenshot('Policy Added Successfully');

    });
  });
});