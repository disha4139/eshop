const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv/config");
const path = require("path");
const router = require("./routes/user");
const app = express();
const PORT = process.env.PORT;

//cors
app.use(cors());
app.options("*", cors());

//morgan
app.use(morgan("tiny"));

//Mongoose
mongoose.pluralize(null);
mongoose.set("strictQuery", true);

//Database Connection
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected ...");
  })
  .catch((err) => {
    console.log(err);
  });

//default
app.get("/", (req, res) => {
  res.send("Defualt page.....");
});

//images
app.use("/images", express.static("images"));

//user
app.use("/user", require("./routes/user"));

//category
app.use("/category", require("./routes/category"));

//Products
app.use("/product", require("./routes/product"));

//orders
app.use("/order", require("./routes/order"));

//404
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/templates/404/404.html"));
});

app.listen(PORT, () => {
  console.log(`server connected on localhost:${PORT}`);
});
