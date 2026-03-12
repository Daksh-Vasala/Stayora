const express = require("express");
const app = express();
const cors = require("cors");


const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

require("dotenv").config();
const PORT = process.env.PORT;

const db = require("./src/utils/db.js");
db();

const userRouter = require("./src/routers/userRouter.js");
app.use("/user", userRouter);

const propertyRouter = require("./src/routers/propertyRouter.js");
app.use("/property", propertyRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
