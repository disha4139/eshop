const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderitems: [
    { type: mongoose.Schema.Types.ObjectId, ref: "orderitems", required: true },
  ],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String },
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
  status: { type: String, required: true, default: "Pending" },
  totalPrice: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  dateOrdered: { type: Date, default: Date.now() },
});

orderSchema.virtual("id").get(() => {
  return this._id;
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("orders", orderSchema);
