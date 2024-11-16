import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const productManager = new ProductManager();

// Handlebars configuration
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", viewsRouter);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io configuration
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("New client connected");

  // Send all products when a client connects
  const products = await productManager.getAllProducts();
  socket.emit("products", products);

  // Listen for new products
  socket.on("newProduct", async (product) => {
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getAllProducts();
    io.emit("products", updatedProducts);
  });

  // Listen for product deletions
  socket.on("deleteProduct", async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getAllProducts();
    io.emit("products", updatedProducts);
  });
});

export { io };
