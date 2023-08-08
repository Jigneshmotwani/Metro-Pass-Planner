/* eslint-disable no-sequences */
/* eslint-disable no-useless-concat */
/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const neo4j = require('neo4j-driver')

// test inputs
const start = "Amanohashidate"
const dest = "Abeno"
const pass = "Both" // or "JR" or "Both"

// inputs startName, destName, pass (string type, either "Kansai Thru", "JR", or "Both")
// returns lineTaken: list of railways taken to get to destination from start. returns [] if no paths found.
// returns transferStations: list of strings of stations to transfer at. includes start and destination at indexes 0 and at the end. returns [] if no paths found.
async function get_shortest_route(startName, destName, pass) {
  // Operators to search for depend on the pass
  var availOperators = [];
  if (pass === "Kansai Thru Pass") {
    availOperators = ["Kansai_pass", "walk"];
  } else if (pass === "JR Pass") {
    availOperators = ["JR_pass", "walk"];
  } else if (pass === "Both") {
    availOperators = ["JR_pass", "Kansai_pass", "walk"];
  }

  const testquery = `
    MATCH p = shortestPath((start:Station {name: '${startName}'})-[r:Connected*]-(end:Station {name: '${destName}'}))
    WHERE ALL(r IN relationships(p) WHERE r.Operator IN [${availOperators.map(op => `'${op}'`).join(', ')}])
    RETURN p
  `;

  try {
    // query and retrieve results
    const result = await get_query_result(testquery)
    
    const singleRecord = result.records[0]
    const path = singleRecord.get(0)
    const startID = path.start.identity.low
    const endID = path.end.identity.low
    const routeLength = path.length

    var from = startID
    var to = null
    var currentRailway = null
    const transferStationsID = []
    const linesTaken = []

    // get details of each path segment
    for (let i=0; i<routeLength; i++) {
      const relation = path.segments[i].relationship
      const operator = relation.properties.Operator
      const railway = relation.properties.Railway
      const relationStartID = relation.start.low
      const relationEndID = relation.end.low
      // reassign from and to stations correctly
      if (from == relationStartID) {
        to = relationEndID 
      } else { 
        from = relationEndID
        to = relationStartID
      }
      // update return variables if needed
      if (currentRailway == null || railway != currentRailway) {
        if (linesTaken.includes(railway) == false) {
          linesTaken.push(railway)
          transferStationsID.push(from)
        }
        currentRailway = railway
      }

      from = to
    }
    transferStationsID.push(endID)

    const transferStations = await get_stations_by_ids (transferStationsID)
    // for debug
    console.log(linesTaken)
    console.log(transferStations)
    return [linesTaken, transferStations]
  } catch (error) {
    console.error(error);
    return [[], []];
  }
}


// get station names from list of IDs
async function get_stations_by_ids (id) {
  // local database
  // const uri = 'neo4j://localhost:7687'
  // const user = "neo4j"
  // const password = "12345678"

  // server database 
  const uri = 'neo4j://165.22.248.255'
  const user = "root"
  const password = "12345678"
  
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  const session = driver.session()
  var query = ''
  var result = ''
  const nameList = []
  try {
    for (let i=0; i<id.length; i++) {
      query = "MATCH (n) WHERE ID(n) = " + id[i].toString() + " RETURN n"
      result = await session.run(query)
      nameList.push(result.records[0].get(0).properties.name)
    }
    return nameList
  } finally {
    await session.close()
    await driver.close()
  }
}

/* get station details from list of station names
   for each ID, returns a list 
    where list[i] is a dictionary containing details of station i
      dictionary include:
      'name', 'lat', 'lng', 'railways': [list of railway lines available at the station] */
async function get_stations_details (name_ls) {
  // local database
  // const uri = 'neo4j://localhost:7687'
  // const user = "neo4j"
  // const password = "12345678"

  // server database 
  const uri = 'neo4j://165.22.248.255'
  const user = "root"
  const password = "12345678"
  
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  const session = driver.session()
  var query = ''
  var result = ''
  const stationList = []
  try {
    for (let i=0; i<name_ls.length; i++) {
      var stationdetails = {}
      var stationNode = ''

      // info retrieval and unpacking
      query = "MATCH (n:Station {name: '" + name_ls[i] + "'})-[r]-() RETURN n,r"
      result = await session.run(query)

      var stationNode = result.records[0].get(0).properties
      var stationRailways = []
      for (let j=0; j<result.records.length; j++) { 
        thisRailway = result.records[j].get(1).properties.Railway
        if (stationRailways.includes(thisRailway)==false) {
          stationRailways.push(result.records[j].get(1).properties.Railway) 
        }
      } 
      // compile station details in dictionary and add to result list
      var stationdetails = {
        'name': stationNode.name,
        'lat': stationNode.lat,
        'lng': stationNode.lng,
        'railways': stationRailways
      }
      stationList.push(stationdetails)
    }

    // for debug: prints output
    // for (i=0; i<stationList.length; i++) {
    //   console.log(stationList[i])
    //   console.log(stationList[i]['railways'])
    // }

    return stationList
  } finally {
    await session.close()
    await driver.close()
  }
}

// takes in cypher query q, returns result of the query.
async function get_query_result (q) {
  // local database 
  // const uri = 'neo4j://localhost:7687'
  // const user = "neo4j"
  // const password = "12345678"

  // server database 
  const uri = 'neo4j://165.22.248.255'
  const user = "root"
  const password = "12345678"

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  const session = driver.session()

  try {
    // query and retrieve results
    const result = await session.run(q)
    return result
  } finally {
    // on application exit:
    await session.close()
    await driver.close()
  }
}

get_shortest_route(start, dest, pass)

module.exports =  { get_shortest_route, get_stations_details }
