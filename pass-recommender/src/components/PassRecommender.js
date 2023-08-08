import React, { useState, useEffect } from 'react';
import { get_shortest_route } from './get_shortest_path.js';

const PassRecommender = () => {
  const [selectedTrip, setSelectedTrip] = useState({
    start_station: "",
    end_station: "",
  });
  const [passRecommendation, setPassRecommendation] = useState("");
  const [stationNames, setStationNames] = useState([]); 
  const [startStationSuggestions, setStartStationSuggestions] = useState([]);
  const [endStationSuggestions, setEndStationSuggestions] = useState([]);
  
  const [buttonClicked, setButtonClicked] = useState(false);
  const [options, setOptions] = useState([]); // initialize options as empty array

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
        const response = await fetch(`http://localhost:5001/trips`);
        const trips = await response.json();
        // Filter trips by user ID before setting state
        const userTrips = trips.filter(trip => trip.userID === userID);
        setOptions(userTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  const handleDropdownChange = (event) => {
    const selected_dropdown = event.target.value;
    const selectedTrip = options.find(
      (options) => options._id === selected_dropdown
    );

    
    if (selected_dropdown) {
      // Update selectedTrip with start_station and end_station
      setSelectedTrip({
        ...selectedTrip,
        start_station: selectedTrip.startName,
        end_station: selectedTrip.endName,
      });
    }


  };

  async function get_pass_recommendation(selectedTrip) {
    const passes = ["JR Pass", "Kansai Thru Pass", "Both"];
    let bestPass = [];
    let shortestPathLength = Infinity;
    // let leastLinesTaken = Infinity;

    for (let pass of passes) {
      try {
        const [linesTaken, transferStations] = await get_shortest_route(
          selectedTrip.startName,
          selectedTrip.endName,
          pass
        );

        if (linesTaken.length === 0 && transferStations.length === 0) {
          continue;
        }

        if (transferStations.length <= shortestPathLength) {
          shortestPathLength = transferStations.length;
          bestPass.push(pass);
        }
        
      } catch (error) {
        continue;
      }
      
    }
    const recommended_passes = bestPass.join(", ")
    return recommended_passes;
  }

  const displayPassRecommendation = async () => {
    try {
      const recommendation = await get_pass_recommendation(selectedTrip);
      setPassRecommendation(recommendation);
      setButtonClicked(true);
    } catch (error) {
      console.error('Error getting pass recommendation:', error);
    }
  };

  return (
    <div className="container">
      <div className="select_trip_rectangle highlight">
        <p className="header-text">Select Trip</p>
        <select
          className="dropdown"
          onChange={handleDropdownChange}
          id="select-trip-dropdown"
        >
          <option value="">Select Trip</option>
          {options.map((option) => (
            <option key={option._id} value={option._id}>
              {option.startName} to {option.endName}
            </option>
          ))}
        </select>
      </div>

      <div className="submit-btn button">
        <button onClick={displayPassRecommendation}>
          Get Pass Recommendation
        </button>
      </div>

      <div className="recommender-box" style={{ display: buttonClicked ? 'block' : 'none' }}>
        <p>Your Pass Recommendation:</p>
        {passRecommendation && <p>{passRecommendation}</p>}
      </div>
    </div>
  );
};

export default PassRecommender;
