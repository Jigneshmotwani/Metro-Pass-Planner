import React, { useState, useEffect } from 'react';
import '../App.css';
import Nav from './Nav';
import {
  get_shortest_route,
  get_all_station_details,
} from '../components/get_shortest_path';
import { act } from 'react-dom/test-utils';

// Station data
function getAllStationDetailsPromise() {
  return new Promise((resolve, reject) => {
    // Call the async function
    get_all_station_details()
      .then((stations) => {
        // Resolve the promise with the retrieved stations
        resolve(stations);
      })
      .catch((error) => {
        // Reject the promise if there was an error in the async function
        reject(error);
      });
  });
}

const passes = ['Kansai Thru Pass', 'JR Pass', 'Both'];

function RouteRecommender() {
  const [startName, setStartName] = useState('');
  const [endName, setEndName] = useState('');
  const [routeVisible, setRouteVisible] = useState(false);
  const [pass, setPass] = useState('');
  const [linesTaken, setLinesTaken] = useState([]);
  const [transferStations, setTransferStations] = useState([]);
  const [stations, setStations] = useState([]);

  const userID = window.localStorage.getItem('userID');

  useEffect(() => {
    getAllStationDetailsPromise()
      .then((stations) => {
        act(() => {
          setStations(stations); // This is the state update causing the warning
        });
      })
      .catch((error) => {
        console.error('Error retrieving stations:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (!/^[A-Za-z\s]*$/.test(value)) {
      // Display a popup or alert for invalid input
      alert('Invalid input. Please use only alphabets.');
      return;
    }

    if (id === 'startName') {
      setStartName(value);
    } else if (id === 'endName') {
      setEndName(value);
    } else if (id === 'pass') {
      setPass(value);
    }
  };

  const showSuggestions = (event, inputId, dropdownId) => {
    const input = document.getElementById(inputId);
    const inputValue = input.value.toLowerCase();
    const dropdownContainer = document.getElementById(dropdownId);

    while (dropdownContainer.firstChild) {
      dropdownContainer.removeChild(dropdownContainer.firstChild);
    }

    if (inputValue.length === 0) {
      dropdownContainer.style.display = 'none';
      return;
    }

    let matchingItems;
    if (inputId === 'pass') {
      matchingItems = passes.filter((pass) =>
        pass.toLowerCase().startsWith(inputValue)
      );
    } else {
      matchingItems = stations.filter((station) =>
        station.name.toLowerCase().startsWith(inputValue)
      );
    }

    matchingItems.sort((a, b) => {
      const nameA = (a.name || a).toLowerCase();
      const nameB = (b.name || b).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    if (matchingItems.length > 0) {
      dropdownContainer.style.display = 'block';

      matchingItems.forEach((item) => {
        const suggestion = document.createElement('div');
        suggestion.setAttribute('class', 'suggestion');
        suggestion.textContent = item.name || item;
        suggestion.addEventListener('click', () => {
          input.value = item.name || item;
          dropdownContainer.style.display = 'none';
          if (inputId === 'startName') {
            setStartName(item.name || item);
          } else if (inputId === 'endName') {
            setEndName(item.name || item);
          } else if (inputId === 'pass') {
            setPass(item.name || item);
          }
        });
        dropdownContainer.appendChild(suggestion);
      });
    } else {
      dropdownContainer.style.display = 'none';
    }
  };

  const getRouteRecommendation = async () => {

  // Check if all text boxes are filled
  if (!startName || !endName || !pass) {
    alert('Please fill in all the required information.');
    return;
  }

    // Check if all text boxes are filled
    if (startName && endName && pass) {
      // Check if the entered values are present in the station list or passes list
      const isValidStartStation = stations.some(
        (station) => station.name === startName
      );
      const isValidEndStation = stations.some(
        (station) => station.name === endName
      );
      const isValidPass = passes.includes(pass);

      // Display the route box if all conditions are met
      if (isValidStartStation && isValidEndStation && isValidPass) {
        const [linesTaken, transferStations] = await get_shortest_route(
          startName,
          endName,
          pass
        );
        setLinesTaken(linesTaken);
        setTransferStations(transferStations);
        setRouteVisible(true);
      } else {
        alert('Invalid input. Please check your input and try again.');
      }
    }
  };

  const saveTrip = async () => {
    if (
      startName &&
      endName &&
      pass &&
      linesTaken.length > 0 &&
      transferStations.length > 0
    ) {
      const tripData = {
        userID,
        startName,
        endName,
        pass,
        linesTaken,
        transferStations,
      };

      try {
        const response = await fetch('http://localhost:4000/api/savetrips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tripData),
        });
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error saving trip:', error);
        alert('Failed to save trip. Please try again later.');
      }
    } else {
      alert('Unable to save trip. Please fill all required information.');
    }
  };

  return (
    <div className="container">
      <Nav />
      <div className="rectangle">
        <div className="sub-rectangle">
          <label htmlFor="startName" className="label">
            <h3>Start Station:</h3>
          </label>
          <input
            type="text"
            className="input"
            id="startName"
            value={startName}
            autoComplete="off"
            onChange={handleInputChange}
            onInput={(event) =>
              showSuggestions(event, 'startName', 'startDropdown')
            }
            data-testid="start-input"
          />
        </div>
        <div
          id="startDropdown"
          className="dropdown-container"
          data-testid="startDropdown"
        ></div>
      </div>
      <div className="rectangle">
        <div className="sub-rectangle">
          <label htmlFor="endName" className="label">
            <h3>End Station:</h3>
          </label>
          <input
            type="text"
            className="input"
            id="endName"
            value={endName}
            autoComplete="off"
            onChange={handleInputChange}
            onInput={(event) =>
              showSuggestions(event, 'endName', 'endDropdown')
            }
            data-testid="end-input"
          />
        </div>
        <div
          id="endDropdown"
          className="dropdown-container"
          data-testid="endDropdown"
        ></div>
      </div>

      <div className="rectangle">
        <div className="sub-rectangle pass">
          {' '}
          {/* Added "pass" class */}
          <label htmlFor="pass" className="label">
            <h3>Pass Bought:</h3>
          </label>
          <input
            type="text"
            className="input"
            id="pass"
            value={pass}
            autoComplete="off"
            onChange={handleInputChange}
            onInput={(event) => showSuggestions(event, 'pass', 'passDropdown')}
            data-testid="pass-input"
          />
        </div>
        <div
          id="passDropdown"
          className="dropdown-container pass"
          data-testid="passDropdown"
        ></div>{' '}
        {/* Added "pass" class */}
      </div>

      <div className="submit-btn" data-testid="getRouteButton">
        <button onClick={getRouteRecommendation}>
          Get Route Recommendation
        </button>
      </div>
      <div data-testid="routeBox">
        {routeVisible ? (
          <div className="route-box" id="routeBox" data-testid="routeBox">
            {linesTaken.length === 0 ? (
              <h3>No path exists with the current pass</h3>
            ) : (
              <>
                <h3>
                  <b>Route</b>
                </h3>
                <ul>
                  {linesTaken.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <br></br>
                <h3>
                  <b>Transfer Stations</b>
                </h3>
                <ul>
                  {transferStations.map((station) => (
                    <li key={station}>{station}</li>
                  ))}
                </ul>
                <div className="save-trip">
                  <button
                    className="save-trip-button"
                    onClick={saveTrip}
                    data-testid="save-trip-button"
                  >
                    <span className="underline">
                      <h2>Save Trip!</h2>
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default RouteRecommender;
