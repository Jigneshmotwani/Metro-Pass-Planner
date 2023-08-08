import React, { useState } from 'react';
import './App.css';
import { get_shortest_route, get_stations_details } from './get_shortest_path';


// Station data
const stations = [
  { name: 'Wakayama', lat: 34.2321803, lng: 135.1917916 },
      { name: 'Kishi', lat: 34.2093468, lng: 135.3120752 },
      { name: 'Gobo', lat: 33.9077129, lng: 135.1591588 },
      { name: 'Nishigobo', lat: 33.8867441, lng: 135.1529776 },
      { name: 'Mizumakannon', lat: 34.4034966, lng: 135.3855514 },
      { name: 'Kaizuka', lat: 34.4454668, lng: 135.3575322 },
      { name: 'Hamaderaekimae', lat: 34.541302, lng: 135.4431877 },
      { name: 'Sumiyoshitorii-mae', lat: 34.6126411, lng: 135.4912307 },
      { name: 'Shin-Imamiya', lat: 34.6497931, lng: 135.5015478 },
      { name: 'Kaminoki', lat: 34.6158318, lng: 135.4970568 },
      { name: 'Abeno', lat: 34.642719, lng: 135.5120601 },
      { name: 'Senbonguchi', lat: 34.3751, lng: 135.854 },
      { name: 'Yoshinoyama', lat: 34.356433, lng: 135.870617 },
      { name: 'Iga-Kambe', lat: 34.6738449, lng: 136.1529283 },
      { name: 'Uenoshi', lat: 34.7675506, lng: 136.1299722 },
      { name: 'Iga-Ueno', lat: 34.7890476, lng: 136.1235104 },
      { name: 'Tsu', lat: 34.7339925, lng: 136.5102434 },
      { name: 'Suzuka Circuit Ino', lat: 34.8410281, lng: 136.555011 },
      { name: 'Kawarada', lat: 34.9104849, lng: 136.5982819 },
      { name: 'Utsube', lat: 34.9255747, lng: 136.5868222 },
      { name: 'Hinaga', lat: 34.961172651993195, lng: 136.82966164254566 },
      { name: 'Nishihino', lat: 34.9528404, lng: 136.5909254 },
      { name: 'Kintetsu-Yokkaichi', lat: 34.966323, lng: 136.6182856 },
      { name: 'Kintetsu-Tomida', lat: 35.0071613, lng: 136.6494835 },
      { name: 'Nishifujiwara', lat: 35.1703311, lng: 136.4781727 },
      { name: 'Nishikuwana', lat: 35.06572999999999, lng: 136.6839986 },
      { name: 'Ageki', lat: 35.1463557, lng: 136.5189823 },
      { name: 'Ogaki', lat: 35.3667775, lng: 136.6178259 },
      { name: 'Shigaraki', lat: 34.8768713, lng: 136.0610059 },
      { name: 'Kibukawa', lat: 34.9522429, lng: 136.1539475 },
      { name: 'Yokaichi', lat: 35.11668102611839, lng: 136.19449006847339 },
      { name: 'Omi-Hachiman', lat: 35.1228549, lng: 136.1027877 },
      { name: 'Takamiya', lat: 35.237565704327714, lng: 136.26042070739328 },
      { name: 'Tagataisha-mae', lat: 35.22681659139466, lng: 136.28386141297068 },
      { name: 'Hikone', lat: 35.2722128, lng: 136.2633541 },
      { name: 'Maibara', lat: 35.3147704, lng: 136.2898448 },
      { name: 'Demachiyanagi', lat: 35.0304996, lng: 135.7732283 },
      { name: 'Takaragaike', lat: 35.05816910000001, lng: 135.7923413 },
      { name: 'Kurama', lat: 35.112925, lng: 135.772521 },
      { name: 'Yase-Hieizanguchi', lat: 35.0651813, lng: 135.808464 },
      { name: 'Cable Yase', lat: 35.0669137, lng: 135.8086642 },
      { name: 'Cable Hiei', lat: 35.0642135, lng: 135.8224871 },
      { name: 'Rope Hiei', lat: 35.0647588, lng: 135.8225021 },
      { name: 'Hiei-Sancho', lat: 35.0644387, lng: 135.8277419 },
      { name: 'Cable Sakamoto', lat: 35.069688, lng: 135.8639836 },
      { name: 'Cable Enryakuji', lat: 35.0665172, lng: 135.8438982 },
      { name: 'Torokko Kameoka', lat: 35.0131661, lng: 135.6067627 },
      { name: 'Torokko Saga', lat: 35.018568, lng: 135.6807823 },
      { name: 'Randen-Saga', lat: 35.0164687, lng: 135.6813695 },
      { name: 'Katabiranotsuji', lat: 35.01507891509694, lng: 135.69992201896818 },
      { name: 'Kitano-Hakubaicho', lat: 35.0273504, lng: 135.7308888 },
      { name: 'Randen-Tenjingawa', lat: 35.0102131, lng: 135.7151963 },
      { name: 'Sai', lat: 35.0033317, lng: 135.7316315 },
      { name: 'Shijo-omiya', lat: 35.0033444, lng: 135.7486099 },
      { name: 'Cable Sanjo', lat: 34.9238068, lng: 135.4570416 },
      { name: 'Myokenguchi Kurokawa', lat: 34.921746134705195, lng: 135.45093187249321 },
      { name: 'Osaka Airport', lat: 34.7913957, lng: 135.4420095 },
      { name: 'Hotarugaike', lat: 34.7946058, lng: 135.4493243 },
      { name: 'Senri-chuo', lat: 34.8074603, lng: 135.4952222 },
      { name: 'Yamada', lat: 34.8044545, lng: 135.5156721 },
      { name: 'Bampaku-kinen-koen', lat: 34.806038375762895, lng: 135.53152782380386 },
      { name: 'Saito-nishi', lat: 34.8552406, lng: 135.5228743 },
      { name: 'Minami-ibaraki', lat: 34.8023739, lng: 135.565189 },
      { name: 'Dainichi', lat: 34.74895619999999, lng: 135.5788473 },
      { name: 'Kadomashi', lat: 34.7380461, lng: 135.582928 },
      { name: 'Nishi-Maizuru', lat: 35.4417033, lng: 135.3305201 },
      { name: 'Miyazu', lat: 35.534419, lng: 135.199751 },
      { name: 'Oe', lat: 35.43259649254186, lng: 135.1581420958354 },
      { name: 'Fukuchiyama', lat: 35.2959786, lng: 135.1184251 },
      { name: 'Amanohashidate', lat: 35.55736, lng: 135.182585 },
      { name: 'Toyooka', lat: 35.543992, lng: 134.813341 },
      { name: 'Kobe Airport', lat: 34.6372465, lng: 135.2289157 },
      { name: 'Sannomiya', lat: 34.694659, lng: 135.1949544 },
      { name: 'Marine Park', lat: 34.6842547, lng: 135.2701243 },
      { name: 'Uozaki', lat: 34.712602, lng: 135.2692991 },
      { name: 'Sumiyoshi', lat: 34.7131845479451, lng: 135.26090435540124 },
      { name: 'Sanyo-Himeji', lat: 34.828879, lng: 134.6893034 },
      { name: 'Shikama', lat: 34.799719, lng: 134.6753775 },
      { name: 'Oshio', lat: 34.779346098522474, lng: 134.75751202230023 },
      { name: 'Takasago', lat: 34.75191413559581, lng: 134.80229208131323 },
      { name: 'Higashi-futami', lat: 34.7000151, lng: 134.8883682 },
      { name: 'Sanyo-Akashi', lat: 34.6490355, lng: 134.9926962 },
      { name: 'Maiko-koen', lat: 34.6341092, lng: 135.034325 },
      { name: 'Sanyo-Tarumi', lat: 34.6295379, lng: 135.0536607 },
      { name: 'Sanyo-Shioya', lat: 34.6335857, lng: 135.0833501 },
      { name: 'Sumaura-koen', lat: 34.6379075, lng: 135.1004225 },
      { name: 'Sanyo-Suma', lat: 34.6436019, lng: 135.1126784 },
      { name: 'Tsukimiyama', lat: 34.6498397, lng: 135.1215983 },
      { name: 'Itayado', lat: 34.660017, lng: 135.133204 },
      { name: 'Nishidai', lat: 34.66218369982372, lng: 135.14425331998854 },
      { name: 'Shinkaichi', lat: 34.676572, lng: 135.169034 },
      { name: 'Minatogawa', lat: 34.6793665, lng: 135.1664796 },
      { name: 'Suzurandai', lat: 34.724066, lng: 135.145951 },
      { name: 'Ao', lat: 34.856916660149, lng: 134.91017169228778 },
      { name: 'Hojomachi', lat: 34.93326259407226, lng: 134.83336108803567 },
      { name: 'Tanigami', lat: 34.76159, lng: 135.171392 },
      { name: 'Arimaguchi', lat: 34.79636735265192, lng: 135.22086505434538 },
      { name: 'Armia Onsen', lat: 34.7992575, lng: 135.246297 },
      { name: 'Yokoyama', lat: 34.8768859, lng: 135.2200122 },
      { name: 'Sanda', lat: 34.888521, lng: 135.230438 },
      { name: 'Woody Town Chuo', lat: 34.9097626, lng: 135.1836076 },
      { name: 'Rokko Sanjo', lat: 34.7519855, lng: 135.2369151 },
      { name: 'Rokko Cable-shita', lat: 34.737233, lng: 135.2334424 },
];

const passes = ['Kansai Thru Pass', 'JR Pass', 'Both'];

function App() {
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [routeVisible, setRouteVisible] = useState(false);
  const [passBought, setPassBought] = useState('');
  const [linesTaken, setLinesTaken] = useState([]);
  const [transferStationsDetails, setTransferStationsDetails] = useState([]);



  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === 'startStation') {
      setStartStation(value);
    } else if (id === 'endStation') {
      setEndStation(value);
    } else if (id === 'passBought') {
      setPassBought(value);
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
    if (inputId === 'passBought') {
      matchingItems = passes.filter((pass) =>
        pass.toLowerCase().startsWith(inputValue)
      );
    } else {
      matchingItems = stations.filter((station) =>
        station.name.toLowerCase().startsWith(inputValue)
      );
    }
  
    if (matchingItems.length > 0) {
      dropdownContainer.style.display = 'block';
  
      matchingItems.forEach((item) => {
        const suggestion = document.createElement('div');
        suggestion.setAttribute('class', 'suggestion');
        suggestion.textContent = item.name || item;
        suggestion.addEventListener('click', () => {
          input.value = item.name || item;
          dropdownContainer.style.display = 'none';
          if (inputId === 'startStation') {
            setStartStation(item.name || item);
          } else if (inputId === 'endStation') {
            setEndStation(item.name || item);
          } else if (inputId === 'passBought') {
            setPassBought(item.name || item);
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
		if (startStation && endStation && passBought) {
			// Check if the entered values are present in the station list or passes list
			const isValidStartStation = stations.some(station => station.name === startStation);
			const isValidEndStation = stations.some(station => station.name === endStation);
			const isValidPass = passes.includes(passBought);
	
			// Display the route box if all conditions are met
			if (isValidStartStation && isValidEndStation && isValidPass) {
				const [linesTaken, transferStations] = await get_shortest_route(startStation, endStation, passBought);
	
				if (transferStations.length > 0) {
					const stationsDetails = await get_stations_details(transferStations);
					setLinesTaken(linesTaken);
					setTransferStationsDetails(stationsDetails);
					setRouteVisible(true);
				} else {
					// Handle the case where transferStations is empty
					setLinesTaken(linesTaken);
					setTransferStationsDetails([]);
					setRouteVisible(true);
				}
			}
		}
	};
	
  
  

  return (
    <div className="container">
      <div className="rectangle">
        <div className="sub-rectangle">
          <div className="label">
            <h3>Start Station:</h3>
          </div>
          <input
            type="text"
            className="input"
            id="startStation"
            value={startStation}
            autoComplete="off"
            onChange={handleInputChange}
            onInput={(event) => showSuggestions(event, 'startStation', 'startDropdown')}
          />
        </div>
        <div id="startDropdown" className="dropdown-container"></div>
      </div>
      <div className="rectangle">
        <div className="sub-rectangle">
          <div className="label">
            <h3>End Station:</h3>
          </div>
          <input
            type="text"
            className="input"
            id="endStation"
            value={endStation}
            autoComplete="off"
            onChange={handleInputChange}
            onInput={(event) => showSuggestions(event, 'endStation', 'endDropdown')}
          />
        </div>
        <div id="endDropdown" className="dropdown-container"></div>
      </div>

      <div className="rectangle">
  <div className="sub-rectangle pass"> {/* Added "pass" class */}
    <div className="label">
      <h3>Pass Bought:</h3>
    </div>
    <input
      type="text"
      className="input"
      id="passBought"
      value={passBought}
      autoComplete="off"
      onChange={handleInputChange}
      onInput={(event) => showSuggestions(event, 'passBought', 'passDropdown')}
    />
  </div>
  <div id="passDropdown" className="dropdown-container pass"></div> {/* Added "pass" class */}
</div>

      

      <div className="submit-btn">
        <button onClick={getRouteRecommendation}>Get Route Recommendation</button>
      </div>

      {routeVisible ? (
  <div className="route-box" id="routeBox">
    {linesTaken.length === 0 ? (
      <h3>No path exists with the current pass</h3>
    ) : (
      <>
        <h3>Route</h3>
        <ul>
          {linesTaken.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <h3>Transfer Stations</h3>
        <ul>
          {transferStationsDetails.map((station) => (
            <li key={station.name}>{station.name}</li>
          ))}
        </ul>
        <div className="save-trip">
          <button className="save-trip-button">
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
  );
}

export default App;