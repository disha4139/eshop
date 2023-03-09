const express = require("express");
const router = express.Router();
const Products = require("../Models/productModel");
const upload = require("../controller/imageupload");
const cookieParser = require("cookie-parser");
const auth = require("../Helpers/auth");
router.use(cookieParser());

router.use(express.json());
router.use(express.urlencoded());

router.get("/", async (req, res) => {
  const productList = await Products.find({});
  if (!productList) throw res.send("Products is empty....!");
  res.send(productList);
});

router.get("/:id", async (req, res) => {
  const productList = await Products.find(req.params.id);
  if (!productList) throw res.send("Products is empty....!");
  res.send(productList);
});

router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "images", maxCount: 3 }]),
  async (req, res) => {
    let images = [];
    req.files.images.forEach((element) => {
      images.push(`localhost:${process.env.PORT}/${element.path}`);
    });
    const product = await Products.create({
      name: req.body.name,
      description: req.body.description,
      richdescription: req.body.richdescription,
      image: `localhost:${process.env.PORT}/${req.files.image[0].path}`,
      images: images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    });
    if (!product) throw res.send("Product is not insert....!");
    res.send(product);
  }
);

router.patch(
  "/:id",
  upload.fields([{ name: "image" }, { name: "images", maxCount: 3 }]),
  async (req, res) => {
    let images = [];
    req.files.images.forEach((element) => {
      images.push(`localhost:${process.env.PORT}/${element.path}`);
    });

    const product = await Products.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      richdescription: req.body.richdescription,
      image: `localhost:${process.env.PORT}/${req.files.image[0].path}`,
      images: images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    });
    if (!product) throw res.send("Product Is not updating.....!");
    res.send(product);
  }
);

router.delete("/:id", auth, async (req, res) => {
  await Products.findByIdAndRemove(req.params.id)
    .then(() => {
      res.send("Delete successfully ....!");
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/404/404.html"));
});
module.exports = router;

/* {
    
        "name": "Macbook Air",
            "description": "The MacBook Air has an anodized aluminum casing that is 0.16 inches at its thinnest point and 0.76 inches at its thickest. Often described as the same size as a pad of paper, the laptop has just one USB port, an audio headphone jack and built-in speakers and microphone.",
                "richdescription": "https://www.apple.com/in/macbook-air-m1/",
            "brands": "Apple",
                "price": 99999,
                    "category": "63c8d24a90e8188aac67f726",
    "countInStock": 999,
    "rating": 5,
    "isFeatured": true,
    "dataCreated": 20230119
} */

// const productList = await Products.aggregate([
//   {
//     $project: {
//       name: 1,
//       information: { $concat: ["$description", "-", "$richdescription"] },
//       images: { $concatArrays: [["$image"], "$images"] },
//       brand: 1,
//       stock: { countInStock: 1 },
//       rating: 1,
//     },
//   },
//   {
//     $lookup: {
//       from: "categories",
//       localField: "category",
//       foreignField: "id",
//       as: "category",
//     },
//   },
// ]);
