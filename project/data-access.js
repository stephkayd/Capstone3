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

async function getCustomers() {
  try {
    const customersCollection = await connect();
    const customers = await customersCollection.find().toArray();
    return [customers, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

async function resetCustomers() {
  const initialCustomers = [
    { id: 0, name: 'Mary Jackson', email: 'maryj@abc.com', password: 'maryj' },
    { id: 1, name: 'Karen Addams', email: 'karena@abc.com', password: 'karena' },
    { id: 2, name: 'Scott Ramsey', email: 'scottr@abc.com', password: 'scottr' },
  ];

  try {
    const customersCollection = await connect();
    await customersCollection.deleteMany({});
    await customersCollection.insertMany(initialCustomers);
    const count = await customersCollection.countDocuments();
    return [`Data reset successful. There are now ${count} customers.`, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

async function addCustomer(newCustomer) {
  try {
    const customersCollection = await connect();
    const result = await customersCollection.insertOne(newCustomer);
    return ["success", result.insertedId, null];
  } catch (err) {
    console.log(err.message);
    return ["fail", null, err.message];
  }
}

async function getCustomerById(id) {
  try {
    const customersCollection = await connect();
    const customer = await customersCollection.findOne({ id: +id });
    if (!customer) {
      return [null, "invalid customer number"];
    }
    return [customer, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

module.exports = { getCustomers, resetCustomers, addCustomer, getCustomerById };
