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

// Existing getCustomers with error handling
async function getCustomers() {
  try {
    const customersCollection = await connect();
    const customers = await customersCollection.find().toArray();

    // Commented out simulated error - can be enabled if needed
    // throw { message: 'an error occured' };

    return [customers, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

// New resetCustomers function to reset data in the customers collection
async function resetCustomers() {
  const initialCustomers = [
    { id: 0, name: 'Mary Jackson', email: 'maryj@abc.com', password: 'maryj' },
    { id: 1, name: 'Karen Addams', email: 'karena@abc.com', password: 'karena' },
    { id: 2, name: 'Scott Ramsey', email: 'scottr@abc.com', password: 'scottr' },
  ];

  try {
    const customersCollection = await connect();

    // Delete all existing records
    await customersCollection.deleteMany({});

    // Insert initial customers
    await customersCollection.insertMany(initialCustomers);

    // Get count of records
    const count = await customersCollection.countDocuments();

    return [`Data reset successful. There are now ${count} customers.`, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

module.exports = { getCustomers, resetCustomers };
