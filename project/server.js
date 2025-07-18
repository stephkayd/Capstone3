const express = require('express');
const path = require('path');
const cors = require('cors');
const da = require('./data-access');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');

const app = express();
const port = 4000;

// Enable CORS early
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Simple validation middleware for customer data on POST and PUT
function validateCustomer(req, res, next) {
  const customer = req.body;

  if (!customer || typeof customer !== 'object') {
    return res.status(400).send('Request body must be a JSON object');
  }

  // For POST: 'id' may not be sent since it is auto-generated; for PUT: id comes from URL
  // So, require name, email, password for both.
  const { name, email, password } = customer;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).send('Customer name is required and must be a non-empty string');
  }
  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).send('Customer email is required and must be a non-empty string');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    return res.status(400).send('Customer password is required and must be a non-empty string');
  }

  // Additional simple email format check (optional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Customer email format is invalid');
  }

  next();
}

// === API Routes first ===

// GET all customers - protected
app.get('/customers', apiKeyMiddleware, async (req, res) => {
  try {
    const [customers, err] = await da.getCustomers();
    if (customers) {
      res.status(200).json(customers);
    } else {
      res.status(500).send(err);
    }
  } catch (error) {
    console.error('Error in GET /customers:', error);
    res.status(500).send('Server error');
  }
});

// GET customer by id - protected
app.get('/customers/:id', apiKeyMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [customer, err] = await da.getCustomerById(id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).send(err || 'Customer not found');
    }
  } catch (error) {
    console.error('Error in GET /customers/:id:', error);
    res.status(500).send('Server error');
  }
});

// GET reset (unprotected)
app.get('/reset', async (req, res) => {
  try {
    const [result, err] = await da.resetCustomers();
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(500).send(err);
    }
  } catch (error) {
    console.error('Error in GET /reset:', error);
    res.status(500).send('Server error');
  }
});

// POST new customer - protected
app.post('/customers', apiKeyMiddleware, validateCustomer, async (req, res) => {
  const newCustomer = req.body;
  if (!newCustomer) {
    return res.status(400).send('Missing request body');
  }
  try {
    const [status, id, err] = await da.addCustomer(newCustomer);
    if (status === 'success') {
      newCustomer._id = id;
      res.status(201).json(newCustomer);
    } else {
      res.status(400).send(err);
    }
  } catch (error) {
    console.error('Error in POST /customers:', error);
    res.status(500).send('Server error');
  }
});

// PUT update customer - protected
app.put('/customers/:id', apiKeyMiddleware, validateCustomer, async (req, res) => {
  const updatedCustomer = req.body;
  const id = req.params.id;

  if (!updatedCustomer) {
    return res.status(400).send('Missing request body');
  }

  // Remove _id to avoid conflicts and set id from URL param
  delete updatedCustomer._id;
  updatedCustomer.id = +id;

  try {
    const [message, err] = await da.updateCustomer(updatedCustomer);
    if (message) {
      // Successful update, send 200 OK with message
      res.status(200).send(message);
    } else {
      // No record updated means id not found - respond 404
      res.status(404).send(err || 'Customer not found');
    }
  } catch (error) {
    console.error('Error in PUT /customers/:id:', error);
    res.status(500).send('Server error');
  }
});

// DELETE customer - protected
app.delete('/customers/:id', apiKeyMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [message, err] = await da.deleteCustomerById(id);
    if (message) {
      res.status(200).send(message);
    } else {
      res.status(404).send(err || 'Customer not found');
    }
  } catch (error) {
    console.error('Error in DELETE /customers/:id:', error);
    res.status(500).send('Server error');
  }
});

// === Static file serving after routes ===
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
