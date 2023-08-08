/* eslint-disable jest/no-conditional-expect */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable no-undef */
/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from '@testing-library/react';
import RouteRecommender from '../screens/routeRecommender';
import { BrowserRouter, MemoryRouter, Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

describe('RouteRecommender', () => {
  let originalAlert;

  beforeEach(() => {
    // Save the original window.alert function and replace it with a mock
    originalAlert = window.alert;
    window.alert = jest.fn();
  });

  afterEach(() => {
    // Restore the original window.alert function
    window.alert = originalAlert;
  });

  test('should render the component', () => {
    render(
      <BrowserRouter>
        <RouteRecommender />
      </BrowserRouter>
    );
    expect(screen.getByText('Route Recommender')).toBeInTheDocument();
    expect(screen.getByText('Start Station:')).toBeInTheDocument();
    expect(screen.getByText('End Station:')).toBeInTheDocument();
    expect(screen.getByText('Pass Bought:')).toBeInTheDocument();
  });

  test('renders the input fields correctly', () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    const startInput = screen.getByLabelText('Start Station:');
    const endInput = screen.getByLabelText('End Station:');
    const passInput = screen.getByLabelText('Pass Bought:');

    expect(startInput).toBeInTheDocument();
    expect(endInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
  });

  test('should display dropdown when typing in the start station input', async () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    const startInput = screen.getByLabelText('Start Station:');
    fireEvent.focus(startInput); // Focus on the input

    fireEvent.input(startInput, { target: { value: 'SomeStation' } }); // Simulate typing
    const startDropdown = screen.getByTestId('startDropdown');

    // Wait for a short period to allow for potential debounce/throttle effects
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(startDropdown).toBeInTheDocument();
  });

  test('should display dropdown when typing in the end station input', async () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    const endInput = screen.getByLabelText('End Station:');
    fireEvent.focus(endInput); // Focus on the input

    fireEvent.input(endInput, { target: { value: 'SomeStation' } }); // Simulate typing
    const endDropdown = screen.getByTestId('endDropdown'); // Get the end station dropdown

    // Wait for a short period to allow for potential debounce/throttle effects
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(endDropdown).toBeInTheDocument();
  });

  test('should display dropdown when typing in the pass input', async () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    const passInput = screen.getByLabelText('Pass Bought:');
    fireEvent.focus(passInput); // Focus on the input

    fireEvent.input(passInput, { target: { value: 'SomePass' } }); // Simulate typing
    const passDropdown = screen.getByTestId('passDropdown'); // Get the pass dropdown

    // Wait for a short period to allow for potential debounce/throttle effects
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(passDropdown).toBeInTheDocument();
  });

  test('displays alert for invalid input (Anything other than alphabets, should give an alert)', () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    const startInput = screen.getByTestId('start-input'); // Adjust the data-testid accordingly

    // Simulate entering non-alphabet characters (e.g., numbers)
    fireEvent.change(startInput, { target: { value: '123' } });

    // Trigger the input validation
    fireEvent.blur(startInput);

    // Check if the alert message is displayed
    const alertMessage = 'Invalid input. Please use only alphabets.';
    expect(window.alert).toHaveBeenCalledWith(alertMessage);
  });

  test('displays route box when "Get Route Recommendation" button is clicked', () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    // Fill in the input fields with valid data
    fireEvent.change(screen.getByTestId('start-input'), {
      target: { value: 'Ageki' },
    });
    fireEvent.change(screen.getByTestId('end-input'), {
      target: { value: 'Abeno' },
    });
    fireEvent.change(screen.getByTestId('pass-input'), {
      target: { value: 'Both' },
    });

    // Click the "Get Route Recommendation" button
    fireEvent.click(screen.getByTestId('getRouteButton'));

    // Check if the route box is visible
    const routeBox = screen.getByTestId('routeBox');
    expect(routeBox).toBeInTheDocument();
  });

  test('displays alert when the start station field is not filled', () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    // Fill in the start station and end station input fields
    fireEvent.change(screen.getByTestId('pass-input'), {
      target: { value: 'Both' },
    });
    fireEvent.change(screen.getByTestId('end-input'), {
      target: { value: 'Abeno' },
    });

    // Click the "Get Route Recommendation" button
    fireEvent.click(screen.getByText('Get Route Recommendation'));

    // Check if the alert message appears
    const alertMessage = 'Please fill in all the required information.';
    expect(window.alert).toHaveBeenCalledWith(alertMessage);
  });

  test('displays alert when the end station field is not filled', () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    // Fill in the start station and end station input fields
    fireEvent.change(screen.getByTestId('start-input'), {
      target: { value: 'Ageki' },
    });
    fireEvent.change(screen.getByTestId('pass-input'), {
      target: { value: 'Both' },
    });

    // Click the "Get Route Recommendation" button
    fireEvent.click(screen.getByText('Get Route Recommendation'));

    // Check if the alert message appears
    const alertMessage = 'Please fill in all the required information.';
    expect(window.alert).toHaveBeenCalledWith(alertMessage);
  });


  test('displays alert when the pass bought field is not filled', () => {
    render(
      <MemoryRouter>
        <RouteRecommender />
      </MemoryRouter>
    );

    // Fill in the start station and end station input fields
    fireEvent.change(screen.getByTestId('start-input'), {
      target: { value: 'Ageki' },
    });
    fireEvent.change(screen.getByTestId('end-input'), {
      target: { value: 'Abeno' },
    });

    // Click the "Get Route Recommendation" button
    fireEvent.click(screen.getByText('Get Route Recommendation'));

    // Check if the alert message appears
    const alertMessage = 'Please fill in all the required information.';
    expect(window.alert).toHaveBeenCalledWith(alertMessage);
  });
});