import express from "express"
import users from "./users.js"

const app = express()

app.use(express.json());

app.get("/", (req, res)=>{
  res.send("Server is ready")
})

// Data format
// {
//   montyName: "Original",
//   switched: true,
//   won: 3,
//   lost: 1,
// },
// {

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

const port = process.env.PORT || 3000

app.listen(port, ()=>{
  console.log(`Server at http://localhost:${port}`)
})