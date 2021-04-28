import express from "express";
import Order from "../models/orderModel";
import { isAuth, isAdmin } from "../util";

const router = express.Router();

router.get("/", isAuth, async (req, res) => {
  const orders = await Order.find({}).populate("user");
  res.send(orders);
});

router.get("/mine", isAuth, async (req, res) => {
  await Order.find({ user: req.user._id })
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(500).json("Error: " + err));
});

router.get("/:id", isAuth, async (req, res) => {
  await Order.findOne({ _id: req.user._id })
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(500).json("Error: " + err));
});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  await Order.findOneAndRemove({ _id: req.params.id })
    .then(() => res.status(200).json("Order Deleted"))
    .catch((err) => res.status(500).json("Error: " + err));
});

router.post("/", isAuth, async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });

  await newOrder
    .save()
    .then((createdOrder) =>
      res.status(201).json({ msg: "New Order Created", data: createdOrder })
    )
    .catch((err) => res.status(500).json("Error: " + err));
});

router.put("/:id/pay", isAuth, async (req, res) => {
  await Order.findById(req.params.id)
    .then((order) => {
      order.isPaid = true;
      order.paidAt = Data.now();
      order.payment = {
        paymentMethod: "paypal",
        paymentResult: {
          payerId: req.body.payerId,
          orderId: req.body.orderId,
          paymentId: req.body.paymentId,
        },
      };

      order
        .save()
        .then((updatedOrder) =>
          res.status(200).json({ msg: "Order Paid", order: updatedOrder })
        )
        .catch((err) => res.status(500).json("Error: " + err));
    })
    .catch((err) => res.status(500).json("Error: " + err));
});

export default router;
