const express = require('express');
const app = express();
const PORT = 5001; // Use a different port

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});