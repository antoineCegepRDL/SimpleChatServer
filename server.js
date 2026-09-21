const express = require('express');
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const port = process.env.PORT || 3001;

app.use(cors());
// Parse JSON request bodies
app.use(express.json());
const COOKIE_NAME = 'sessionId';
const todosBySession = new Map();

const getCookieValue = (cookieHeader, cookieName) => {
  if (!cookieHeader) {
    return null;
  }
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const cookie = cookies.find((item) => item.startsWith(`${cookieName}=`));
  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
};

const createSessionId = () => crypto.randomBytes(32).toString('hex');
global.message =  {
  from: "System",
  message: "Hi, this is the system",
  date: new Date()
}
// Create a route to log the request body
app.get('/message', (req, res) => {
  res.send(global.message);
});

app.post('/message', (req, res) => {
  if (req.body.from && req.body.message) {
    if (req.body.message === "anyone there?") {
      global.message = { 
        from: "System",
        message: "Chu là!",
        date: new Date()
      }
    }
    else {
      global.message = { 
        from: req.body.from,
        message: req.body.message,
        date: new Date()
      }
    }
  }
  res.status(201).send("Message created");
});

app.post('/todo', (req, res) => {
  if (!req.body || typeof req.body.todo !== 'string' || !req.body.todo.trim()) {
    return res.status(400).send('Todo is required');
  }

  let sessionId = getCookieValue(req.headers.cookie, COOKIE_NAME);
  let sessionData = sessionId ? todosBySession.get(sessionId) : null;

  if (!sessionData) {
    sessionId = createSessionId();
    sessionData = { todos: [] };
    todosBySession.set(sessionId, sessionData);
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${encodeURIComponent(sessionId)}; HttpOnly; Secure; SameSite=Strict; Path=/`
    );
  }

  const todo = {
    value: req.body.todo.trim(),
    createdAt: new Date()
  };
  sessionData.todos.push(todo);

  return res.status(201).send({
    todo,
    totalTodos: sessionData.todos.length
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
