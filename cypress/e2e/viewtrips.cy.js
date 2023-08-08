/// <reference types="cypress" />

describe('viewTrips page System Testing', () => {

    // Run the viewTrips page before starting every test
    beforeEach(() => {
        cy.visit('http://localhost:3000/viewTrips')
    });

    // At the start, the current user does not have any saved trips
    // The "No Saved Trips Found" card should be rendered
    it('Successfully rendered the "No Saved Trips Found" card', () => {
        cy.get('[data-testid="no-trips-card"]').should('exist');
    });

    // Simulate user saving a trip
    // The saved trip should have its trip card rendered in the page
    it("Successfully rendered current user's saved trips", () => {

        // Simulate clicking on the "No Saved Trips Found" card
        cy.get('[data-testid="no-trips-card"]').click();
        
        // Check that RouteRecommender page has been rendered
        cy.get('div#startDropdown.dropdown-container').should('exist');
        cy.get('div#endDropdown.dropdown-container').should('exist');
        cy.get('div#passDropdown.dropdown-container').should('exist');
        cy.get('div.submit-btn')
        .contains('button', 'Get Route Recommendation')
        .should('exist');

        // Simulate saving a trip
        cy.get('[data-testid^="start-input"]').type('Ageki');
        cy.get('[data-testid^="end-input"]').type('Amanohashidate');
        cy.get('[data-testid^="pass-input"]').type('Both');
        cy.get('[data-testid^="getRouteButton"]').click();
        cy.wait(3000);
        cy.get('[data-testid^="save-trip-button"]').should('be.visible').click();

        // Route back to viewTrips page to check if the trip card has been rendered
        cy.get("a").contains('View Trips').click();
        cy.get('[data-testid^="trip-card-0"]').should('exist');
        cy.get('[data-testid^="trip-name-0"]').contains('Ageki to Amanohashidate');
    });

    // Simulate opening and closing the modal
    // Modal should have the correct information shown to user
    it("Able to open and close modal, and modal gives correct information", () => {

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

        // Simulate user clicking on the Delete button
        cy.get('[data-testid^="remove-trip-0"]').click();

        // Check if the trips is not there anymore, and the "No Saved Trips Found" is rendered
        cy.get('[data-testid^="trip-card-0"]').should('not.exist');
        cy.get('[data-testid="no-trips-card"]').should('exist');
    });
})