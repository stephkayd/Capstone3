const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const da = require('./data-access');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add GET handler to get all customers
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

// Existing GET handler for customer by id
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
