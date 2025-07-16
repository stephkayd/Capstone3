const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'custdb';

const client = new MongoClient(url);

let collection;

async function connect() {
  if (!collection) {
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection('customers');
  }
  return collection;
}

// getCustomers with error handling; simulated error is commented out
async function getCustomers() {
  try {
    const customersCollection = await connect();
    const customers = await customersCollection.find().toArray();

    // Simulated error - uncomment to test error handling
    // throw { message: 'an error occured' };

    return [customers, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

module.exports = { getCustomers };
