# Task API

A simple CRUD API for managing a to-do list, built with **Express.js** (Node.js).

All data lives in memory — restarting the server resets tasks to the three default examples.

## Install & Run

```bash
npm install
npm start
```

Server starts at **http://localhost:3000**.

Open **http://localhost:3000/docs** to use the interactive Swagger UI.

## Endpoints

| Method | Path             | Description                        | Status codes                     |
|--------|------------------|------------------------------------|----------------------------------|
| GET    | `/`              | API info (name, version, endpoints) | 200                              |
| GET    | `/health`        | Health check                       | 200                              |
| GET    | `/tasks`         | List all tasks                     | 200                              |
| GET    | `/tasks/:id`     | Get a single task by ID            | 200 · 404                        |
| POST   | `/tasks`         | Create a new task                  | 201 · 400                        |
| PUT    | `/tasks/:id`     | Update a task (title and/or done)  | 200 · 400 · 404                  |
| DELETE | `/tasks/:id`     | Delete a task                      | 204 · 404                        |
| GET    | `/stats`         | Task statistics (total/done/open)  | 200                              |
| POST   | `/reset`         | Reset tasks to 3 defaults          | 200                              |

### Query parameters for GET /tasks

- `?done=true` or `?done=false` — filter by completion status
- `?search=milk` — search tasks by title (case-insensitive)
- `?limit=2&offset=2` — paginate results (real APIs never return "everything" to avoid overwhelming the client or server)

## Example curl output

```bash
curl -i http://localhost:3000/tasks/1
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 49

{"id":1,"title":"Buy groceries","done":false}
```

```bash
curl -i http://localhost:3000/tasks/99
```

```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 23

{"error":"Task 99 not found"}
```

## Screenshot

![Swagger UI](screenshot.png)

## The mortality experiment

If you create tasks, restart the server, and call GET /tasks, all created tasks are gone — only the three default examples remain. The data lives in a JavaScript array in memory, not in a database. When the process stops, memory is wiped. This is why Week 3 introduces databases: persistent storage.

---

Built for W2 · A1 — Build your first CRUD API.
