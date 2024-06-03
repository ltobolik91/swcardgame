describe('Star Wars Card Game', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200'); 
  });

  it('should display header with correct title', () => {
    cy.get('.header h1').should('have.text', 'Star Wars Card Game');
  });

  it('should have battlegrounds with player cards', () => {
    cy.get('.battleground').should('have.length', 1);
    cy.get('.battleground').eq(0).find('sw-card').should('exist');
  });

  it('should display control panel with player information', () => {
    cy.get('.battleground__control-panel').should('exist');
    cy.get('.players-panel').should('exist');
    cy.get('.players-panel').eq(0).should('contain', 'P1').should('contain', 'P2');
  });

  it('should have a dropdown for selecting card type', () => {
    cy.get('mat-select').should('exist');
  });

  it('should have a roll button when not loading', () => {
    cy.get('button').should('have.text', 'Roll');
  });

  it('should play the game when clicking the Roll button', () => {
    cy.get('button').click(); 
    cy.get('.header h1').should('not.have.text', ''); 
    cy.get('.header h1').invoke('text').then((text) => {
      if (text.includes('Won')) {
        cy.log('Someone won the game!');
      } else {
        cy.log('Game ended in a draw!');
      }
    });
  });

  it('should change card type when selecting a new category', () => {
    cy.get('mat-select').click(); 
    cy.wait(1000);
    cy.get('.mat-mdc-option').eq(3).click();
    cy.get('mat-select').should('contain', 'Planets'); 
  });

});