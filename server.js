import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from "./routes/posts.js";
import dotenv from "dotenv";
import { auth } from "./verifyToken.js";
import UserMessage from "./models/userMessage.js";
dotenv.config();
// App config
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Db config
mongoose.connect(process.env.DB_CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.set("useFindAndModify", false);

// Api endpoint or route middlewares
app.use("/", postRoutes);

app.get("/", auth, (req, res) => {
  // logged in user id
  res.send(req.user);
  UserMessage.findByOne({ _id: req.user });
});
app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

// Listener
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
