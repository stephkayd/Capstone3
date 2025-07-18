const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

let collection;

async function connect() {
  if (!collection) {
    await client.connect();
    const db = client.db('custdb');
    collection = db.collection('customers');

    // Create unique indexes on 'id' and 'email' fields
    // These will only create the index if it does not already exist
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ email: 1 }, { unique: true });
  }
}

// Get all customers
async function getCustomers() {
  await connect();
  try {
    const customers = await collection.find().toArray();
    return [customers, null];
  } catch (err) {
    console.error('Error fetching customers:', err);
    return [null, err.message];
  }
}

// Reset customers collection to default data
async function resetCustomers() {
  await connect();
  const defaultCustomers = [
    { id: 0, name: "Mary Jackson", email: "maryj@abc.com", password: "maryj" },
    { id: 1, name: "Karen Addams", email: "karena@abc.com", password: "karena" },
    { id: 2, name: "Scott Ramsey", email: "scottr@abc.com", password: "scottr" }
  ];
  try {
    await collection.deleteMany({});
    await collection.insertMany(defaultCustomers);
    const count = await collection.countDocuments();
    return [`Reset complete. ${count} records now in collection.`, null];
  } catch (error) {
    console.error('Error resetting customers:', error);
    return [null, error.message];
  }
}

// Add a new customer
async function addCustomer(newCustomer) {
  await connect();
  try {
    // Check for existing customer with same id or email to prevent duplicates
    const existing = await collection.findOne({
      $or: [
        { id: newCustomer.id },
        { email: newCustomer.email }
      ]
    });
    if (existing) {
      return ['fail', null, 'Customer with this id or email already exists'];
    }

    const result = await collection.insertOne(newCustomer);
    return ['success', result.insertedId, null];
  } catch (error) {
    console.error('Error adding customer:', error);

    // Handle duplicate key error from MongoDB unique index
    if (error.code === 11000) {
      return ['fail', null, 'Duplicate key error: customer with this id or email already exists'];
    }

    return ['fail', null, error.message];
  }
}

// Get customer by id
async function getCustomerById(id) {
  await connect();
  try {
    const customer = await collection.findOne({ id: +id });
    if (customer) {
      return [customer, null];
    } else {
      return [null, 'invalid customer number'];
    }
  } catch (error) {
    return [null, error.message];
  }
}

// Update customer
async function updateCustomer(updatedCustomer) {
  await connect();
  try {
    const filter = { id: updatedCustomer.id };
    const updateDoc = { $set: updatedCustomer };
    const result = await collection.updateOne(filter, updateDoc);
    if (result.modifiedCount === 1) {
      return ['one record updated', null];
    } else {
      return [null, 'no record updated'];
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    return [null, error.message];
  }
}

// Delete customer by id
async function deleteCustomerById(id) {
  await connect();
  try {
    const result = await collection.deleteOne({ id: +id });
    if (result.deletedCount === 1) {
      return ['one record deleted', null];
    } else {
      return [null, 'no record deleted'];
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    return [null, error.message];
  }
}

module.exports = {
  getCustomers,
  resetCustomers,
  addCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomerById
};
