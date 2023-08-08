describe('Route Recommender App', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/routeRecommender'); 
    });
  
    it('successfully renders the page', () => {
      cy.get('.container').should('be.visible');
    });
  
    it('Should input user data and get correct output', () => {
        
    
        // Input user data
        cy.get('[data-testid=start-input]').type('Abeno');
        cy.get('[data-testid=end-input]').type('Ageki');
        cy.get('[data-testid=pass-input]').type('Both');
    
        // Click on Get Route Recommendation button
        cy.get('[data-testid=getRouteButton]').click();
    
        // Verify correct output
        cy.get('[data-testid=routeBox]').should('be.visible');
        cy.contains('Route');
        cy.contains('Osaka_Metro');
        cy.contains('Osaka Loop Line')
        cy.contains('Tokaido Main Line')
        cy.contains('Shinkansen')
        cy.contains('Yoro Railway')
        cy.contains('Sang Railway Hokusei Line')
        cy.contains('Transfer Stations');
        cy.contains('Abeno');
        cy.contains('Tennoji');
        cy.contains('Tsuruhashi');
        cy.contains('Kyobashi');
        cy.contains('Osaka');
        cy.contains('Shin-Osaka');
        cy.contains('Maibara');
        cy.contains('Ogaki');
        cy.contains('Nishikuwana');
        cy.contains('Nishikuwana');
      });
    
      it('Should save a trip', () => {
        
    
        // Input user data
        cy.get('[data-testid=start-input]').type('Abeno');
        cy.get('[data-testid=end-input]').type('Ageki');
        cy.get('[data-testid=pass-input]').type('Both');
    
        // Click on Get Route Recommendation button
        cy.get('[data-testid=getRouteButton]').click();
    
        // Save the trip
        cy.get('[data-testid=save-trip-button]').click();
    
        // Verify trip is saved
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Trip saved successfully');
          });
        
      });
  
      it('Should display an alert for non-alphabetic input', () => {
        // Input non-alphabetic characters
        cy.get('[data-testid=start-input]').type('123');
        
        // Click on the input field to trigger blur event
        cy.get('[data-testid=start-input]').click();
        
        // Verify the alert message
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Invalid input. Please use only alphabets.');
        });
      });

      it('Should display an alert for missing input fields', () => {
          // Input user data for start station and end station, but leave pass empty
          cy.get('[data-testid=start-input]').type('Abeno');
          cy.get('[data-testid=end-input]').type('Ageki');
          
          // Click on the "Get Route Recommendation" button
          cy.get('[data-testid=getRouteButton]').click();
          
          // Verify the alert message
          cy.on('window:alert', (str) => {
              expect(str).to.equal('Please fill in all the required information.');
          });
      });
  });
  