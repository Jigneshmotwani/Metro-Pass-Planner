/* View Trips Page */
import React, { useEffect, useState } from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalOverflow from '@mui/joy/ModalOverflow';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/joy/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faEllipsisVertical,
  faDumpster,
} from '@fortawesome/free-solid-svg-icons';
import MoreVert from '@mui/icons-material/MoreVert';
import Nav from './Nav';

const ViewTripsPage = () => {
  // Set useState arrays and layouts
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [modalLayouts, setModalLayouts] = useState({});

  // Get User ID
  const userID = window.localStorage.getItem('userID');

  // Query all saved trips in MongoDB
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/gettrips");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  // Filter the trips based on the user's ID
  useEffect(() => {
    if (trips.length > 0) {
      const filteredData = trips.filter((trip) => trip.userID === userID);
      setFilteredTrips(filteredData);
    }
  }, [trips, userID]);

  // Open and close functions for Modal
  const openModal = (tripId) => {
    setModalLayouts((prevLayouts) => ({
      ...prevLayouts,
      [tripId]: 'center',
    }));
  };

  const closeModal = (tripId) => {
    setModalLayouts((prevLayouts) => ({
      ...prevLayouts,
      [tripId]: undefined,
    }));
  };

  // Function to remove a trip from MongoDB database
  const removeTrip = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/removetrip/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFilteredTrips((prevFilteredTrips) =>
          prevFilteredTrips.filter((trip) => trip._id !== tripId)
        );
      } else {
        console.error('Failed to remove the trip:', response.statusText);
      }
    } catch (error) {
      console.error('Error while removing the trip:', error);
    }
  };

  return (
    <div className="container">
      <Nav />
      {filteredTrips.length === 0 ? (
        <div className="no-saved-trips-card">
          <Card
            data-testid="no-trips-card"
            variant="outlined"
            sx={{
              bgcolor: 'background.body',
              '&:hover, &:focus-within': {
                bgcolor: 'background.level2',
              },
              boxShadow: 'inset 0 1px 0 0 rgb(255 255 255 / 5%)',
            }}
          >
            <Link
              overlay
              href="/routeRecommender"
              underline="none"
              fontWeight="md"
            >
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Typography component="div">No Saved Trips Found</Typography>
              </Box>
            </Link>
            <div
              style={{
                marginTop: '-20px',
                marginBottom: '-10px',
                marginLeft: '930px',
              }}
            >
              <Add />
            </div>
            <Typography level="body2">Click here to add a trip</Typography>
          </Card>
        </div>
      ) : (
        filteredTrips.map((trip, index) => (
          <div key={trip._id} className="trip-card">
            <div className="trip-card-counter"> {index + 1}. </div>
            <Card
              variant="outlined"
              sx={{ width: 350 }}
              data-testid={`trip-card-${index}`}
            >
              <div>
                <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }} data-testid={`trip-name-${index}`}>
                  {' '}
                  {trip.startName} to {trip.endName}{' '}
                </Typography>
              </div>
              <CardContent orientation="horizontal">
                <div>
                  <Typography level="body3"> Pass: </Typography>
                  <Typography fontSize="lg" fontWeight="lg">
                    {' '}
                    {trip.pass}{' '}
                  </Typography>
                  <IconButton
                    data-testid={`remove-trip-${index}`}
                    variant="solid"
                    color="danger"
                    size="sm"
                    sx={{ position: 'absolute', top: '0.875rem', right: '1rem' }}
                    onClick={() => {
                      removeTrip(trip._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faDumpster}/>
                  </IconButton>
                </div>
                <React.Fragment>
                  <IconButton
                    data-testid={`open-modal-${index}`}
                    variant="outlined"
                    color="neutral"
                    size="sm"
                    onClick={() => {
                      openModal(trip._id);
                    }}
                    sx={{ ml: 'auto', fontWeight: 600 }}
                    style={{ position: 'absolute', bottom: 15, right: 15 }}
                  >
                    <MoreVert />
                  </IconButton>
                  <Modal
                    open={Boolean(modalLayouts[trip._id])}
                    onClose={() => closeModal(trip._id)}
                  >
                    <ModalOverflow>
                      <ModalDialog
                        aria-labelledby={`modal-dialog-overflow-${trip._id}`}
                        layout={modalLayouts[trip._id]}
                      >
                        <ModalClose
                          onClose={() => closeModal(trip._id)}
                          data-testid={`close-modal-${index}`}
                        />
                        <Typography
                          id={`modal-dialog-overflow-${trip._id}`}
                          component="h2"
                        >
                          Trip Information
                        </Typography>
                        <List>
                          {trip.transferStations.map((item, index) => (
                            <ListItem key={index}>
                              {item ===
                              trip.transferStations[
                                trip.transferStations.length - 1
                              ] ? (
                                <span>
                                  {' '}
                                  Station {index + 1}: {item}{' '}
                                </span>
                              ) : (
                                <>
                                  <div>
                                    <span>
                                      Station {index + 1}: {item}
                                    </span>
                                    <div style={{ marginLeft: '0.795rem' }}>
                                      <FontAwesomeIcon
                                        icon={faArrowDown}
                                        style={{ marginTop: '0.7rem' }}
                                      />
                                    </div>
                                    <div style={{ marginLeft: '1.07rem' }}>
                                      <FontAwesomeIcon
                                        icon={faEllipsisVertical}
                                        style={{ marginRight: '0.5rem' }}
                                      />
                                      <span>{trip.linesTaken[index]}</span>
                                    </div>
                                    <div style={{ marginLeft: '0.795rem' }}>
                                      <FontAwesomeIcon icon={faArrowDown} />
                                    </div>
                                  </div>
                                </>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </ModalDialog>
                    </ModalOverflow>
                  </Modal>
                </React.Fragment>
              </CardContent>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewTripsPage;
