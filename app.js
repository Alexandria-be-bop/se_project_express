require('dotenv').config();

const { errors } = require("celebrate");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to Database"))
  .catch(console.error);

// Middleware to parse the JSON format
app.use(express.json());

app.use(requestLogger);

// Start of all the routes
app.use("/", indexRouter);

app.use(errorLogger);

// celebrate error handler
app.use(errors());

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
