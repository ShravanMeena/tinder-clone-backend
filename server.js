import express from "express";
import mongoose from "mongoose";
import Cards from "./dbCards.js";
import cors from "cors";

// App config
const app = express();
const port = process.env.PORT || 8001;
const connection_url =
  "mongodb+srv://admin:admin@cluster0.canma.mongodb.net/tinderdb?retryWrites=true&w=majority";
// Middleware
app.use(express.json());
app.use(cors());

// Db config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// Api endpoint
app.get("/", (req, res) => res.status(201).send("Hello tinder waseeyon!"));

app.post("/tinder/cards", (req, res) => {
  const dbCard = req.body;

  Cards.create(dbCard, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/tinder/cards", (req, res) => {
  Cards.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// Listener
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
