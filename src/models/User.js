const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');

const User = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

// User.pre("save", async function () {
//   this.password = await bcrypt.hash(this.password, 12);
// });
User.methods.hashPassword = async function (password) {
    this.password = await bcrypt.hash(password, 12);
};

User.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("user", User);
