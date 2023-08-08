/* View Trips Page */
import React, { useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import MoreVert from '@mui/icons-material/MoreVert';
// import { getAuth } from "firebase/auth";

const ViewTripsPage = () => {
  // Set useState arrays and layouts
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [modalLayouts, setModalLayouts] = useState({});

  // Replace with userID from authentication response

  /*

  const userID = window.localStorage.getItem("userID")

  */

  // Test User
  const userID = '0';

  // Query all saved trips in MongoDB
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`http://localhost:5000/trips`);
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
    const filteredData = trips.filter((trip) => trip.userID === userID);
    setFilteredTrips(filteredData);
  }, [trips]);

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

  return (
    <>
      <h1 style={{ marginBottom: '2rem' }}>
        <u>View Saved Trips</u>
      </h1>
      {filteredTrips.length === 0 ? (
        <div>
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
            <Link overlay href="/" underline="none" fontWeight="md">
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Typography component="div">No Saved Trips Found</Typography>
              </Box>
            </Link>
            <div
              style={{
                marginTop: '-20px',
                marginBottom: '-20px',
                marginLeft: '1090px',
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
              sx={{ width: 300 }}
              data-testid={`trip-card-${index}`}
            >
              <div>
                <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
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
                </div>
                <React.Fragment>
                  <Button
                    data-testid={`open-modal-${index}`}
                    variant="outlined"
                    color="neutral"
                    size="sm"
                    onClick={() => {
                      openModal(trip._id);
                    }}
                    sx={{ ml: 'auto', fontWeight: 600 }}
                  >
                    <MoreVert />
                  </Button>
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
    </>
  );
};

export default ViewTripsPage;
