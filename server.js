const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/' && req.method === 'GET') {
    res.end(JSON.stringify({
      message: 'Hello from the server side of the loop.',
      available_endpoints: ['/', '/time']
    }));
  } else if (req.url === '/time' && req.method === 'GET') {
    res.end(JSON.stringify({ now: new Date().toISOString() }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
