import React, { useState, useEffect } from 'react';
import {
  get_shortest_route,
  get_all_station_details,
} from '../components/get_shortest_path';
import Nav from './Nav';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
});

const PassRecommender = () => {
  const [start_station, setStartStation] = useState('');
  const [end_station, setEndStation] = useState('');
  const [passRecommendation, setPassRecommendation] = useState('');
  const [stations, setStations] = useState([]);
  const [startStationSuggestions, setStartStationSuggestions] = useState([]);
  const [endStationSuggestions, setEndStationSuggestions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const fetchStationNames = async () => {
      try {
        const response = await getAllStationDetailsPromise();
        // Extract the 'name' property from each item in response
        const responseStrings = response.map((item) => item.name);
        const uniqueStationNames = [...new Set(responseStrings)];
        setStations(uniqueStationNames);
      } catch (error) {
        console.error('Error fetching station names:', error);
      }
    };
    fetchStationNames();
  }, []);

  const isValidInput = (input) => {
    // Check if input is only alphabets
    const alphaOnlyRegex = /^[A-Za-z\s()-]+$/;
    return alphaOnlyRegex.test(input);
  };

  const handleStartStationChange = (event) => {
    const textinput = event.target.value;
    setStartStation(textinput);

    const filtered = stations.filter((name) =>
      name.toLowerCase().startsWith(textinput.toLowerCase())
    );
    setStartStationSuggestions(filtered);
  };

  const handleEndStationChange = (event) => {
    const textinput = event.target.value;
    setEndStation(textinput);

    const filtered = stations.filter((name) =>
      name.toLowerCase().startsWith(textinput.toLowerCase())
    );
    setEndStationSuggestions(filtered);
  };

  async function findBestPass() {
    const passes = ['JR Pass', 'Kansai Thru Pass', 'Both'];
    let bestPass = [];
    let shortestPathLength = Infinity;

    for (let pass of passes) {
      try {
        const [linesTaken, transferStations] = await get_shortest_route(
          start_station,
          end_station,
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
    const recommended_passes = bestPass[0];
    return recommended_passes;
  }

  const displayPassRecommendation = async () => {
    setIsLoading(true);
    if (start_station.trim() === '' || end_station.trim() === '') {
      setIsLoading(false);
      alert('Empty input. Please enter valid station names.');
      return;
    }
    if (!isValidInput(start_station) || !isValidInput(end_station)) {
      setIsLoading(false);
      alert('Invalid input. Please only use alphabets for station names.');
      return;
    }
    if (!stations.includes(start_station) || !stations.includes(end_station)) {
      setIsLoading(false);
      alert('Invalid station name.');
      return;
    }
    try {
      const recommendation = await findBestPass();
      setPassRecommendation(recommendation);
      setButtonClicked(true);
    } catch (error) {
      console.error('Error getting pass recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Nav />
      <div className="rectangle highlight">
        <p className="text-lg pl-4 pt-3">Start Station:</p>
        <div className="input ml-2">
          <input
            type="text"
            className="input"
            id="startStation"
            autoComplete="off"
            value={start_station}
            onChange={handleStartStationChange}
            placeholder="Type Start Station Name Here"
          ></input>
          {start_station && (
            <div className="suggestion-box">
              {startStationSuggestions.map((name) => (
                <div
                  key={name}
                  onClick={() => {
                    setStartStation(name);
                    setStartStationSuggestions([]);
                  }}
                  style={{ padding: '10px', cursor: 'pointer' }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rectangle highlight">
        <p className="text-lg pl-4 pt-3">End Station:</p>
        <div className="input ml-2">
          <input
            type="text"
            className="input"
            id="endStation"
            autoComplete="off"
            value={end_station}
            onChange={handleEndStationChange}
            placeholder="Type End Station Name Here"
          ></input>
          {end_station && (
            <div className="suggestion-box">
              {endStationSuggestions.map((name) => (
                <div
                  key={name}
                  onClick={() => {
                    setEndStation(name);
                    setEndStationSuggestions([]);
                  }}
                  style={{ padding: '10px', cursor: 'pointer' }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="submit-btn button">
        <button onClick={displayPassRecommendation}>
          Get Pass Recommendation
        </button>
      </div>

      <div
        className="recommender-box"
        style={{ display: buttonClicked ? 'block' : 'none' }}
      >
        <p>Your Pass Recommendation:</p>
        {passRecommendation && <p>{passRecommendation}</p>}
      </div>

      <View
        testID="loading-spinner"
        style={[styles.container, styles.horizontal]}
      >
        {isLoading && (
          <div>
            <ActivityIndicator size="large" color="#45a049" />
            <p>Loading...</p>
          </div>
        )}
      </View>
    </div>
  );
};

export default PassRecommender;
