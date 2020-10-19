require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const port = process.env.PORT || 3001;

// API security
app.use(helmet());

// handle CORS
app.use(cors());

// mongodb connection setup
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

if (process.env.NODE_ENV !== "production") {
  const mongodb = mongoose.connection;
  mongodb.on("open", () => {
    console.log("MongoDb is connected");
  });

  mongodb.on("error", (error) => {
    console.log(error);
  });

  // logger
  app.use(morgan("tiny"));
}

// set body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// load routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");

// use routers
app.use('/v1/user', userRouter);
app.use('/v1/ticket', ticketRouter);

// error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
})

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
})