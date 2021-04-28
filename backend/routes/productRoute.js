import express from "express";
import { isAuth, isAdmin } from "../util";
import Product from "../models/productModel";

const router = express.Router();

router.get("/", async (req, res) => {
  const category = req.query.cateogry ? { category: req.query.category } : {};
  const searchKeyword = req.query.searchKeyword
    ? {
        name: {
          $regex: req.query.searchKeyword,
          $options: "i",
        },
      }
    : {};

  const sortOrder = req.query.sortOrder
    ? req.query.sortOrder === "lowest"
      ? { price: -1 }
      : { price: 1 }
    : { _id: -1 };

  await Product.find({ ...category, ...searchKeyword })
    .sort(sortOrder)
    .then((products) => res.status(200).json(products))
    .catch((err) => res.status(500).json("Error: " + err));
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ msg: "Product not found" });
  }
});

router.post("/", isAuth, isAdmin, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  });

  const newProduct = await product.save();

  if (newProduct) {
    return res
      .status(201)
      .send({ msg: "New Product Created", data: newProduct });
  }

  return res.status(500).send({ msg: "Error in creating new product" });
});

router.put("/:id", isAuth, isAdmin, async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    const updatedProduct = await product.save();

    if (updatedProduct) {
      return res
        .status(200)
        .send({ msg: "Product Updated", data: updatedProduct });
    }
  }

  return res.status(500).send({ msg: "Error in updating product" });
});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  const deletedProduct = await Product.findById(req.params.id);

  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ msg: "Product Deleted" });
  } else {
    res.send({ msg: "Error in Deletetion" });
  }
});

export default router;
