import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
} from '@testing-library/react';
import PassRecommender from '../screens/passRecommender.js';
import { BrowserRouter } from 'react-router-dom';
import {
  get_shortest_route,
  get_all_station_details,
} from '../components/get_shortest_path';

jest.mock('../components/get_shortest_path', () => ({
  get_all_station_details: jest.fn(() =>
    Promise.resolve([{ name: 'Osaka' }, { name: 'Kyoto' }, { name: 'Tokyo' }])
  ),
  get_shortest_route: jest.fn(() =>
    Promise.resolve([['Osaka Line'], ['Tokyo', 'Kyoto']])
  ),
}));

describe('PassRecommender', () => {
  beforeEach(() => {
    get_all_station_details.mockResolvedValue([
      { name: 'Tokyo' },
      { name: 'Kyoto' },
      { name: 'Osaka' },
    ]);
    get_shortest_route.mockResolvedValue([['Tokyo', 'Osaka'], ['Kyoto']]);
    // Spy on window.alert
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  let alertSpy;

  afterEach(() => {
    // Clean up the spy
    alertSpy.mockRestore();
  });

  it('renders without crashing', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <PassRecommender />
      </BrowserRouter>
    );
    await act(async () => {
      expect(getByText('Start Station:')).toBeInTheDocument();
      expect(getByText('End Station:')).toBeInTheDocument();
      expect(getByText('Get Pass Recommendation')).toBeInTheDocument();
    });
  });

  it('should show an alert when the input is empty', async () => {
    const { getByPlaceholderText, getByText } = render(<BrowserRouter>
      <PassRecommender />
    </BrowserRouter>);

    // Mocking the alert
    window.alert = jest.fn();

    const startStationInput = getByPlaceholderText('Type Start Station Name Here');
    const endStationInput = getByPlaceholderText('Type End Station Name Here');
    const submitButton = getByText('Get Pass Recommendation');

    await act(async () => {

    fireEvent.change(startStationInput, { target: { value: '' } });
    fireEvent.change(endStationInput, { target: { value: '' } });
    fireEvent.click(submitButton);
  });

    expect(window.alert).toHaveBeenCalledWith('Empty input. Please enter valid station names.');
  });

  it('shows an alert when user input is not alphabets', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <PassRecommender />
      </BrowserRouter>
    );
    const startInput = getByPlaceholderText('Type Start Station Name Here');
    const endInput = getByPlaceholderText('Type End Station Name Here');
    const button = getByText('Get Pass Recommendation');

    await act(async () => {
      fireEvent.change(startInput, { target: { value: '123' } });
      fireEvent.change(endInput, { target: { value: '456' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Invalid input. Please only use alphabets for station names.'
      );
    });
  });

  it('shows an alert when user input is not a valid station name', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <PassRecommender />
      </BrowserRouter>
    );
    const startInput = getByPlaceholderText('Type Start Station Name Here');
    const endInput = getByPlaceholderText('Type End Station Name Here');
    const button = getByText('Get Pass Recommendation');

    await act(async () => {
      fireEvent.change(startInput, { target: { value: 'ahbkh' } });
      fireEvent.change(endInput, { target: { value: 'ahbkh' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid station name.');
    });
  });

  it('RecommenderBox appears after button click', async () => {
    const { getByText, queryByText } = render(
      <BrowserRouter>
        <PassRecommender />
      </BrowserRouter>
    );

    // Initially, the RecommenderBox should not be in the document
    expect(queryByText('recommender-box')).not.toBeInTheDocument();

    // Find the button and click it
    const button = getByText(/Get Pass Recommendation/i);

    await act(async () => {
      fireEvent.click(button);
    });

    // After clicking the button, the RecommenderBox should be in the document
    await waitFor(() => {
      expect(queryByText('Your Pass Recommendation:')).toBeInTheDocument();
    });
  });

  it('shows the spinner while fetching data and hides it once data is fetched', async () => {
    const { getByText, queryByTestId } = render(
      <BrowserRouter>
        <PassRecommender />
      </BrowserRouter>
    );
    const button = getByText(/Get Pass Recommendation/i);

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      // The spinner should be visible while data is being fetched
      expect(queryByTestId('loading-spinner')).toBeInTheDocument();
    });

    await waitFor(() => {
      // The spinner should not be visible once data has been fetched
      const element = screen.queryByTestId('Loading...');
      expect(element).not.toBeInTheDocument();
    });
  });
});
