require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const { Cookie } = req.cookies;

    const data = jwt.verify(Cookie, process.env.JWT_KEY);

    const user = await User.findOne({ _id: data._id });

    req.user = user

    console.log("Authorizing the following user: ", user)

    next()
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = auth;