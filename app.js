const express = require("express");
const app = express();
const cors = require("cors");
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

app.use(express.json());
app.use("/", indexRouter);
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err.message));

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
