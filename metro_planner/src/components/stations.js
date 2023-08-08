// fetches station names from neo4j database

const neo4j = require('neo4j-driver');

async function getStationNames() {
  const uri = 'neo4j://165.22.248.255';
  const user = 'root';
  const password = '12345678';

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    const result = await session.run('MATCH (n:Station) RETURN n.name');
    const stationNames = result.records.map((record) => record.get(0));
    return stationNames;
  } finally {
    await session.close();
    await driver.close();
  }
}

module.exports = { getStationNames };
