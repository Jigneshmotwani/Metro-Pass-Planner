/// <reference types="cypress" />

describe('metro pass planning app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000', {
            onBeforeLoad(win) {
              // Set the auth state to true to bypass login
              win.localStorage.setItem('auth', 'true');
            },
          });
    });

    it('Check that the welcome page is rendered', () => {
        // Check that the welcome page is rendered
        cy.get('h1').contains('Welcome').should('exist');
    });

    it('Check that the navbar is rendered', () => {
        // Check that the navbar is rendered
        cy.get("a").contains('Logout').should('exist');
        cy.get("a").contains('Route Recommender').should('exist');
        cy.get("a").contains('Pass Recommender').should('exist');
        cy.get("a").contains('View Trips').should('exist');
    });

    it('View trips page rendering and functionality of view trips redirect', () => {
        // Check that the nav bar redirect to view trips is working
        cy.get("a").contains('View Trips').click();
    });

    // At the start, the current user does not have any saved trips
    // The "No Saved Trips Found" card should be rendered
    it('Successfully rendered the "No Saved Trips Found" card', () => {
        cy.get("a").contains('View Trips').click();
        cy.get('[data-testid="no-trips-card"]').should('exist');
    });
  
    it('Route recommender page rendering', () => {
      // Navigate to the route recommender page
      cy.get("a").contains('Route Recommender').click();

      // Check that the route recommender page is rendered
      cy.get('div#startDropdown.dropdown-container').should('exist');
      cy.get('div#endDropdown.dropdown-container').should('exist');
      cy.get('div#passDropdown.dropdown-container').should('exist');
      // Select the div element with class "submit-btn"
      cy.get('div.submit-btn')
      // Check if it contains a button with the specified text
      .contains('button', 'Get Route Recommendation')
      .should('exist');
    });

    it('Successfully route a trip and save it to view trips page', () => {
      // Navigate to the route recommender page
      cy.get("a").contains('Route Recommender').click();

      // Simulate saving a trip
      cy.get('[data-testid^="start-input"]').type('Ageki');
      cy.get('[data-testid^="end-input"]').type('Amanohashidate');
      cy.get('[data-testid^="pass-input"]').type('Both');
      cy.get('[data-testid^="getRouteButton"]').click();
      cy.wait(5000);
      cy.get('[data-testid^="save-trip-button"]').should('be.visible').click();

      // Route back to viewTrips page to check if the trip card has been rendered
      cy.get("a").contains('View Trips').click();
      cy.get('[data-testid^="trip-card-0"]').should('exist');
      cy.get('[data-testid^="trip-name-0"]').contains('Ageki to Amanohashidate');
    });

    // Simulate opening and closing the modal
    // Modal should have the correct information shown to user
    it("Able to open and close modal, and modal gives correct information", () => {
      // Navigate to View Trips page
      cy.get("a").contains('View Trips').click();
      // Simulate the user clicking on the MoreVert button to open the modal
      cy.get('[data-testid^="open-modal-0"]').click();

      // Show correct information in modal
      cy.contains('Trip Information');
      cy.contains('Ageki');
      cy.contains('Nishikuwana');
      cy.contains('Ogaki');
      cy.contains('Maibara');
      cy.contains('Nishi-Akashi');
      cy.contains('Himeji');
      cy.contains('Wadayama');
      cy.contains('Fukuchiyama');
      cy.contains('Miyazu');
      cy.contains('Amanohashidate');
      cy.contains('Sang Railway Hokusei Line');
      cy.contains('Yoro Railway');
      cy.contains('Tokaido Main Line');
      cy.contains('Shinkansen');
      cy.contains('JR Takarazuka Line');
      cy.contains('Bantan Line');
      cy.contains('San-in Line');
      cy.contains('Kyoto Tango Railway Miyafuku Line');
      cy.contains('Kyoto Tango Railway Miyatoyo Line');

      // Simulate the user closing the modal
      cy.get('[data-testid^="close-modal-0"]').click();
    });

    // Simulate the user removing the trip
    // Trip card should not be visible, and the "No Saved Trips Found" card should be rendered
    it("Successfully removed current user's saved trips", () => {
        // Navigate to View Trips page
        cy.get("a").contains('View Trips').click();
        // Simulate user clicking on the Delete button
        cy.get('[data-testid^="remove-trip-0"]').click();

        // Check if the trips is not there anymore, and the "No Saved Trips Found" is rendered
        cy.get('[data-testid^="trip-card-0"]').should('not.exist');
        cy.get('[data-testid="no-trips-card"]').should('exist');
    });

    it('Pass recommender page rendering and functionality of pass recommender redirect', () => {
        // Check that the nav bar redirect to pass recommender is working
        cy.get("a").contains('Pass Recommender').click();
        cy.get('div').contains('Start Station').should('exist');
        cy.get('div').contains('End Station').should('exist');
        // Select the div element with class "submit-btn"
        cy.get('div.submit-btn')
        // Check if it contains a button with the specified text
        .contains('button', 'Get Pass Recommendation')
        .should('exist');
    });

    it('Logout functionality and rendering of login page', () => {
        // Check that the nav bar logout functionality is working
        cy.get("a").contains('Logout').click();
        cy.get('h1').contains('Welcome to Metro Pass Planner').should('exist');
        cy.get('button').contains('Login').should('exist');
    })
})