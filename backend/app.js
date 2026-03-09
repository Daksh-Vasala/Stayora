const express = require("express");
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());

require("dotenv").config();
const PORT = process.env.PORT;

const DBConnection = require("./src/utils/DBConnection.js");
DBConnection();

const userRouter = require("./src/routers/userRouter.js")
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});