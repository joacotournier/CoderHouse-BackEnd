import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import dotenv from "dotenv";
import { ProductModel } from "./models/product.model.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import { connectDB } from "./config/database.mjs";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// Handlebars configuration
app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (v1, v2) => v1 === v2,
      multiply: (a, b) => (a * b).toFixed(2),
    },
  })
);
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

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io configuration
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("New client connected");

  // Send all products when a client connects
  try {
    const products = await ProductModel.find();
    socket.emit("products", products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  // Listen for new products
  socket.on("newProduct", async (product) => {
    try {
      const newProduct = await ProductModel.create(product);
      const updatedProducts = await ProductModel.find();
      io.emit("products", updatedProducts);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  });

  // Listen for product deletions
  socket.on("deleteProduct", async (productId) => {
    try {
      await ProductModel.findByIdAndDelete(productId);
      const updatedProducts = await ProductModel.find();
      io.emit("products", updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  });
});

export { io };
