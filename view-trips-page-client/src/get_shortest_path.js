const neo4j = require('neo4j-driver')

/* 

// retrieve from user input
const start = 223
const dest = 190
const pass = "Kansai Thru" // or JR 

*/

// inputs start station ID, dest station ID, pass 
// returns lineTaken: list of railways taken to get to destination from start
// returns transferStations: list of strings of stations to transfer at. includes start and destination at indexes 0 and at the end.
async function get_shortest_route(startID, destID, pass) {
    // Operators to search for depends on the pass
    var availOperators = [];
    if (pass === "Kansai Thru") {
        availOperators = "Kansai_pass" + " OR r.Operator = 'walk'";
    } else if (pass === "JR") {
        availOperators = "JR_pass" + " OR r.Operator = 'walk'";
    }


    const idquery = ""
    + "MATCH (s: Station WHERE ID(s)=" + startID + ")\n" 
    + "MATCH (e: Station WHERE ID(e)=" + destID + ")\n" 
    + "MATCH p = shortestPath( (start:Station{name:s.name, lng:s.lng, lat:s.lat})-[r:Connected*]-(end:Station{name:e.name, lat:e.lat, lng:e.lng}) ) \n"
    + "WHERE ALL (r IN relationships(p) WHERE r.Operator = '" + availOperators + "' )"
    + "RETURN p"
    
    try {
        const resultpath = await get_query_result(idquery)
        const singleRecord = resultpath.records[0]
        const path = singleRecord.get(0)
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
        if (from === relationStartID) {
            to = relationEndID 
        } else { 
            from = relationEndID
            to = relationStartID
        }
        // update return variables if needed
        if (currentRailway == null || railway !== currentRailway) {
            if (linesTaken.includes(railway) === false) {
            linesTaken.push(railway)
            transferStationsID.push(from)
            }
            currentRailway = railway
        }
        // for debug: prints details of all path segments
        // fromName = await get_stations_by_ids([from])
        // toName = await get_stations_by_ids([to])
        // console.log(fromName[0], "->", toName[0], " (", operator, ", " + railway + " )")

        from = to
        }
        transferStationsID.push(destID)

        const transferStations = await get_stations_by_ids (transferStationsID)
        // console.log(linesTaken)
        // console.log(transferStations)
        // console.log(transferStationsID)
        return linesTaken, transferStations

    } catch (error) {
        console.log("No paths found.")
        return [],[]
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

// get_shortest_route(start, dest, pass)

module.exports =  { get_shortest_route, get_stations_by_ids, get_query_result }