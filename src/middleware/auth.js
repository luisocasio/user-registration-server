require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;

    const data = jwt.verify(access_token, process.env.JWT_KEY);
    const user = await User.findOne({ _id: data._id });

    req.user = user
    
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = auth;