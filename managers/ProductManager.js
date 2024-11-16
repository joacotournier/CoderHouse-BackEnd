import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
  }

  async getAllProducts() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find((product) => product.id === id);
  }

  async addProduct(product) {
    const products = await this.getAllProducts();
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      ...product,
    };
    products.push(newProduct);
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(products, null, 2)
    );
    return newProduct;
  }

  async updateProduct(id, updatedProduct) {
    const products = await this.getAllProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct, id };
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(products, null, 2)
      );
      return products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    const products = await this.getAllProducts();
    const updatedProducts = products.filter((product) => product.id !== id);
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(updatedProducts, null, 2)
    );
    return true;
  }
}

export default ProductManager;
