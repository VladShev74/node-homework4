const passport = require('passport');
const { User } = require("../models");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user) {
      const existingUser = await User.findById(req.user._id);
      res.status(401).json({ message: "Not authorized"});
      req.user.token = null;
      await existingUser.save();
      return;
    }

    req.user = user;
    next();
  })(req, res, next);
}