const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

const app = express();
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

let tasks = [
  { id: 1, title: 'Buy groceries', done: false },
  { id: 2, title: 'Read a book', done: true },
  { id: 3, title: 'Write code', done: false }
];

let nextId = 4;

app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  let result = [...tasks];

  if (req.query.done !== undefined) {
    const done = req.query.done === 'true';
    result = result.filter(t => t.done === done);
  }

  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(q));
  }

  if (req.query.limit || req.query.offset) {
    const limit = parseInt(req.query.limit) || result.length;
    const offset = parseInt(req.query.offset) || 0;
    result = result.slice(offset, offset + limit);
  }

  res.json(result);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  const body = req.body;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Request body must not be empty' });
  }

  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    task.title = body.title.trim();
  }

  if (body.done !== undefined) {
    if (typeof body.done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
    task.done = body.done;
  }

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.get('/stats', (req, res) => {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const open = total - done;
  res.json({ total, done, open });
});

app.post('/reset', (req, res) => {
  tasks = [
    { id: 1, title: 'Buy groceries', done: false },
    { id: 2, title: 'Read a book', done: true },
    { id: 3, title: 'Write code', done: false }
  ];
  nextId = 4;
  res.json({ message: 'Tasks reset to defaults' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
