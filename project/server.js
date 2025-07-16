const express = require('express');
const path = require('path');

const da = require('./data-access');

const app = express();
const port = 4000;

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

// New reset endpoint
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
