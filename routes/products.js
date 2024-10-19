import express from "express";
const router = express.Router();
import ProductManager from "../managers/ProductManager";
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getAllProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "No se encuentra el product" });
  }
});

router.post("/", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.json(newProduct);
});

router.put("/:pid", async (req, res) => {
  const updatedProduct = await productManager.updateProduct(
    Number(req.params.pid),
    req.body
  );
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: "No se encuentra el product" });
  }
});

router.delete("/:pid", async (req, res) => {
  await productManager.deleteProduct(Number(req.params.pid));
  res.json({ message: "Product deleted" });
});

module.exports = router;
