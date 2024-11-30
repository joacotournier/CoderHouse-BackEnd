import express from "express";
import { ProductModel } from "../models/product.model.js";

const router = express.Router();

// Get all products with pagination, filtering, and sorting
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === "desc" ? -1 : 1 } : undefined,
    };

    const queryObject = {};
    if (query) {
      queryObject.$or = [
        { category: { $regex: query, $options: "i" } },
        { status: query === "available" ? true : false },
      ];
    }

    const result = await ProductModel.paginate(queryObject, options);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Get product by ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", error: "Product not found" });
    }
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Create new product
router.post("/", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

// Update product
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: "error", error: "Product not found" });
    }
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

// Delete product
router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "error", error: "Product not found" });
    }
    res.json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
