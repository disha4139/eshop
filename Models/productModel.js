const mongoose = require("mongoose");
const { array } = require("../controller/imageupload");

const productSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  richdescription: { type: String, require: true },
  image: { type: String, require: true },
  images: { type: Array, require: true },
  brand: { type: String, require: true },
  price: { type: Number, require: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    require: true,
  },
  countInStock: { type: Number, require: true },
  rating: { type: Number, min: -5, max: 5, default: 0 },
  isFeatured: { type: Boolean, require: true },
  dateCreated: { type: Date, default: Date.now() },
});

productSchema.virtual("id").get(() => {
  return this._id;
});

productSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("products", productSchema);
