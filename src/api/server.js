require("dotenv").config();
require("../db/db");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const auth = require("../middleware/auth")

const userRouter = require("../routers/user");

const PORT = process.env.PORT || 3000;

const server = express();
server.use(express.json());

server.use(cookieParser());
server.use(cors({ origin: "http://localhost:8081/user/logout", credentials: true, path: "/" }));

server.use(morgan("tiny"));

server.use(userRouter);

server.get("/", auth, (_req, res) => {
  res.send("This server is up and running!");
});

server.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
});
