const shortestPath = require('../components/get_shortest_path');

// iterates through all possible station pairs to check if a path exists between them.
async function fuzzer() {
  const errorStations = [];
  const connectedStations = [];
  var pathFound = false;
  const stationDetails = await shortestPath.get_all_station_details();
  const stationNames = stationDetails.map((station) => station.name);
  const availablePasses = ['Kansai Thru Pass', 'JR Pass', 'Both'];
  // iterate through all stations
  for (let i = 0; i < stationNames.length; i++) {
    for (let j = i; j < stationNames.length; j++) {
      // test whether there is path connecting two different stations
      pathFound = false;
      if (
        i != j &&
        (!connectedStations.includes(i) || !connectedStations.includes(j))
      ) {
        // iterate through all passes
        for (let k = 0; k < availablePasses.length; k++) {
          try {
            const result = await shortestPath.get_shortest_route(
              stationNames[i],
              stationNames[j],
              availablePasses[k]
            );
            if (result[0].length != 0 && result[1].length != 0) {
              pathFound = true;
              if (!connectedStations.includes(i)) {
                connectedStations.push(i);
              }
              if (!connectedStations.includes(j)) {
                connectedStations.push(j);
              }
              // identify any undefined path segment
              for (let a = 0; a < result[0].length; a++) {
                if (result[0][a] == undefined) {
                  console.log(
                    `Undefined line between ${stationNames[i]} and ${stationNames[j]}`
                  );
                  errorStations.push([
                    stationNames[i],
                    stationNames[j],
                    availablePasses[k],
                  ]);
                }
              }
              break;
            }
          } catch (error) {
            console.error(
              `Error occurred while processing station ${stationNames[i]} and pass ${availablePasses[k]}: ${error.message}`
            );
          }
        }
        // keep track of station pairs with no paths between them.
        if (!pathFound) {
          console.log(
            `No paths found between ${stationNames[i]} and ${stationNames[j]}`
          );
          errorStations.push([stationNames[i], stationNames[j]]);
        }
      }
    }
  }
  console.log(errorStations);
  return errorStations;
}

describe('Station Network test', () => {
  test('All stations are connected to one another', async () => {
    const result = await fuzzer();
    expect(result).toStrictEqual([]);
  }, 600000);
});
