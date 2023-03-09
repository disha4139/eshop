const mongoose = require("mongoose");

const orderitemsSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

orderitemsSchema.virtual("id").get(() => {
  return this._id;
});
orderitemsSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("orderitems", orderitemsSchema);
