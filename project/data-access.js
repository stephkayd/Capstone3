// data-access.js

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';  // Connection URL to local MongoDB
const dbName = 'custdb';

const client = new MongoClient(url);

let collection;

// Connect to MongoDB and get the customers collection
async function connect() {
  if (!collection) {
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection('customers');
  }
  return collection;
}

// getCustomers method: fetches all customers from the collection
async function getCustomers() {
  const customersCollection = await connect();
  return customersCollection.find().toArray();
}

module.exports = { getCustomers };
