const express = require("express");
const bcryptjs = require("bcryptjs");
const Users = require("../Models/userModel");
const jasonwebtoken = require("jsonwebtoken");
const auth = require("../Helpers/auth");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

//json format data
router.use(express.json());
router.use(express.urlencoded());

//GET USER
router.get("/", auth, async (req, res) => {
  const userList = await Users.find({});

  if (!userList) {
    res.status(500).send("Users List not find ..........!");
  }
  res.status(200).send(userList);
});

//LOGIN USER
router.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("The user not found");
  }
  console.log(user);
  if (user && bcryptjs.compareSync(req.body.password, user.password)) {
    const token = jasonwebtoken.sign(
      {
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET
    );
    res.cookie("jwt", token).send("Login Successful.......!");
  } else {
    res.status(400).send("Incorrect password......!");
  }
});

//POST USER
router.post("/register", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (user) throw res.send("This user already exist......!");

    let userDetails = new Users({
      name: req.body.name,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 10),
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      postalcode: req.body.postalcode,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    });

    userDetails = await userDetails.save();

    res.send(userDetails);
  } catch {
    res.send("try again.....!");
  }
});

//UPDATE USER
router.patch("/:id", auth, async (req, res) => {
  const user = await Users.findByIdAndUpdate(
    req.params.id,
    {
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 10),
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      postalcode: req.body.postalcode,
      country: req.body.country,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!user) throw res.send("User Not update......!");
  res.send(`User updated...! \n ${user}`);
});

//DELETE USER
router.delete("/", auth, async (req, res) => {
  await Users.findByIdAndRemove(req.query.id)
    .then(() => {
      res.status(200).send("User is delete.......!");
    })
    .catch(() => {
      res.status(200).send("User is not delete.......!");
    });
});

//LOGOUT
router.get("/logout", (req, res) => {
  res.clearCookie("jwt").send("Logout Succesful.....!");
});
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/404/404.html"));
});

module.exports = router;

// const userList = await Users.aggregate([
//   {
//     $project: {
//       name: 1,
//       email: 1,
//       Address: {
//         $concat: [
//           "$street",
//           ",",
//           "$apartment",
//           ",",
//           "$city",
//           ",",
//           "$country",
//           "-",
//           "$postalcode",
//         ],
//       },
//       phone: 1,
//     },
//   },
// ]);

// const userList = await Users.aggregate([
//   {
//     $match: { postalcode: { $eq: "785634" } },
//   },
//   { $count: "total_postalcode" },
// ]);
