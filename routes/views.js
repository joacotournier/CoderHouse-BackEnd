import express from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

const router = express.Router();

// Products list view with pagination
router.get("/products", async (req, res) => {
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

    const baseUrl = `${req.protocol}://${req.get("host")}${
      req.baseUrl
    }/products`;

    res.render("products", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
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
      limit,
      sort,
      query,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", { error: "Failed to load products" });
  }
});

// Product detail view
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).render("error", { error: "Product not found" });
    }
    res.render("product-detail", { product });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .render("error", { error: "Failed to load product details" });
  }
});

// Cart view
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(404).render("error", { error: "Cart not found" });
    }

    // Helper function to calculate total
    const calculateTotal = (products) => {
      return products
        .reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0)
        .toFixed(2);
    };

    // Helper function to multiply numbers
    const multiply = (a, b) => (a * b).toFixed(2);

    res.render("cart", {
      cart,
      helpers: {
        calculateTotal,
        multiply,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", { error: "Failed to load cart" });
  }
});

// Home page redirect to products
router.get("/", (req, res) => {
  res.redirect("/products");
});

export default router;
