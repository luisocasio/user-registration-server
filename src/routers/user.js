const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
/*
  Register a new user
*/
router.post("/user/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

/*
  User login
*/
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res
        .status(401)
        .send({
          error: "User cannot be found. Please check your credentials.",
        });
    }

    const token = await user.generateAuthToken();

    const hr = 360000 + Date.now();

    const options = {
      httpOnly: false, // change to false when ready for production
      secure: false, // change to false when ready for production
      credentials: true,
      expires: new Date(hr)     
    };

    res.cookie("access_token", token, options);

    res.status(200).send({ user });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send(error);
  }
});

/*
  Get cookies
*/
router.get("/user/cookie", auth, async (req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token) {
    return res.status(400).json({ message: "No cookie sotored" });
  }
  return res.status(200).json({ message: "Cookie found" });
});

/*
  Log out user
*/
router.delete("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();

    res.clearCookie("access_token")
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;