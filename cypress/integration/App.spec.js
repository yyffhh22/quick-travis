describe ('Test App', () => {

    it ('launches', () => {
      cy.visit ('/');
    });

    it ('open the app with the login button', () => {
        cy.visit('/');
        cy.contains('Sign in with Google');
    });

    it('user can click the "add a new goal" to create a new goal card', () => {
        cy.visit ('/');
        cy.contains('Welcome,');
        cy.contains('Add a new goal');
        cy.contains('Add a new goal').click();
        });
  });