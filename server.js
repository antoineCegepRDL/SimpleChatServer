const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;

app.use(cors());
// Parse JSON request bodies
app.use(express.json());
global.todos = [{
  id: "1",
  isCompleted: true,
  date: new Date(),
  text: 'todo completed'
},
{
  id: "2",
  isCompleted: false,
  date: new Date(),
  text: 'todo not completed'
}]

// Create a route to log the request body
app.get('/todos', (req, res) => {
  res.send(global.todos);
});

app.post('/todo', (req, res) => {
  if (req.body.text) {
    const todo = {
      id: generateId(),
      isCompleted: false,
      date: new Date(),
      text: req.body.text
    }
    global.todos.push(todo)
    res.status(201).send(todo);
  }
  else {
    res.status(400).send("bad todo");
  }
});

app.patch('/todo/:id', (req, res) => {
  if (req.params.id && req.body.isCompleted === false || req.body.isCompleted === true) {
    const todos = [...global.todos]
    const todo = todos.find(x => x.id == req.params.id)
    todo.isCompleted = req.body.isCompleted
    global.todos = todos
    res.status(204).send("todo patched");
  }
  else {
    res.status(400).send("bad todo");
  }
});

app.delete('/todo/:id', (req, res) => {
  if (req.params.id) {
    global.todos = todos.filter(x => x.id !== req.params.id)
    res.status(204).send("todo deleted");
  }
  else {
    res.status(400).send("bad todo");
  }
});

const generateId = () => {
  return new Date().getTime().toString();
}
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
