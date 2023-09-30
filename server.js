const express = require('express');
const app = express();
const port = process.env.PORT || 3001;


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
  if (req.query.from && req.query.message) {
    global.message = { 
      from: req.query.from,
      message: req.query.message,
      date: new Date()
    }
  }
  res.status(201).send("Message created");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
