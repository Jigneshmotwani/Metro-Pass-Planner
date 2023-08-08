// async function getTripData() {
//   // Set useState arrays and layouts
//   const userID = '2';
//   let data;
//   let filteredData;

//   const fetchTrips = async () => {
//     try {
//       const response = await fetch(`http://localhost:4000/trips`);
//       data = await response.json();
//     } catch (error) {
//       console.error('Error fetching trips:', error);
//     }
//   };
//   fetchTrips();

//   // Filter the trips based on the user's ID
//   filteredData = data.filter((trip) => trip.userID === userID);
//   console.log(filteredData);
//   return filteredData;
// }

// export default getTripData();
