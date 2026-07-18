const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server side of the loop.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
