const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.cookies.randomCookie) {
    const userId = Math.random().toString(36).substring(2, 15);
    res.cookie('userId', userId);
  }
  next();
});

app.use(cors());
// Parse JSON request bodies
app.use(express.json());
const default_developper = {	
  name: 'Antoine Chagnon Michaud',
      age: 35,
      isAProWithReact: true,
      salary: 1000000,
}

global.users =  {
}
      
app.get('/developper', (req, res) => {
  if (global.users[req.cookies.randomCookie])
    return res.send(global.users[req.cookies.randomCookie]);
  return res.send(default_developper)
});

app.post('/developper', (req, res) => {
  console.log("🚀 ~ app.post ~ req.body:", req.body)
  if (!req.body.name)
    return res.status(400).send("Missing required name");
  if (!req.body.age || req.body.age < 0)
    return res.status(400).send("Missing or invalid required age");
  if (req.body.isAProWithReact === undefined)
    return res.status(400).send("Missing required isAProWithReact");
  if (!req.body.salary || req.body.salary < 0)
    return res.status(400).send("Missing or invalid required salary");
  global.users[req.cookies.randomCookie] = req.body
  res.status(201).send("Message created");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
