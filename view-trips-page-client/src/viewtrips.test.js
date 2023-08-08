import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ViewTripsPage from './routes/ViewTrips';

describe('ViewTripsPage Integration Tests', () => {
  const server = setupServer(
    rest.get('http://localhost:5000/trips', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            _id: '64ae23ce0e6aaaaeb66c5ba3',
            userID: '0',
            startName: 'Kobe Haborland',
            endName: 'Hotarugaike',
            pass: 'Kansai Thru',
            linesTaken: [
              'Kobe_Municipal_Subway',
              'Sanyo Electric Railway Main Line',
              'Hanshin Main Line',
              'Hankyu-Kobe Line',
              'Hankyu-Takarazuka Line',
            ],
            transferStations: [
              'Kobe Haborland',
              'Itayado',
              'Nishidai',
              'Kosoku-Kobe',
              'Juso',
              'Hotarugaike',
            ],
          },
          {
            _id: '64ae24bb0e6aaaaeb66c5ba4',
            userID: '0',
            startName: 'Kosoku-Kobe',
            endName: 'Kuzuha',
            pass: 'Kansai Thru',
            linesTaken: [
              'Hankyu-Kobe Line',
              'Hankyu-Kyoto Line',
              'Hankyu-Senri Line',
              'Osaka Monorail',
              'Keihan Main Line',
            ],
            transferStations: [
              'Kosoku-Kobe',
              'Juso',
              'Awaji',
              'Yamada',
              'Kodomashi',
              'Kuzuha',
            ],
          },
          {
            _id: '64ae24c90e6aaaaeb66c5ba5',
            userID: '0',
            startName: 'Oishi',
            endName: 'Toyonaka',
            pass: 'Kansai Thru',
            linesTaken: [
              'Hanshin Main Line',
              'Hankyu-Kobe Line',
              'Hankyu-Takarazuka Line',
            ],
            transferStations: ['Oishi', 'Kobe-Sannomiya', 'Juso', 'Toyonaka'],
          },
        ])
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  // Current user: userID = "0"
  test("renders the page with current user's trip cards", async () => {
    render(<ViewTripsPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Kobe Haborland to Hotarugaike')
      ).toBeInTheDocument();
      expect(screen.getByText('Kosoku-Kobe to Kuzuha')).toBeInTheDocument();
      expect(screen.getByText('Oishi to Toyonaka')).toBeInTheDocument();
    });
  });

  test('preperly opening and closing the trip modal', async () => {
    render(<ViewTripsPage />);

    await waitFor(() => {
      // Simulate clicking the MoreVert button to open the modal
      fireEvent.click(screen.getByTestId('open-modal-0'));

      // Test if the modal is opened by checking if the Modal's Title is present
      expect(screen.getByText('Trip Information')).toBeInTheDocument();

      // Simulate clicking the ModalClose button to close the modal
      fireEvent.click(screen.getByTestId('close-modal-0'));

      // Assert that the modal is closed
      waitFor(() => {
        expect(screen.getByText('Trip Information')).not.toBeInTheDocument();
      });
    });
  });

  test('renders the modal with the trip information', async () => {
    render(<ViewTripsPage />);

    await waitFor(() => {
      // Simulate clicking the MoreVert button to open the modal
      fireEvent.click(screen.getByTestId('open-modal-0'));

      // Test if the modal is opened by checking if the Modal's Title is present
      expect(screen.getByText('Trip Information')).toBeInTheDocument();

      // Test if modal information is rendered properly
      expect(screen.getByText('Station 1: Kobe Haborland')).toBeInTheDocument();
      expect(screen.getByText('Kobe_Municipal_Subway')).toBeInTheDocument();
      expect(screen.getByText('Station 2: Itayado')).toBeInTheDocument();
      expect(
        screen.getByText('Sanyo Electric Railway Main Line')
      ).toBeInTheDocument();
      expect(screen.getByText('Station 3: Nishidai')).toBeInTheDocument();
      expect(screen.getByText('Hanshin Main Line')).toBeInTheDocument();
      expect(screen.getByText('Station 4: Kosoku-Kobe')).toBeInTheDocument();
      expect(screen.getByText('Hankyu-Kobe Line')).toBeInTheDocument();
      expect(screen.getByText('Station 5: Juso')).toBeInTheDocument();
      expect(screen.getByText('Hankyu-Takarazuka Line')).toBeInTheDocument();
      expect(screen.getByText('Station 6: Hotarugaike')).toBeInTheDocument();
    });
  });

  test('renders the No Saved Trips Found card if user has no saved trips', async () => {
    server.use(
      rest.get('http://localhost:5001/trips', (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    render(<ViewTripsPage />);

    await waitFor(() => {
      expect(screen.getByText('No Saved Trips Found')).toBeInTheDocument();
    });
  });
});
