const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/constants");
const { authorization } = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to Database"))
  .catch(console.error);

// Middleware to parse the JSON format
app.use(express.json());

// Use the authentication middleware globally
app.use((req, res, next) => {
  // Skip authentication for the following routes
  if (
    (["/signin", "/signup"].includes(req.path) && req.method === "POST") ||
    (req.method === "GET" && req.path === "/items")
  ) {
    return next(); // Skip auth check for these routes
  }
  authorization(req, res, next);
});

app.use("/", indexRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
