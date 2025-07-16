const express = require('express');
const path = require('path');

const da = require('./data-access');  // Import data-access.js

const app = express();
const port = 4000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get customers from MongoDB using data-access.js
app.get('/customers', async (req, res) => {
  try {
    const cust = await da.getCustomers();
    res.send(cust);
  } catch (error) {
    console.error('Error retrieving customers:', error);
    res.status(500).send('Error retrieving customers');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
