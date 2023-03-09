const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validat(value) {
      if (validator.isEmail(value))
        throw new Error("Email is invild.........!");
    },
  },

  password: {
    type: String,
    required: true,
    validat(value) {
      if (validator.isStrongPassword(value)) {
        throw new Error("Password is invild.........!");
      }
    },
  },
  street: { type: String, required: true },
  apartment: { type: String, required: true },
  city: { type: String, required: true },
  postalcode: {
    type: String,
    required: true,
    validat(value) {
      if (validator.isPostalCode(value))
        throw new Error("PostalCode is invild.........!");
    },
  },
  country: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validat(value) {
      if (validator.isMobilePhone(value))
        throw new Error("Mobile number is invild.........!");
    },
  },
  isAdmin: { type: Boolean, required: true },
});

userSchema.virtual("id").get(() => {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("users", userSchema);
