const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Orders = require("../Models/orderModel");
const Orderitem = require("../Models/orderitemsModel");
const users = require("../Models/userModel");
const Products = require("../Models/productModel");
router.use(express.json());
router.use(express.urlencoded());
const cookieParser = require("cookie-parser");
const auth = require("../Helpers/auth");
router.use(cookieParser());

router.get("/", auth, async (req, res) => {
  const orderList = await Orders.aggregate([
    {
      $project: {
        Address: {
          $concat: [
            "$shippingAddress1",
            "$shippingAddress2",
            "$city",
            "$country",
            "$postalcode",
          ],
        },
        status: 1,
        phone: 1,
        totalPrice: 1,
        user: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetail",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
  ]);
  if (orderList.length == 0) throw res.send("OrderList is empty....!");
  else res.send(orderList);
});

router.post("/", auth, async (req, res) => {
  console.log(orderItemsIds);
  let order = new Orders({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    postalcode: req.body.postalcode,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: 1,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  // orderItemsIdsResolved.map(async (orderItemId) => {
  //   const orderItem = await Orderitem.findById(orderItemId).populate(
  //     "product",
  //     "countInStock"
  //   );
  //   const Stock = orderItem.product.countInStock - orderItem.quantity;
  //   const updatedata = await Products.findByIdAndUpdate(orderItem.product.id, {
  //     countInStock: Stock,
  //   });
  //   if (!updatedata) throw res.send("not update....!");
  // });

  res.status(200).send(order);
});

// Update Data
router.patch("/:id", auth, async (req, res) => {
  const order = await Orders.findByIdAndUpdate(
    req.params.id,
    {
      orderiterms: req.body.orderiterms,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      postalcode: req.body.postalcode,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
    },
    { new: true }
  );
  if (!order) return res.status(500).send("The Order cannot be Update.....!");
  res.send(order);
});

// Delete Data
router.delete("/:id", auth, async (req, res) => {
  const order = await Orders.findByIdAndRemove(req.params.id);

  if (!order) return res.status(500).send("The Order cannot be deleted.....!");
  res.send({ massage: "The Order is deleted" });
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/404/404.html"));
});
module.exports = router;

// const orderItemsIds = Promise.all(
//   req.body.orderitems.map(async (orderitem) => {
//     let newOrderItem = new Orderitem({
//       quantity: orderitem.quantity,
//       product: orderitem.product,
//     });
//     newOrderItem = await newOrderItem.save();
//     return newOrderItem._id;
//   })
// );

// const orderItemsIdsResolved = await orderItemsIds;
// const totalPrices = await Promise.all(
//   orderItemsIdsResolved.map(async (orderItemId) => {
//     const orderItem = await Orderitem.findById(orderItemId).populate(
//       "product",
//       "price"
//     );
//     const totalPrice = orderItem.product.price * orderItem.quantity;
//     return totalPrice;
//   })
// );

// const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
