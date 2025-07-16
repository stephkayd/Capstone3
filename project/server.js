const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const da = require('./data-access');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Reset endpoint
app.get('/reset', async (req, res) => {
  try {
    const [result, err] = await da.resetCustomers();
    if (result) {
      res.send(result);
    } else {
      res.status(500).send(err);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Server error');
  }
});

// GET all customers
app.get('/customers', async (req, res) => {
  try {
    const [cust, err] = await da.getCustomers();
    if (cust) {
      res.send(cust);
    } else {
      res.status(500).send(err);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Server error');
  }
});

// GET customer by id
app.get('/customers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [customer, err] = await da.getCustomerById(id);
    if (customer) {
      res.send(customer);
    } else {
      res.status(404).send(err);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Server error');
  }
});

// POST add new customer
app.post('/customers', async (req, res) => {
  const newCustomer = req.body;

  if (!newCustomer || Object.keys(newCustomer).length === 0) {
    return res.status(400).send('missing request body');
  }

  try {
    const [status, id, errMessage] = await da.addCustomer(newCustomer);
    if (status === 'success') {
      newCustomer._id = id;
      res.status(201).send(newCustomer);
    } else {
      res.status(400).send(errMessage);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Server error');
  }
});

// PUT update existing customer
app.put('/customers/:id', async (req, res) => {
  const updatedCustomer = req.body;
  const id = req.params.id;

  if (!updatedCustomer || Object.keys(updatedCustomer).length === 0) {
    return res.status(400).send('missing request body');
  }

  delete updatedCustomer._id;
  updatedCustomer.id = +id;

  try {
    const [message, errMessage] = await da.updateCustomer(updatedCustomer);
    if (message) {
      res.send(message);
    } else {
      res.status(400).send(errMessage);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
git 