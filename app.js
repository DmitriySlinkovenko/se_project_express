require("dotenv").config();

const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const cors = require("cors");

const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use("/", indexRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err.message));

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
