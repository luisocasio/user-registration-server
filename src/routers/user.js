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
      return res.status(401).send({
        error: "User cannot be found. Please check your credentials.",
      });
    }

    const token = await user.generateAuthToken();

    const hr = 360000 + Date.now();

    const options = {
      httpOnly: true, // change to false when ready for production
      secure: false, // change to false when ready for production
      credentials: true,
    };

    res.cookie("Cookie", token, options);

    res.status(200).json("Successfully logged in.");
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send(error);
  }
});

/*
  Get Token
*/
router.get("/user/token", auth, async (req, res, next) => {
  if (!req.user) {
    return res.status(400).json("Please login.");
  } else if (req.user.tokens.length >= 1) {
    return res.status(200).json(req.user.tokens[0]);
  }
  return res.status(400).json("Please login.");
});

/*
  Log out user
*/
router.delete("/user/logout", auth, async (req, res) => {
  try {
    const tokens = req.user.tokens;

    const clearTokens = tokens.filter((token) => {
      token = "";
      return token;
    });

    req.user.tokens = clearTokens;

    await req.user.save();

    if (req.user.tokens.length <= 0) {
      res.status(200).json("You are no longer signed in.");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
  Log out user from all devices
*/
router.post("/user/me/logoutall", auth, async (req, res) => {
  try {
    if (req.user.tokens.length <= 0) {
      res.status(400).json("Please login.");
    }
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
