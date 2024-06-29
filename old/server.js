const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Add a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Endpoint to get the candle state
app.get('/candle-state', (req, res) => {
  fs.readFile('candleState.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.send(data);
  });
});

// Endpoint to update the candle state
app.post('/light-candle', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  fs.writeFile('candleState.txt', today, (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.send('Candle lit');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});