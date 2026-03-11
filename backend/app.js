const express = require("express");
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());

require("dotenv").config();
const PORT = process.env.PORT;

const db = require("./src/utils/db.js");
db();

const userRouter = require("./src/routers/userRouter.js")
app.use("/user", userRouter);

const propertyRouter = require("./src/routers/propertyRouter.js")
app.use("/property", propertyRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});