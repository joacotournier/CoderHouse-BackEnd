import express from "express";
import { CartModel } from "../models/cart.model.js";

const router = express.Router();

// Get cart by ID with populated products
router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Create new cart
router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Update entire cart
router.put("/:cid", async (req, res) => {
  try {
    const updatedCart = await CartModel.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true }
    ).populate("products.product");

    if (!updatedCart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

// Update product quantity in cart
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: "error",
        error: "Quantity must be a positive number",
      });
    }

    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === req.params.pid
    );

    if (productIndex === -1) {
      return res.status(404).json({
        status: "error",
        error: "Product not found in cart",
      });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await CartModel.findById(req.params.cid).populate(
      "products.product"
    );

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

// Remove product from cart
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== req.params.pid
    );

    await cart.save();

    const updatedCart = await CartModel.findById(req.params.cid).populate(
      "products.product"
    );

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Clear cart
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    cart.products = [];
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
