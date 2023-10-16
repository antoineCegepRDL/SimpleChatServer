const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;

app.use(cors());
// Parse JSON request bodies
app.use(express.json());
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
