import express from "express"

const app = express()

app.use(express.json());

app.get("/", (req, res)=>{
  res.send("Server is ready")
})

const port = process.env.PORT || 3000

app.listen(port, ()=>{
  console.log(`Server at http://localhost:${port}`)
})

// Data and api for the win/loss rate for specific monty played

// /api/stats format
// {
//   montyName: String,
//   switched: boolean,
//   won: int,
//   lost: int,
// }

let gameStats = [];

// GET all stats
app.get("/api/stats", (req, res) => {
  res.json(gameStats);
});

// POST
app.post("/api/stats", (req, res) => {
  const { montyName, switched, won } = req.body;
  console.log(montyName)

  const newEntry = {
    montyName: montyName || "",
    switched: switched || false,
    won: won || 0,
  };

  gameStats.push(newEntry);
  res.status(201).json({ message: "New stat added", stats: newEntry });
});

// Database collection format and api

// /api/dataCollection format
// {
//  cycleNumber: int,
//  montyType: String,
//  playerInitialPick: String,
//  montyResponse: String,
//  optionTwo: String,
//  outcome: int,
//  playAgain: boolean
// }

let database = [];

// GET all stats
app.get("/api/dataCollection", (req, res) => {
  res.json(database);
});

// POST
app.post("/api/dataCollection", (req, res) => {
  const {
    cycleNumber,
    montyType,
    playerInitialPick,
    montyResponse,
    optionTwo,
    outcome,
    playAgain
  } = req.body;

  const newEntry = {
    cycleNumber: cycleNumber || 0,
    montyType: montyType || "",
    playerInitialPick: playerInitialPick || "",
    montyResponse: montyResponse || "",
    optionTwo: optionTwo || "",
    outcome: outcome || 0,
    playAgain: playAgain || false,
  };

  dataCollection.push(newEntry);
  res.status(201).json({ message: "New stat added", data: newEntry });
});
