describe('Pass Recommender System', () => {
    beforeEach(() => {
      // Change the URL to the URL where your component is being served
      cy.visit('http://localhost:3000/passRecommender');
    });
  
    it('should input start and end stations and get pass recommendation', () => {
      // Type "Oshio" into the start station input
      cy.get('input[placeholder="Type Start Station Name Here"]').type('Tanikawa');
  
      // Type "Fukuchiyama" into the end station input
      cy.get('input[placeholder="Type End Station Name Here"]').type('Sannomiya');
  
      // Click the button with the text "Get Pass Recommendation"
      cy.contains('Get Pass Recommendation').click();
  
      // Check that the page shows the text "Loading..."
      cy.contains('Loading...').should('be.visible');
  
      // Wait for the result to be displayed (adjust the timeout as needed)
      cy.contains('Your Pass Recommendation:', { timeout: 20000 }).should('be.visible');
    });

    it('should show an alert for invalid input (numbers)', () => {
      // Type numbers into the start station input
      cy.get('input[placeholder="Type Start Station Name Here"]').type('12345');

      // Type numbers into the end station input
      cy.get('input[placeholder="Type End Station Name Here"]').type('12345');
  
      // Click the button with the text "Get Pass Recommendation"
      cy.contains('Get Pass Recommendation').click();
  
      // Check for an alert with the message "the input is invalid"
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Invalid input. Please only use alphabets for station names.');
      });
    });
  
    it('should show an alert for invalid input (special characters)', () => {
      // Type special characters into the start station input
      cy.get('input[placeholder="Type Start Station Name Here"]').type('!@#$%');

      // Type special characters into the end station input
      cy.get('input[placeholder="Type End Station Name Here"]').type('!@#$%');
  
      // Click the button with the text "Get Pass Recommendation"
      cy.contains('Get Pass Recommendation').click();
  
      // Check for an alert with the message "the input is invalid"
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Invalid input. Please only use alphabets for station names.');
      });
    });

    it('should show an alert for invalid input (invalid station name)', () => {
      // Type gibberish into the start station input
      cy.get('input[placeholder="Type Start Station Name Here"]').type('adfsgfhdg');

      // Type giberrish into the end station input
      cy.get('input[placeholder="Type End Station Name Here"]').type('adfsgfhdg');
  
      // Click the button with the text "Get Pass Recommendation"
      cy.contains('Get Pass Recommendation').click();
  
      // Check for an alert with the message "the input is invalid"
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Invalid station name.');
      });
    });

    it('should show an alert when the input is empty', () => {
      // Stubbing the alert
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Empty input. Please enter valid station names.');
      });
  
      // Finding the input fields and submit button, then interact with them
      cy.get('button').contains('Get Pass Recommendation').click();
    });
  });
  