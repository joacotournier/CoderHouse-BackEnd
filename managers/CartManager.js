import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/carts.json");
  }

  async getAllCarts() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getAllCarts();
    return carts.find((cart) => cart.id === id);
  }

  async createCart() {
    const carts = await this.getAllCarts();
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getAllCarts();
    const cart = carts.find((cart) => cart.id === cartId);
    if (cart) {
      const existingProduct = cart.products.find(
        (p) => p.product === productId
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(carts, null, 2)
      );
      return cart;
    }
    return null;
  }
}

export default CartManager;
