const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  image: { type: String, required: true },
});

categorySchema.virtual("id").get(() => {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("categories", categorySchema);
