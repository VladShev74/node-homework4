const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(409).json({ message: "This email is already in use." });
      return;
    }

    const newUser = new User(req.body);
    await newUser.hashPassword(req.body.password);
    await newUser.save();

    const payload = {
      _id: newUser._id,
    };

    const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: {
        newUser,
        token: jwToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.validPassword(req.body.password))) {
      res.status(400).json({ message: "Email or password is wrong." });
      return;
    }

    const payload = {
      _id: user._id,
    };

    const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: {
        user,
        token: jwToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.logout = async (req, res) => {
  try {
    const existingUser = await User.findById(req.user._id);

    if (!existingUser) {
      res.status(401).json({ message: "Not authorized." });
      return;
    }

    req.user.token = null;
    await existingUser.save();
    res.status(204).json({ message: "User logged out." });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.current = async (req, res) => {
  try {
    const existingUser = await User.findById(req.user._id);

    if (!existingUser) {
      res.status(401).json({ message: "Not authorized." });
      return;
    }

    res.json({
      email: existingUser.email,
      subscription: existingUser.subscription,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
