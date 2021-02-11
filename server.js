const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const router = express.Router();

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/event-node-express-mongoose", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => console.log(err));

const userRouter = require("./routes/userRouter");
const eventRouter = require("./routes/eventRouter");

app.use("/user", userRouter);
app.use("/event", eventRouter);

app.listen(port, () => console.log("Server is running on port " + port));
