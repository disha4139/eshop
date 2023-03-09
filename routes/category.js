const express = require("express");
const router = express.Router();
const Category = require("../Models/categoryModel");
const upload = require("../controller/imageupload");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded());

//get
router.get("/", async (req, res) => {
  const dataList = await Category.find({});

  if (!dataList) throw res.send("Category empty......!");
  res.send(dataList);
});

router.get("/:id", async (req, res) => {
  const data = await Category.find(req.params.id);

  if (!data) throw res.send("Category empty......!");
  res.send(data);
});

router.post(
  "/insert",
  upload.fields([{ name: "icon" }, { name: "image" }]),
  async (req, res) => {
    let categoryDetail = new Category({
      name: req.body.name,
      color: req.body.color,
      icon: `localhost:${process.env.PORT}/${req.files.icon[0].path}`,
      image: `localhost:${process.env.PORT}/${req.files.image[0].path}`,
    });
    categoryDetail = await categoryDetail.save();
    if (!categoryDetail) throw res.send("category is not created....!");
    res.send(categoryDetail);
  }
);

router.patch(
  "/:id",
  upload.fields([{ name: "icon" }, { name: "image" }]),
  async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      color: req.body.color,
      icon: `localhost:${process.env.PORT}/${req.files.icon[0].path}`,
      image: `localhost:${process.env.PORT}/${req.files.image[0].path}`,
    });
    if (!category) throw res.send("Data is not updating....!");
    res.send(category);
  }
);

router.delete("/:id", async (req, res) => {
  await Category.findByIdAndRemove(req.params.id)
    .then(() => {
      res.send("Delete category....!");
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/404/404.html"));
});

module.exports = router;

//aggregation

// const dataList = await Category.aggregate([
//   {
//     $project: {
//       name: 1,
//       color: 1,
//       images: ["$icon", "$image"],
//     },
//   },
// ]);
