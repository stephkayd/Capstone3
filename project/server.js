const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');  // Import body-parser

const da = require('./data-access');

const app = express();
const port = 4000;

app.use(bodyParser.json());  // Use body-parser BEFORE static middleware
app.use(express.static(path.join(__dirname, 'public')));

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

// New POST handler for adding customers
app.post('/customers', async (req, res) => {
  const newCustomer = req.body;

  if (!newCustomer || Object.keys(newCustomer).length === 0) {
    return res.status(400).send('missing request body');
  }

  try {
    const [status, id, errMessage] = await da.addCustomer(newCustomer);

    if (status === 'success') {
      // Add the MongoDB-generated _id to the returned customer object
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
