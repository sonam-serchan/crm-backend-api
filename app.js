const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// API security
app.use(helmet());

// handle CORS
app.use(cors());

// logger
app.use(morgan("tiny"));

// set body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

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